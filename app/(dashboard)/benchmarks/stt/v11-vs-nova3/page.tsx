"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { ChevronLeft } from "lucide-react";

// ── Data ──────────────────────────────────────────────────────────────────────

interface WerRow    { lang: string; model: string; wer: number; mwer: number; }
interface EntityRow { lang: string; model: string; entity: number; }

const WER_DATA: WerRow[] = [
  { lang: "en-NA",   model: "V11-11.4.0",      wer: 22.328, mwer:  7.227 },
  { lang: "en-NA",   model: "nova-3-multi",     wer: 20.201, mwer:  7.525 },
  { lang: "en-NA",   model: "nova-3 (en)",      wer: 19.43,  mwer:  6.926 },
  { lang: "en-INTL", model: "V11-11.4.0",       wer: 29.455, mwer: 13.641 },
  { lang: "en-INTL", model: "nova-3-multi",     wer: 28.308, mwer: 13.599 },
  { lang: "en-INTL", model: "nova-3 (en)",      wer: 27.07,  mwer: 12.188 },
  { lang: "en-INTL", model: "nova-3 (en-GB)",   wer: 27.084, mwer: 12.144 },
  { lang: "de",      model: "V11-11.4.0",       wer: 26.85,  mwer: 10.94  },
  { lang: "de",      model: "nova-3-multi",     wer: 23.25,  mwer: 10.99  },
  { lang: "de",      model: "nova-3 (de)",      wer: 25.46,  mwer: 10.81  },
  { lang: "pt",      model: "V11-11.4.0",       wer: 29.887, mwer: 15.926 },
  { lang: "pt",      model: "nova-3-multi",     wer: 23.213, mwer: 17.035 },
  { lang: "pt",      model: "nova-3 (pt)",      wer: 23.192, mwer: 15.855 },
  { lang: "pt",      model: "nova-3 (ptbr)",    wer: 28.152, mwer: 14.226 },
  { lang: "es",      model: "V11-11.4.0",       wer: 32.066, mwer: 18.153 },
  { lang: "es",      model: "nova-3-multi",     wer: 19.733, mwer: 12.281 },
  { lang: "es",      model: "nova-3 (es)",      wer: 22.448, mwer: 14.115 },
  { lang: "es",      model: "nova-3 (es-419)",  wer: 28.706, mwer: 13.865 },
  { lang: "fr-CA",   model: "V11-11.4.0",       wer: 39.092, mwer: 22.564 },
  { lang: "fr-CA",   model: "nova-3-multi",     wer: 32.251, mwer: 23.444 },
  { lang: "fr-CA",   model: "nova-3 (fr)",      wer: 36.288, mwer: 21.817 },
  { lang: "fr-EU",   model: "V11-11.4.0",       wer: 44.82,  mwer: 28.12  },
  { lang: "fr-EU",   model: "nova-3-multi",     wer: 33.8,   mwer: 24.32  },
  { lang: "fr-EU",   model: "nova-3 (fr)",      wer: 43.65,  mwer: 26.97  },
  { lang: "it",      model: "V11-11.4.0",       wer: 23.13,  mwer: 11.75  },
  { lang: "it",      model: "nova-3-multi",     wer: 25.23,  mwer: 16.02  },
  { lang: "it",      model: "nova-3 (it)",      wer: 24.41,  mwer: 12.105 },
  { lang: "jp",      model: "V11-11.4.0",       wer: 17.17,  mwer:  9.495 },
  { lang: "jp",      model: "nova-3-multi",     wer: 18.0,   mwer: 12.57  },
  { lang: "jp",      model: "nova-3 (jp)",      wer: 18.62,  mwer: 10.745 },
];

const ENTITY_DATA: EntityRow[] = [
  { lang: "en-NA",   model: "V11-11.4.0",       entity: 85.507 },
  { lang: "en-NA",   model: "nova-3-multi",     entity: 81.76  },
  { lang: "en-NA",   model: "nova-3 (en)",      entity: 85.03  },
  { lang: "en-INTL", model: "V11-11.4.0",       entity: 77.76  },
  { lang: "en-INTL", model: "nova-3-multi",     entity: 75.43  },
  { lang: "en-INTL", model: "nova-3 (en)",      entity: 78.77  },
  { lang: "en-INTL", model: "nova-3 (en-GB)",   entity: 78.76  },
  { lang: "de",      model: "V11-11.4.0",       entity: 69.71  },
  { lang: "de",      model: "nova-3-multi",     entity: 75.71  },
  { lang: "de",      model: "nova-3 (de)",      entity: 71.14  },
  { lang: "pt",      model: "V11-11.4.0",       entity: 79.56  },
  { lang: "pt",      model: "nova-3-multi",     entity: 74.63  },
  { lang: "pt",      model: "nova-3 (pt)",      entity: 78.58  },
  { lang: "pt",      model: "nova-3 (ptbr)",    entity: 78.58  },
  { lang: "es",      model: "V11-11.4.0",       entity: 68.798 },
  { lang: "es",      model: "nova-3-multi",     entity: 74.06  },
  { lang: "es",      model: "nova-3 (es)",      entity: 75.75  },
  { lang: "es",      model: "nova-3 (es-419)",  entity: 75.94  },
];

const MODEL_COLORS: Record<string, string> = {
  "V11-11.4.0":      "#3b82f6",
  "nova-3-multi":    "#a855f7",
  "nova-3 (en)":     "#22c55e",
  "nova-3 (en-GB)":  "#4ade80",
  "nova-3 (de)":     "#22c55e",
  "nova-3 (es)":     "#22c55e",
  "nova-3 (es-419)": "#4ade80",
  "nova-3 (fr)":     "#22c55e",
  "nova-3 (it)":     "#22c55e",
  "nova-3 (jp)":     "#22c55e",
  "nova-3 (pt)":     "#22c55e",
  "nova-3 (ptbr)":   "#4ade80",
};

const MODEL_FAMILIES = [
  { key: "V11-11.4.0",   color: "#3b82f6", label: "V11-11.4.0"            },
  { key: "nova-3",       color: "#22c55e", label: "nova-3"                 },
  { key: "nova-3-dial",  color: "#4ade80", label: "nova-3 (dialect variant)" },
  { key: "nova-3-multi", color: "#a855f7", label: "nova-3-multi"           },
];

const WER_LANGS    = ["en-NA","en-INTL","de","pt","es","fr-CA","fr-EU","it","jp"];
const ENTITY_LANGS = ["en-NA","en-INTL","de","pt","es"];

const LANG_NAMES: Record<string, string> = {
  de:        "German",
  "en-INTL": "English (Intl)",
  "en-NA":   "English (NA)",
  es:        "Spanish (LA)",
  "fr-CA":   "French (CA)",
  "fr-EU":   "French (EU)",
  it:        "Italian",
  jp:        "Japanese",
  pt:        "Portuguese (BR)",
};

// ── Helpers ───────────────────────────────────────────────────────────────────

function sortKey(m: string) {
  if (m === "V11-11.4.0")     return "1";
  if (m === "nova-3-multi")   return "2";
  if (m.startsWith("nova-3")) return "3_" + m;
  return "9_" + m;
}

function getFamily(m: string) {
  if (m === "V11-11.4.0")   return "V11-11.4.0";
  if (m === "nova-3-multi") return "nova-3-multi";
  if (["nova-3 (en-GB)","nova-3 (es-419)","nova-3 (ptbr)"].includes(m)) return "nova-3-dial";
  if (m.startsWith("nova-3")) return "nova-3";
  return "other";
}

function hexAlpha(hex: string, a: number) {
  const r = parseInt(hex.slice(1, 3), 16);
  const g = parseInt(hex.slice(3, 5), 16);
  const b = parseInt(hex.slice(5, 7), 16);
  return `rgba(${r},${g},${b},${a})`;
}

function shortLabel(m: string) {
  if (m === "V11-11.4.0")   return "V11-11.4.0";
  if (m === "nova-3-multi") return "n3-multi";
  return m.replace("nova-3", "n3").replace(" (", "(");
}

const AXIS = {
  ticks:  { color: "rgba(148,163,184,0.7)", font: { family: "monospace", size: 9 } },
  grid:   { color: "rgba(255,255,255,0.05)" },
  border: { color: "rgba(42,49,64,0.8)" },
};

// ── Types ─────────────────────────────────────────────────────────────────────

type TabType    = "entity" | "wer";
type MetricType = "both" | "wer" | "mwer";

// ── Sub-components (defined at module level — NOT inside the page component)  ─
// Defining components inside another component gives them a new identity on
// every render, causing React to unmount+remount them and clearing the canvas.

function Legend({
  hiddenFamilies,
  onToggle,
  subtitle,
}: {
  hiddenFamilies: Set<string>;
  onToggle: (key: string) => void;
  subtitle?: string;
}) {
  return (
    <div
      className="rounded-xl p-4 mb-5 flex flex-wrap gap-1.5 items-center"
      style={{ background: "var(--card)", border: "1px solid var(--border)" }}
    >
      <div
        className="w-full mb-1 text-xs uppercase tracking-wider"
        style={{ color: "var(--muted-foreground)", fontFamily: "monospace" }}
      >
        Models — click to show/hide{subtitle ? ` · ${subtitle}` : ""}
      </div>
      {MODEL_FAMILIES.map(f => (
        <button
          key={f.key}
          onClick={() => onToggle(f.key)}
          className="flex items-center gap-1.5 rounded px-2 py-1 text-xs transition-all hover:bg-white/5"
          style={{
            background: "transparent",
            border:     "1px solid transparent",
            color:      "var(--foreground)",
            opacity:    hiddenFamilies.has(f.key) ? 0.35 : 1,
            cursor:     "pointer",
          }}
        >
          <span className="w-2.5 h-2.5 flex-shrink-0 rounded-sm" style={{ background: f.color }} />
          {f.label}
        </button>
      ))}
    </div>
  );
}

function ChartCard({
  lang,
  canvasRef,
}: {
  lang: string;
  canvasRef: (el: HTMLCanvasElement | null) => void;
}) {
  return (
    <div
      className="rounded-xl p-4"
      style={{ background: "var(--card)", border: "1px solid var(--border)" }}
    >
      <h2
        className="flex items-center gap-2 mb-3 text-xs font-semibold uppercase tracking-wider"
        style={{ color: "var(--muted-foreground)", fontFamily: "monospace" }}
      >
        <span
          className="rounded px-2 py-0.5 text-xs"
          style={{ background: "var(--secondary)", border: "1px solid var(--border)", color: "#58a6ff" }}
        >
          {lang.toUpperCase()}
        </span>
        {LANG_NAMES[lang] ?? lang}
      </h2>
      <div className="relative" style={{ height: "clamp(200px, 25vw, 300px)" }}>
        <canvas ref={canvasRef} />
      </div>
    </div>
  );
}

// ── Page ──────────────────────────────────────────────────────────────────────

export default function V11VsNova3Page() {
  const [activeTab,      setActiveTab     ] = useState<TabType   >("entity");
  const [metric,         setMetric        ] = useState<MetricType>("both");
  const [hiddenFamilies, setHiddenFamilies] = useState<Set<string>>(new Set());
  const [chartJsLoaded,  setChartJsLoaded ] = useState(false);

  // Canvas element refs — keyed by lang code
  const werCanvasRefs    = useRef<Record<string, HTMLCanvasElement | null>>({});
  const entityCanvasRefs = useRef<Record<string, HTMLCanvasElement | null>>({});

  // Chart instance refs — destroyed and rebuilt on each redraw
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const werChartsRef    = useRef<Record<string, any>>({});
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const entityChartsRef = useRef<Record<string, any>>({});

  // ── Load Chart.js from CDN once ───────────────────────────────────────────
  useEffect(() => {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    if ((window as any).Chart) { setChartJsLoaded(true); return; }
    const script = document.createElement("script");
    script.src = "https://cdnjs.cloudflare.com/ajax/libs/Chart.js/4.4.1/chart.umd.min.js";
    script.onload = () => setChartJsLoaded(true);
    document.head.appendChild(script);
  }, []);

  // ── Redraw charts whenever tab, metric, hidden models, or load state changes.
  //    requestAnimationFrame defers the draw to after the browser has painted the
  //    freshly-mounted (or newly-visible) canvases so their dimensions are ready.
  useEffect(() => {
    if (!chartJsLoaded) return;

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const Chart = (window as any).Chart;
    const isHidden = (m: string) => hiddenFamilies.has(getFamily(m));

    let rafId: number;

    if (activeTab === "wer") {
      rafId = requestAnimationFrame(() => {
        // ── Build WER charts ────────────────────────────────────────────────
        Object.values(werChartsRef.current).forEach(c => c?.destroy());
        werChartsRef.current = {};

        const bothMode = metric === "both";

        const groupLabelPlugin = {
          id: "groupLabels",
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          afterDraw(chart: any) {
            const { ctx, chartArea: { top, bottom }, scales: { x } } = chart;
            const n: number = chart._modelCount;
            if (!n) return;
            const midL = (x.getPixelForValue(0) + x.getPixelForValue(n - 1)) / 2;
            const midR = (x.getPixelForValue(n + 1) + x.getPixelForValue(2 * n)) / 2;
            const gapX = x.getPixelForValue(n);
            ctx.save();
            ctx.strokeStyle = "rgba(255,255,255,0.18)";
            ctx.lineWidth   = 1;
            ctx.setLineDash([4, 3]);
            ctx.beginPath(); ctx.moveTo(gapX, top); ctx.lineTo(gapX, bottom + 4); ctx.stroke();
            ctx.setLineDash([]);
            ctx.fillStyle = "#9ca3af";
            ctx.font      = "600 9px monospace";
            ctx.textAlign = "center";
            ctx.fillText("WER",  midL, top - 4);
            ctx.fillText("mWER", midR, top - 4);
            ctx.restore();
          },
        };

        WER_LANGS.forEach(lang => {
          const canvas = werCanvasRefs.current[lang];
          if (!canvas) return;

          const langData = WER_DATA
            .filter(d => d.lang === lang && !isHidden(d.model))
            .sort((a, b) => sortKey(a.model).localeCompare(sortKey(b.model)));
          if (!langData.length) return;

          const models = langData.map(d => d.model);
          const N = models.length;

          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          let datasets: any[], slotLabels: string[], modelCount: number;

          if (bothMode) {
            // Single dataset with per-bar colors → bars fill their slot fully
            // and touch each other inside each cluster.
            const S = N + 1 + N;
            slotLabels = [...models, "", ...models];
            modelCount = N;

            const dataArr = Array<number | null>(S).fill(null);
            const bgArr   = Array<string>(S).fill("transparent");
            const bdArr   = Array<string>(S).fill("transparent");
            const bwArr   = Array<number>(S).fill(0);

            models.forEach((model, i) => {
              const row   = langData[i];
              const color = MODEL_COLORS[model] ?? "#888";
              dataArr[i]     = +row.wer.toFixed(2);
              dataArr[N+1+i] = +row.mwer.toFixed(2);
              bgArr[i]     = hexAlpha(color, 0.12); // WER = outlined
              bgArr[N+1+i] = color;                 // mWER = solid fill
              bdArr[i]     = color;
              bwArr[i]     = 2;
            });

            datasets = [{
              data: dataArr,
              backgroundColor: bgArr, borderColor: bdArr, borderWidth: bwArr,
              borderRadius: 0, barPercentage: 1.0, categoryPercentage: 1.0,
            }];
          } else {
            slotLabels = models;
            modelCount = 0;
            const isWerMode = metric === "wer";
            const colors = models.map(m => MODEL_COLORS[m] ?? "#888");

            datasets = [{
              data:            langData.map(r => isWerMode ? +r.wer.toFixed(2) : +r.mwer.toFixed(2)),
              backgroundColor: colors.map(c => isWerMode ? hexAlpha(c, 0.12) : c),
              borderColor:     colors,
              borderWidth:     isWerMode ? 2 : 0,
              borderRadius: 0, barPercentage: 1.0, categoryPercentage: 1.0,
            }];
          }

          const ch = new Chart(canvas, {
            type: "bar",
            data: { labels: slotLabels, datasets },
            options: {
              responsive: true,
              maintainAspectRatio: false,
              layout: { padding: { top: bothMode ? 16 : 8 } },
              plugins: {
                legend: { display: false },
                tooltip: {
                  // eslint-disable-next-line @typescript-eslint/no-explicit-any
                  filter: (item: any) => item.raw != null,
                  callbacks: {
                    // eslint-disable-next-line @typescript-eslint/no-explicit-any
                    title: (c: any) => {
                      if (!bothMode) return models[c[0].dataIndex] ?? "";
                      const idx = c[0].dataIndex;
                      return idx < N ? models[idx] : (idx > N ? models[idx - N - 1] : "");
                    },
                    // eslint-disable-next-line @typescript-eslint/no-explicit-any
                    label: (c: any) => {
                      if (c.raw == null) return null;
                      if (!bothMode) return `${metric === "wer" ? "WER" : "mWER"}: ${(c.raw as number).toFixed(2)}%`;
                      return `${c.dataIndex < N ? "WER" : "mWER"}: ${(c.raw as number).toFixed(2)}%`;
                    },
                  },
                },
              },
              scales: {
                x: {
                  ...AXIS,
                  ticks: {
                    ...AXIS.ticks,
                    maxRotation: 35,
                    minRotation: 20,
                    // eslint-disable-next-line @typescript-eslint/no-explicit-any
                    callback: (_v: any, i: number) => slotLabels[i] ? shortLabel(slotLabels[i]) : "",
                  },
                },
                y: {
                  beginAtZero: true,
                  max: 50,
                  // eslint-disable-next-line @typescript-eslint/no-explicit-any
                  ticks:  { ...AXIS.ticks, callback: (v: any) => v + "%" },
                  grid:   AXIS.grid,
                  border: AXIS.border,
                },
              },
            },
            plugins: [groupLabelPlugin],
          });
          ch._modelCount = modelCount;
          werChartsRef.current[lang] = ch;
        });
      });

    } else {
      rafId = requestAnimationFrame(() => {
        // ── Build Entity charts ─────────────────────────────────────────────
        Object.values(entityChartsRef.current).forEach(c => c?.destroy());
        entityChartsRef.current = {};

        ENTITY_LANGS.forEach(lang => {
          const canvas = entityCanvasRefs.current[lang];
          if (!canvas) return;

          const langData = ENTITY_DATA
            .filter(d => d.lang === lang && !isHidden(d.model))
            .sort((a, b) => sortKey(a.model).localeCompare(sortKey(b.model)));
          if (!langData.length) return;

          const models = langData.map(d => d.model);
          const values = langData.map(d => +d.entity.toFixed(2));
          const colors = langData.map(d => MODEL_COLORS[d.model] ?? "#888");

          entityChartsRef.current[lang] = new Chart(canvas, {
            type: "bar",
            data: {
              labels: models,
              datasets: [{
                label: "Entity %",
                data: values, backgroundColor: colors, borderColor: colors,
                borderWidth: 0, borderRadius: 0, barPercentage: 1.0, categoryPercentage: 1.0,
              }],
            },
            options: {
              responsive: true,
              maintainAspectRatio: false,
              plugins: {
                legend: { display: false },
                tooltip: {
                  callbacks: {
                    // eslint-disable-next-line @typescript-eslint/no-explicit-any
                    title: (c: any) => models[c[0].dataIndex] ?? "",
                    // eslint-disable-next-line @typescript-eslint/no-explicit-any
                    label: (c: any) => `Entity: ${(c.raw as number).toFixed(2)}%`,
                  },
                },
              },
              scales: {
                x: {
                  ...AXIS,
                  ticks: {
                    ...AXIS.ticks,
                    maxRotation: 35,
                    minRotation: 20,
                    // eslint-disable-next-line @typescript-eslint/no-explicit-any
                    callback: (_v: any, i: number) => shortLabel(models[i]),
                  },
                },
                y: {
                  min: 0,
                  max: 100,
                  // eslint-disable-next-line @typescript-eslint/no-explicit-any
                  ticks:  { ...AXIS.ticks, callback: (v: any) => v + "%" },
                  grid:   AXIS.grid,
                  border: AXIS.border,
                },
              },
            },
          });
        });
      });
    }

    return () => cancelAnimationFrame(rafId);
  }, [chartJsLoaded, activeTab, metric, hiddenFamilies]);

  // ── Destroy all charts on unmount ─────────────────────────────────────────
  useEffect(() => {
    return () => {
      Object.values(werChartsRef.current).forEach(c => c?.destroy());
      Object.values(entityChartsRef.current).forEach(c => c?.destroy());
    };
  }, []);

  const toggleFamily = (key: string) => {
    setHiddenFamilies(prev => {
      const next = new Set(prev);
      if (next.has(key)) next.delete(key); else next.add(key);
      return next;
    });
  };

  // ── Render ────────────────────────────────────────────────────────────────

  return (
    <div className="flex flex-col" style={{ color: "var(--foreground)" }}>

      {/* ── Header ── */}
      <div style={{ borderBottom: "1px solid var(--border)" }}>
        <div className="flex flex-col gap-1 pb-4">
          <Link
            href="/benchmarks/stt"
            className="inline-flex items-center gap-1 text-xs w-fit mb-1 hover:underline"
            style={{ color: "var(--muted-foreground)" }}
          >
            <ChevronLeft className="h-3 w-3" />
            Back to STT Benchmarks
          </Link>
          <h1 className="text-xl font-bold tracking-tight" style={{ color: "var(--foreground)" }}>
            STT Benchmark — V11.4 vs Nova-3
          </h1>
          <p className="text-xs" style={{ color: "var(--muted-foreground)", fontFamily: "monospace" }}>
            V11-11.4.0: Intermediate mode · Nova-3: Streaming mode · CC-only test sets (Customer and Agent Channels)
          </p>
          <p className="text-xs" style={{ color: "#58a6ff", fontFamily: "monospace" }}>
            WER &amp; mWER: lower is better · Entity accuracy: higher is better
          </p>
        </div>

        {/* Tab bar */}
        <div className="flex -mb-px">
          {([
            { id: "wer"    as TabType, label: "WER & mWER"     },
            { id: "entity" as TabType, label: "Entity Accuracy" },
          ] as const).map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className="px-6 py-3 text-sm font-semibold transition-all"
              style={{
                background:   "transparent",
                border:       "none",
                borderBottom: activeTab === tab.id ? "3px solid #58a6ff" : "3px solid transparent",
                color:        activeTab === tab.id ? "#58a6ff" : "var(--muted-foreground)",
                cursor:       "pointer",
              }}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* ── Content — conditional rendering so canvases mount with real dimensions ── */}
      <div className="mt-6">

        {activeTab === "wer" && (
          <div>
            {/* Metric toggle */}
            <div className="flex flex-wrap gap-3 mb-5 items-center">
              <span
                className="text-xs uppercase tracking-wider"
                style={{ color: "var(--muted-foreground)", fontFamily: "monospace" }}
              >
                Metric
              </span>
              <div
                className="flex rounded-lg overflow-hidden"
                style={{ background: "var(--secondary)", border: "1px solid var(--border)" }}
              >
                {([
                  { id: "both"  as MetricType, label: "Both"      },
                  { id: "wer"   as MetricType, label: "WER only"  },
                  { id: "mwer"  as MetricType, label: "mWER only" },
                ] as const).map((btn, idx, arr) => (
                  <button
                    key={btn.id}
                    onClick={() => setMetric(btn.id)}
                    className="px-3.5 py-1.5 text-xs font-semibold transition-all"
                    style={{
                      background:  metric === btn.id ? "#58a6ff" : "transparent",
                      color:       metric === btn.id ? "#0d1117" : "var(--muted-foreground)",
                      border:      "none",
                      borderRight: idx < arr.length - 1 ? "1px solid var(--border)" : "none",
                      cursor:      "pointer",
                    }}
                  >
                    {btn.label}
                  </button>
                ))}
              </div>
            </div>

            <Legend
              hiddenFamilies={hiddenFamilies}
              onToggle={toggleFamily}
              subtitle="outlined = WER · solid = mWER"
            />

            <div
              className="grid gap-4"
              style={{ gridTemplateColumns: "repeat(auto-fill, minmax(min(100%, 420px), 1fr))" }}
            >
              {WER_LANGS.map(lang => (
                <ChartCard
                  key={lang}
                  lang={lang}
                  canvasRef={el => { werCanvasRefs.current[lang] = el; }}
                />
              ))}
            </div>

            <p
              className="mt-4 text-xs pt-3.5"
              style={{ color: "var(--muted-foreground)", borderTop: "1px solid var(--border)", fontFamily: "monospace" }}
            >
              WER = weighted_old_wer_percent · mWER = weighted_mwer_avg_percent ·
              Outlined bars = WER · Solid bars = mWER
            </p>
          </div>
        )}

        {activeTab === "entity" && (
          <div>
            <Legend
              hiddenFamilies={hiddenFamilies}
              onToggle={toggleFamily}
            />

            <div
              className="grid gap-4"
              style={{ gridTemplateColumns: "repeat(auto-fill, minmax(min(100%, 420px), 1fr))" }}
            >
              {ENTITY_LANGS.map(lang => (
                <ChartCard
                  key={lang}
                  lang={lang}
                  canvasRef={el => { entityCanvasRefs.current[lang] = el; }}
                />
              ))}
            </div>

            <p
              className="mt-4 text-xs pt-3.5"
              style={{ color: "var(--muted-foreground)", borderTop: "1px solid var(--border)", fontFamily: "monospace" }}
            >
              Entity accuracy = weighted_entity_pct · V11-11.4.0: Intermediate mode · Nova-3: Streaming mode
            </p>
          </div>
        )}

      </div>
    </div>
  );
}
