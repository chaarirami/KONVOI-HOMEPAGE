// src/components/islands/SensorDataViz.tsx
// Preact island — hydrated client:visible (scroll-into-view).
// Renders a uPlot time-series chart showing motion/shock/GPS sensor traces
// for a given scenario, then animates detection/classification/alarm phases.
// Per D-04: time-series line/area chart. Per D-05: animated playback.

import { useEffect, useRef, useState } from 'preact/hooks';
import uPlot from 'uplot';
import 'uplot/dist/uPlot.min.css';

interface TimelinePoint {
  t: number;
  motion: number;
  shock: number;
  gps: number;
}

interface Phase {
  name: string;
  start: number;
  end: number;
  color: string;
}

interface SensorFixture {
  scenarioId: string;
  title: string;
  description: string;
  timeline: Array<TimelinePoint>;
  phases: Array<Phase>;
}

interface Props {
  scenarioId: string;
  locale?: string;
}

// Phase label translations
const phaseLabels: Record<string, Record<string, string>> = {
  Detection:      { de: 'Erkennung',       en: 'Detection' },
  Classification: { de: 'Klassifizierung', en: 'Classification' },
  Measures:       { de: 'Maßnahmen',       en: 'Measures' },
};

export default function SensorDataViz({ scenarioId, locale = 'de' }: Props) {
  const containerRef = useRef<HTMLDivElement>(null);
  const chartRef = useRef<uPlot | null>(null);
  const [fixture, setFixture] = useState<SensorFixture | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [activePhase, setActivePhase] = useState<number>(-1);

  // Fetch scenario fixture on mount
  useEffect(() => {
    const url = `/data/sensor-scenarios/${scenarioId}.json`;
    fetch(url)
      .then((r) => {
        if (!r.ok) throw new Error(`Failed to load scenario: ${r.status}`);
        return r.json() as Promise<SensorFixture>;
      })
      .then(setFixture)
      .catch((e: Error) => setError(e.message));
  }, [scenarioId]);

  // Build uPlot chart when fixture is loaded and container is ready
  useEffect(() => {
    if (!fixture || !containerRef.current) return;

    // Clean up previous chart instance
    if (chartRef.current) {
      chartRef.current.destroy();
      chartRef.current = null;
    }

    const ts = fixture.timeline.map((p) => p.t);
    const motion = fixture.timeline.map((p) => p.motion);
    const shock = fixture.timeline.map((p) => p.shock);
    const gps = fixture.timeline.map((p) => p.gps * 100); // scale 0-1 flag to 0-100

    const data: uPlot.AlignedData = [ts, motion, shock, gps];

    const opts: uPlot.Options = {
      title: fixture.title,
      width: containerRef.current.offsetWidth || 800,
      height: 320,
      cursor: { show: true },
      legend: { show: true },
      scales: {
        x: { time: true },
        y: { range: [0, 110] },
      },
      axes: [
        { label: '' },
        { label: 'Intensität (0–100)', labelSize: 14 },
      ],
      series: [
        {},
        {
          label: locale === 'de' ? 'Bewegung' : 'Motion',
          stroke: '#3b82f6',
          fill: 'rgba(59,130,246,0.12)',
          width: 2,
        },
        {
          label: locale === 'de' ? 'Schock' : 'Shock',
          stroke: '#f59e0b',
          fill: 'rgba(245,158,11,0.12)',
          width: 2,
        },
        {
          label: 'GPS',
          stroke: '#10b981',
          fill: 'rgba(16,185,129,0.10)',
          width: 2,
          dash: [4, 4],
        },
      ],
      hooks: {
        drawAxes: [
          (u) => {
            // Draw phase highlight bands behind the data
            const ctx = u.ctx;
            fixture.phases.forEach((phase) => {
              const x0 = Math.round(u.valToPos(phase.start, 'x', true));
              const x1 = Math.round(u.valToPos(phase.end, 'x', true));
              const top = u.bbox.top;
              const height = u.bbox.height;
              ctx.save();
              ctx.fillStyle = phase.color + '33'; // 20% opacity
              ctx.fillRect(x0, top, x1 - x0, height);
              // Phase label
              ctx.fillStyle = phase.color;
              ctx.font = '11px sans-serif';
              ctx.textAlign = 'center';
              const label = phaseLabels[phase.name]?.[locale] ?? phase.name;
              ctx.fillText(label, (x0 + x1) / 2, top + 14);
              ctx.restore();
            });
          },
        ],
      },
    };

    chartRef.current = new uPlot(opts, data, containerRef.current);

    // Animate phase highlights sequentially after 600ms delay
    fixture.phases.forEach((_, idx) => {
      setTimeout(() => setActivePhase(idx), 600 + idx * 900);
    });

    return () => {
      chartRef.current?.destroy();
      chartRef.current = null;
    };
  }, [fixture, locale]);

  // Resize handler
  useEffect(() => {
    const handleResize = () => {
      if (chartRef.current && containerRef.current) {
        chartRef.current.setSize({
          width: containerRef.current.offsetWidth,
          height: 320,
        });
      }
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  if (error) {
    return (
      <div class="rounded-lg border border-red-200 bg-red-50 p-6 text-center text-sm text-red-700 dark:border-red-800 dark:bg-red-950 dark:text-red-300">
        {locale === 'de'
          ? 'Sensor-Daten konnten nicht geladen werden.'
          : 'Sensor data could not be loaded.'}
      </div>
    );
  }

  if (!fixture) {
    return (
      <div class="flex h-[320px] items-center justify-center rounded-lg border border-slate-200 bg-slate-50 dark:border-slate-700 dark:bg-slate-900">
        <span class="text-sm text-slate-500 dark:text-slate-400">
          {locale === 'de' ? 'Laden...' : 'Loading...'}
        </span>
      </div>
    );
  }

  return (
    <div class="sensor-data-viz w-full overflow-x-auto rounded-lg border border-slate-200 bg-white p-4 shadow-sm dark:border-slate-700 dark:bg-slate-900">
      <div class="mb-3">
        <p class="text-sm text-slate-500 dark:text-slate-400">{fixture.description}</p>
      </div>
      <div ref={containerRef} class="w-full" aria-label={fixture.title} />
      {/* Phase indicator dots below chart */}
      <div class="mt-3 flex gap-4 justify-center text-xs text-slate-500">
        {fixture.phases.map((phase, idx) => (
          <span
            key={phase.name}
            class={`flex items-center gap-1 transition-opacity duration-500 ${idx <= activePhase ? 'opacity-100' : 'opacity-30'}`}
          >
            <span
              class="inline-block h-2 w-2 rounded-full"
              style={{ backgroundColor: phase.color }}
            />
            {phaseLabels[phase.name]?.[locale] ?? phase.name}
          </span>
        ))}
      </div>
    </div>
  );
}
