"use client";

import React from "react";
import clsx from "clsx";

/**
 * Renders the deterministic part of a reading — the BaZi pillars or the
 * hexagram — above the model's interpretation, so the reader can see that the
 * chart was actually cast rather than improvised.
 */

interface PillarLike {
  label?: string;
  element?: string;
}

const asPillar = (value: unknown): PillarLike | null =>
  value && typeof value === "object" ? (value as PillarLike) : null;

const ELEMENT_COLORS: Record<string, string> = {
  Wood: "text-emerald-300 border-emerald-400/30 bg-emerald-500/10",
  Fire: "text-rose-300 border-rose-400/30 bg-rose-500/10",
  Earth: "text-amber-300 border-amber-400/30 bg-amber-500/10",
  Metal: "text-slate-200 border-slate-300/30 bg-slate-300/10",
  Water: "text-sky-300 border-sky-400/30 bg-sky-500/10",
};

export const BaziChartCard: React.FC<{ chart: Record<string, unknown> }> = ({ chart }) => {
  const pillars = (["year", "month", "day", "hour"] as const)
    .map((key) => ({ key, pillar: asPillar(chart[key]) }))
    .filter((p) => p.pillar);

  if (pillars.length === 0) return null;

  const counts = (chart.elementCounts ?? {}) as Record<string, number>;
  const animal = typeof chart.animal === "string" ? chart.animal : null;
  const dayMaster = typeof chart.dayMaster === "string" ? chart.dayMaster : null;

  return (
    <div className="mb-8 p-5 rounded-2xl bg-mystic-900/50 border border-white/10">
      <h2 className="text-xs uppercase tracking-widest text-slate-400 mb-4">
        Four Pillars
      </h2>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        {pillars.map(({ key, pillar }) => (
          <div
            key={key}
            className={clsx(
              "rounded-xl border px-3 py-4 text-center",
              ELEMENT_COLORS[pillar?.element ?? ""] ?? "border-white/10 bg-white/5 text-slate-200"
            )}
          >
            <div className="text-[10px] uppercase tracking-widest opacity-70 mb-1">
              {key}
            </div>
            <div className="font-display font-bold text-sm md:text-base">
              {pillar?.label}
            </div>
          </div>
        ))}
      </div>

      <div className="mt-4 flex flex-wrap gap-x-5 gap-y-2 text-xs text-slate-400">
        {dayMaster && (
          <span>
            Day Master: <span className="text-slate-200">{dayMaster}</span>
          </span>
        )}
        {animal && (
          <span>
            Zodiac animal: <span className="text-slate-200">{animal}</span>
          </span>
        )}
        {Object.keys(counts).length > 0 && (
          <span>
            Elements:{" "}
            <span className="text-slate-200">
              {Object.entries(counts)
                .map(([el, n]) => `${el} ${n}`)
                .join(" · ")}
            </span>
          </span>
        )}
      </div>
    </div>
  );
};

const LineRow: React.FC<{ yang: boolean; moving: boolean }> = ({ yang, moving }) => (
  <div className="flex items-center justify-center gap-2 h-4">
    {yang ? (
      <span
        className={clsx(
          "block h-1.5 w-24 rounded-full",
          moving ? "bg-mystic-gold" : "bg-slate-300"
        )}
      />
    ) : (
      <>
        <span
          className={clsx(
            "block h-1.5 w-10 rounded-full",
            moving ? "bg-mystic-gold" : "bg-slate-300"
          )}
        />
        <span
          className={clsx(
            "block h-1.5 w-10 rounded-full",
            moving ? "bg-mystic-gold" : "bg-slate-300"
          )}
        />
      </>
    )}
  </div>
);

export const HexagramCard: React.FC<{ chart: Record<string, unknown> }> = ({ chart }) => {
  const lines = Array.isArray(chart.lines) ? (chart.lines as number[]) : null;
  if (!lines || lines.length !== 6) return null;

  const movingLine = Number(chart.movingLine ?? 0);
  const relating = (chart.relating ?? null) as
    | { number?: number; name?: string; chinese?: string; lines?: number[] }
    | null;

  return (
    <div className="mb-8 p-5 rounded-2xl bg-mystic-900/50 border border-white/10">
      <h2 className="text-xs uppercase tracking-widest text-slate-400 mb-4">
        The Cast
      </h2>
      <div className="flex flex-wrap items-center justify-center gap-10">
        <div className="text-center">
          {/* Hexagrams are read bottom-up, so render the array reversed. */}
          <div className="flex flex-col gap-2 mb-3">
            {[...lines].reverse().map((line, idx) => (
              <LineRow
                key={idx}
                yang={line === 1}
                moving={6 - idx === movingLine}
              />
            ))}
          </div>
          <div className="text-sm text-slate-200 font-display font-bold">
            #{String(chart.number ?? "")} {String(chart.name ?? "")}
          </div>
          <div className="text-xs text-slate-500">{String(chart.chinese ?? "")}</div>
        </div>

        {relating?.lines && relating.lines.length === 6 && (
          <div className="text-center opacity-70">
            <div className="flex flex-col gap-2 mb-3">
              {[...relating.lines].reverse().map((line, idx) => (
                <LineRow key={idx} yang={line === 1} moving={false} />
              ))}
            </div>
            <div className="text-sm text-slate-300 font-display font-bold">
              → #{relating.number} {relating.name}
            </div>
            <div className="text-xs text-slate-500">{relating.chinese}</div>
          </div>
        )}
      </div>

      {movingLine > 0 && (
        <p className="mt-4 text-center text-xs text-slate-400">
          Moving line: {movingLine} (counted from the bottom)
        </p>
      )}
    </div>
  );
};
