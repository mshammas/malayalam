"use client";

import { useCallback, useEffect, useRef, useState } from "react";

/** A point in slate space: 0..1 on both axes, so drawings survive a resize. */
type Pt = { x: number; y: number };
type Stroke = { color: string; size: number; points: Pt[] };

const CHALKS = [
  { name: "White", value: "#f8f5ee" },
  { name: "Yellow", value: "#ffe066" },
  { name: "Pink", value: "#faa2c1" },
  { name: "Blue", value: "#a5d8ff" },
];
/** Line widths as a fraction of the slate's width */
const SIZES = [
  { name: "Thin", value: 0.018 },
  { name: "Medium", value: 0.03 },
  { name: "Thick", value: 0.045 },
];

type Result = { stars: 0 | 1 | 2 | 3; message: string };

/**
 * A chalk slate for practising one Malayalam letter with a finger, stylus or mouse.
 * A faint copy of the letter can be shown underneath to trace over.
 * Nothing is uploaded or stored: the drawing lives only in this page's memory.
 * Give it `key={glyph}` when the letter can change, so the slate starts clean.
 */
export function WritingSlate({ glyph, label }: { glyph: string; label: string }) {
  const wrapRef = useRef<HTMLDivElement>(null);
  const guideRef = useRef<HTMLCanvasElement>(null);
  const inkRef = useRef<HTMLCanvasElement>(null);
  const strokes = useRef<Stroke[]>([]);
  const active = useRef<{ id: number; stroke: Stroke } | null>(null);
  const fontFamily = useRef<string>("sans-serif");

  const [showGuide, setShowGuide] = useState(true);
  const [chalk, setChalk] = useState(CHALKS[0].value);
  const [size, setSize] = useState(SIZES[1].value);
  const [strokeCount, setStrokeCount] = useState(0);
  const [result, setResult] = useState<Result | null>(null);
  const [fontReady, setFontReady] = useState(false);

  // ---------- drawing helpers ----------

  const drawStroke = useCallback((ctx: CanvasRenderingContext2D, s: Stroke, w: number, h: number) => {
    const pts = s.points;
    if (pts.length === 0) return;
    ctx.strokeStyle = s.color;
    ctx.fillStyle = s.color;
    ctx.lineWidth = s.size * w;
    ctx.lineCap = "round";
    ctx.lineJoin = "round";
    if (pts.length === 1) {
      ctx.beginPath();
      ctx.arc(pts[0].x * w, pts[0].y * h, (s.size * w) / 2, 0, Math.PI * 2);
      ctx.fill();
      return;
    }
    // Smooth the line with quadratic curves through the midpoints
    ctx.beginPath();
    ctx.moveTo(pts[0].x * w, pts[0].y * h);
    for (let i = 1; i < pts.length - 1; i++) {
      const mx = ((pts[i].x + pts[i + 1].x) / 2) * w;
      const my = ((pts[i].y + pts[i + 1].y) / 2) * h;
      ctx.quadraticCurveTo(pts[i].x * w, pts[i].y * h, mx, my);
    }
    const last = pts[pts.length - 1];
    ctx.lineTo(last.x * w, last.y * h);
    ctx.stroke();
  }, []);

  /** Draws the letter centred and scaled to fit, the same way for the guide and for checking. */
  const drawGlyph = useCallback(
    (ctx: CanvasRenderingContext2D, w: number, h: number) => {
      let px = w * 0.62;
      ctx.font = `${px}px ${fontFamily.current}`;
      let m = ctx.measureText(glyph);
      const fit = Math.min((w * 0.78) / (m.actualBoundingBoxLeft + m.actualBoundingBoxRight || 1),
        (h * 0.7) / (m.actualBoundingBoxAscent + m.actualBoundingBoxDescent || 1));
      if (fit < 1) {
        px *= fit;
        ctx.font = `${px}px ${fontFamily.current}`;
        m = ctx.measureText(glyph);
      }
      const gw = m.actualBoundingBoxLeft + m.actualBoundingBoxRight;
      const gh = m.actualBoundingBoxAscent + m.actualBoundingBoxDescent;
      const x = (w - gw) / 2 + m.actualBoundingBoxLeft;
      const y = (h - gh) / 2 + m.actualBoundingBoxAscent;
      ctx.textBaseline = "alphabetic";
      ctx.textAlign = "left";
      ctx.fillText(glyph, x, y);
      return { x, y, px, top: y - m.actualBoundingBoxAscent, bottom: y + m.actualBoundingBoxDescent };
    },
    [glyph],
  );

  const sizeCanvas = (c: HTMLCanvasElement) => {
    const dpr = window.devicePixelRatio || 1;
    const { width, height } = c.getBoundingClientRect();
    c.width = Math.round(width * dpr);
    c.height = Math.round(height * dpr);
    const ctx = c.getContext("2d")!;
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    return { ctx, w: width, h: height };
  };

  const redrawGuide = useCallback(() => {
    const c = guideRef.current;
    if (!c) return;
    const { ctx, w, h } = sizeCanvas(c);
    ctx.clearRect(0, 0, w, h);
    // Copybook-style ruled lines
    ctx.strokeStyle = "rgba(255,255,255,0.14)";
    ctx.lineWidth = 2;
    ctx.setLineDash([10, 10]);
    for (const f of [0.25, 0.5, 0.75]) {
      ctx.beginPath();
      ctx.moveTo(w * 0.05, h * f);
      ctx.lineTo(w * 0.95, h * f);
      ctx.stroke();
    }
    ctx.setLineDash([]);
    if (showGuide && fontReady) {
      ctx.fillStyle = "rgba(255,255,255,0.16)";
      drawGlyph(ctx, w, h);
    }
  }, [showGuide, fontReady, drawGlyph]);

  const redrawInk = useCallback(() => {
    const c = inkRef.current;
    if (!c) return;
    const { ctx, w, h } = sizeCanvas(c);
    ctx.clearRect(0, 0, w, h);
    for (const s of strokes.current) drawStroke(ctx, s, w, h);
  }, [drawStroke]);

  // Load the Malayalam font before drawing the guide, so the letter isn't drawn in a fallback font
  useEffect(() => {
    const c = guideRef.current;
    if (!c) return;
    fontFamily.current = getComputedStyle(c).fontFamily || "sans-serif";
    let cancelled = false;
    document.fonts
      .load(`100px ${fontFamily.current}`, glyph)
      .catch(() => {})
      .finally(() => !cancelled && setFontReady(true));
    return () => {
      cancelled = true;
    };
  }, [glyph]);

  useEffect(() => {
    redrawGuide();
  }, [redrawGuide]);

  useEffect(() => {
    const el = wrapRef.current;
    if (!el) return;
    const ro = new ResizeObserver(() => {
      redrawGuide();
      redrawInk();
    });
    ro.observe(el);
    return () => ro.disconnect();
  }, [redrawGuide, redrawInk]);

  // ---------- pointer input (mouse, touch and stylus) ----------

  const toPt = (e: { clientX: number; clientY: number }): Pt => {
    const r = inkRef.current!.getBoundingClientRect();
    return {
      x: Math.min(1, Math.max(0, (e.clientX - r.left) / r.width)),
      y: Math.min(1, Math.max(0, (e.clientY - r.top) / r.height)),
    };
  };

  const onPointerDown = (e: React.PointerEvent<HTMLCanvasElement>) => {
    if (e.pointerType === "mouse" && e.button !== 0) return;
    if (active.current) return; // one finger at a time; ignores a resting palm
    e.preventDefault();
    try {
      e.currentTarget.setPointerCapture(e.pointerId);
    } catch {
      // Some pointers (e.g. synthetic ones) can't be captured; drawing still works
    }
    const stroke: Stroke = { color: chalk, size, points: [toPt(e)] };
    active.current = { id: e.pointerId, stroke };
    strokes.current.push(stroke);
    setResult(null);
    const { width: w, height: h } = e.currentTarget.getBoundingClientRect();
    drawStroke(e.currentTarget.getContext("2d")!, stroke, w, h);
  };

  const onPointerMove = (e: React.PointerEvent<HTMLCanvasElement>) => {
    const a = active.current;
    if (!a || a.id !== e.pointerId) return;
    const events = e.nativeEvent.getCoalescedEvents?.() ?? [];
    const pts = (events.length ? events : [e]).map(toPt);
    const ctx = e.currentTarget.getContext("2d")!;
    const { width: w, height: h } = e.currentTarget.getBoundingClientRect();
    // Draw just the new segment for speed; the full smoothed stroke is redrawn on undo/resize
    ctx.strokeStyle = a.stroke.color;
    ctx.lineWidth = a.stroke.size * w;
    ctx.lineCap = "round";
    ctx.lineJoin = "round";
    ctx.beginPath();
    const prev = a.stroke.points[a.stroke.points.length - 1];
    ctx.moveTo(prev.x * w, prev.y * h);
    for (const p of pts) ctx.lineTo(p.x * w, p.y * h);
    ctx.stroke();
    a.stroke.points.push(...pts);
  };

  const endStroke = (e: React.PointerEvent<HTMLCanvasElement>) => {
    if (active.current?.id !== e.pointerId) return;
    active.current = null;
    setStrokeCount(strokes.current.length);
  };

  // ---------- buttons ----------

  const undo = () => {
    strokes.current.pop();
    setStrokeCount(strokes.current.length);
    setResult(null);
    redrawInk();
  };

  const clear = () => {
    strokes.current = [];
    setStrokeCount(0);
    setResult(null);
    redrawInk();
  };

  /**
   * Compares the drawing with the letter on a small offscreen grid:
   * how much of the letter got covered, and how much chalk stayed near the letter.
   */
  const check = () => {
    const N = 160;
    const mk = () => {
      const c = document.createElement("canvas");
      c.width = c.height = N;
      return c.getContext("2d", { willReadFrequently: true })!;
    };
    const pixels = (ctx: CanvasRenderingContext2D) => ctx.getImageData(0, 0, N, N).data;

    // The letter itself, and a fattened copy that forgives wobbly lines
    const glyphCtx = mk();
    glyphCtx.fillStyle = "#000";
    drawGlyph(glyphCtx, N, N);
    const nearGlyphCtx = mk();
    nearGlyphCtx.fillStyle = nearGlyphCtx.strokeStyle = "#000";
    nearGlyphCtx.lineWidth = N * 0.07;
    nearGlyphCtx.lineJoin = "round";
    const pos = drawGlyph(nearGlyphCtx, N, N);
    nearGlyphCtx.strokeText(glyph, pos.x, pos.y);

    // The child's chalk at a fixed, fairly thick width, and a fattened copy
    const inkCtx = mk();
    const nearInkCtx = mk();
    for (const s of strokes.current) {
      drawStroke(inkCtx, { ...s, color: "#000", size: 0.03 }, N, N);
      drawStroke(nearInkCtx, { ...s, color: "#000", size: 0.1 }, N, N);
    }

    const g = pixels(glyphCtx), ng = pixels(nearGlyphCtx), ink = pixels(inkCtx), ni = pixels(nearInkCtx);
    let glyphPx = 0, covered = 0, inkPx = 0, onTarget = 0;
    for (let i = 3; i < g.length; i += 4) {
      if (g[i] > 100) {
        glyphPx++;
        if (ni[i] > 100) covered++;
      }
      if (ink[i] > 100) {
        inkPx++;
        if (ng[i] > 100) onTarget++;
      }
    }
    const coverage = glyphPx ? covered / glyphPx : 0;
    const accuracy = inkPx ? onTarget / inkPx : 0;
    const score = Math.min(coverage, accuracy);

    let r: Result;
    if (inkPx === 0) r = { stars: 0, message: "Draw the letter first, then tap Check!" };
    else if (score >= 0.78) r = { stars: 3, message: "Wonderful! That looks just right. 🎉" };
    else if (score >= 0.6) r = { stars: 2, message: "Great job! Try once more to make it even neater." };
    else if (coverage < accuracy) r = { stars: 1, message: "Good start! Some parts of the letter are still missing." };
    else r = { stars: 1, message: "Good try! Keep your chalk on the grey letter." };
    setResult(r);
  };

  const btn =
    "rounded-full border-2 border-line bg-surface px-4 py-2 font-bold text-ink hover:border-brand disabled:opacity-40 disabled:hover:border-line";

  return (
    <div className="flex flex-col items-center gap-4">
      {/* Wooden frame around a chalk slate */}
      <div
        ref={wrapRef}
        className="relative aspect-square w-full max-w-[min(32rem,70dvh)] rounded-[1.75rem] p-3 shadow-lg sm:p-4"
        style={{ background: "linear-gradient(135deg, #b5651d, #8b4513)" }}
      >
        <div className="relative h-full w-full overflow-hidden rounded-2xl" style={{ background: "#2f3b36" }}>
          <canvas ref={guideRef} aria-hidden className="pointer-events-none absolute inset-0 h-full w-full font-ml" />
          <canvas
            ref={inkRef}
            role="img"
            aria-label={`Writing slate. Draw the letter ${label} with your finger or mouse.`}
            className="absolute inset-0 h-full w-full cursor-crosshair touch-none select-none"
            onPointerDown={onPointerDown}
            onPointerMove={onPointerMove}
            onPointerUp={endStroke}
            onPointerCancel={endStroke}
            onContextMenu={(e) => e.preventDefault()}
          />
        </div>
      </div>

      <div className="flex flex-wrap items-center justify-center gap-2">
        <fieldset className="flex items-center gap-1.5">
          <legend className="sr-only">Chalk colour</legend>
          {CHALKS.map((c) => (
            <button
              key={c.value}
              type="button"
              aria-label={`${c.name} chalk`}
              aria-pressed={chalk === c.value}
              onClick={() => setChalk(c.value)}
              className={`h-9 w-9 rounded-full border-4 ${chalk === c.value ? "border-brand" : "border-line"}`}
              style={{ background: c.value }}
            />
          ))}
        </fieldset>
        <fieldset className="ml-2 flex items-center gap-1.5">
          <legend className="sr-only">Chalk size</legend>
          {SIZES.map((s, i) => (
            <button
              key={s.value}
              type="button"
              aria-label={`${s.name} chalk`}
              aria-pressed={size === s.value}
              onClick={() => setSize(s.value)}
              className={`flex h-9 w-9 items-center justify-center rounded-full border-2 bg-surface ${size === s.value ? "border-brand" : "border-line"}`}
            >
              <span className="rounded-full bg-ink" style={{ width: 6 + i * 5, height: 6 + i * 5 }} />
            </button>
          ))}
        </fieldset>
      </div>

      <div className="flex flex-wrap justify-center gap-2">
        <button type="button" className={btn} aria-pressed={showGuide} onClick={() => setShowGuide((v) => !v)}>
          {showGuide ? "🙈 Hide letter" : "👀 Show letter"}
        </button>
        <button type="button" className={btn} onClick={undo} disabled={strokeCount === 0}>
          ↩️ Undo
        </button>
        <button type="button" className={btn} onClick={clear} disabled={strokeCount === 0}>
          🧽 Wipe
        </button>
        <button
          type="button"
          onClick={check}
          disabled={strokeCount === 0 || !fontReady}
          className="rounded-full bg-brand px-5 py-2 font-bold text-brand-ink shadow disabled:opacity-40"
        >
          ✅ Check
        </button>
      </div>

      <p aria-live="polite" className="min-h-8 text-center text-lg font-semibold">
        {result && (
          <>
            {result.stars > 0 && (
              <span className="mr-2" aria-label={`${result.stars} out of 3 stars`}>
                {"⭐".repeat(result.stars)}
                <span className="opacity-25">{"⭐".repeat(3 - result.stars)}</span>
              </span>
            )}
            {result.message}
          </>
        )}
      </p>
    </div>
  );
}
