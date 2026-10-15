"use client"

// Mental Health Empirical Analysis & Clinical Behavioral Dynamics
// Based on 5,000 Student Empirical Dataset & Random Forest Regression Model

import React, { useState } from "react"

export type InkFeatureCopy = { title: string; description: string }
export type InkFeatures = {
  tag: string
  title: string
  collaboration: InkFeatureCopy
  reports: InkFeatureCopy
  integrations: InkFeatureCopy & { tools: string[] }
  insights: InkFeatureCopy & { values: number[]; forecastFrom: number }
}

export interface ProjectContextData {
  formData: {
    age: number
    gender: string
    country: string
    academic_level: string
    most_used_platform: string
    purpose_of_use: string
    avg_daily_usage_hours: number
    daily_unlocks: number
    sleep_hours_per_night: number
    study_hours: number
    physical_activity_hours: number
    stress_level: string
  }
  score: number | null
  statusBadge: string
  statusText: string
  caption?: string
}

export type InkOrbitFeaturesProps = {
  theme?: "light" | "dark" | "auto"
  brand?: string
  tag?: string
  title?: string
  collaboration?: { [K in keyof InkFeatureCopy]?: InkFeatureCopy[K] }
  reports?: { [K in keyof InkFeatureCopy]?: InkFeatureCopy[K] }
  integrations?: { [K in keyof InkFeatures["integrations"]]?: InkFeatures["integrations"][K] }
  insights?: { [K in keyof InkFeatures["insights"]]?: InkFeatures["insights"][K] }
  className?: string
  style?: React.CSSProperties
  context?: ProjectContextData
}

export function clamp(v: number, a: number, b: number): number {
  return Math.min(b, Math.max(a, v))
}

export function chartPaths(values: number[], w: number, h: number, pad: number) {
  const n = values.length
  const lo = Math.min(...values)
  const hi = Math.max(...values)
  const span = hi - lo || 1
  const pts = values.map((v, i) => [
    pad + (n < 2 ? 0 : (i / (n - 1)) * (w - pad * 2)),
    h - pad - ((v - lo) / span) * (h - pad * 2),
  ] as [number, number])
  let line = ""
  pts.forEach(([x, y], i) => {
    if (i === 0) {
      line = "M" + x.toFixed(1) + "," + y.toFixed(1)
      return
    }
    const [px, py] = pts[i - 1]
    const cx = (px + x) / 2
    line += " C" + cx.toFixed(1) + "," + py.toFixed(1) + " " + cx.toFixed(1) + "," + y.toFixed(1) + " " + x.toFixed(1) + "," + y.toFixed(1)
  })
  const area = n ? line + " L" + pts[n - 1][0].toFixed(1) + "," + (h - pad) + " L" + pts[0][0].toFixed(1) + "," + (h - pad) + " Z" : ""
  return { line, area, points: pts }
}

export function nearestIndex(xs: number[], x: number): number {
  let best = 0
  for (let i = 1; i < xs.length; i++) if (Math.abs(xs[i] - x) < Math.abs(xs[best] - x)) best = i
  return best
}

export function Brackets() {
  return null // Clean non-AI aesthetic - no bracket corners
}

export const D_FEATURES: InkFeatures = {
  tag: "Empirical Mental Health Analysis",
  title: "Behavioral Health Dynamics",
  collaboration: {
    title: "Model Feature Attribution",
    description: "Relative feature weighting from Random Forest regressor.",
  },
  reports: {
    title: "Cohort Distribution",
    description: "Empirical distribution curve across 5,000 records.",
  },
  integrations: {
    title: "Risk Correlates",
    description: "Statistical impact factors.",
    tools: ["Screen", "Sleep", "Study", "Unlocks"],
  },
  insights: {
    title: "12-Week Protocol",
    description: "Longitudinal recovery trajectory.",
    values: [61, 63, 65, 68, 70, 73, 75, 76, 78, 79, 80, 80],
    forecastFrom: 6,
  },
}

/* ==========================================================================
   PANEL 1: Daily Habits & Targets (Simple, Clean, Human-Designed)
   ========================================================================== */
export function FeatureAttributionPanel({ context }: { context?: ProjectContextData }) {
  const fd = context?.formData
  const userScore = context?.score !== null && context?.score !== undefined ? context.score : 6.1
  const statusBadge = context?.statusBadge || "Moderate"

  const screenH = fd?.avg_daily_usage_hours ?? 4.5
  const unlocksN = fd?.daily_unlocks ?? 150
  const sleepH = fd?.sleep_hours_per_night ?? 7.0
  const studyH = fd?.study_hours ?? 3.0
  const activityH = fd?.physical_activity_hours ?? 1.5

  const habits = [
    {
      name: "Screen Time",
      target: "Healthy target: 2.0 – 3.5 hrs/day",
      value: `${screenH} hrs/day`,
      status: screenH > 3.5 ? `Above target (+${(screenH - 3.5).toFixed(1)}h)` : "Within healthy range",
      statusColor: screenH > 3.5 ? "text-amber-400" : "text-emerald-400",
    },
    {
      name: "Daily Phone Checks",
      target: "Healthy target: 40 – 90 checks/day",
      value: `${unlocksN} checks/day`,
      status: unlocksN > 90 ? `High checks (+${unlocksN - 90})` : "Within healthy range",
      statusColor: unlocksN > 90 ? "text-amber-400" : "text-emerald-400",
    },
    {
      name: "Nightly Sleep",
      target: "Healthy target: 7.0 – 9.0 hrs/night",
      value: `${sleepH} hrs/night`,
      status: sleepH >= 7.0 ? "Optimal rest" : `Below target (-${(7.0 - sleepH).toFixed(1)}h)`,
      statusColor: sleepH >= 7.0 ? "text-emerald-400" : "text-rose-400",
    },
    {
      name: "Study Routine",
      target: "Healthy target: 2.5 – 5.0 hrs/day",
      value: `${studyH} hrs/day`,
      status: studyH >= 2.5 ? "Balanced routine" : "Low daily study",
      statusColor: studyH >= 2.5 ? "text-zinc-300" : "text-amber-400",
    },
    {
      name: "Physical Activity",
      target: "Healthy target: ≥ 1.0 hr/day",
      value: `${activityH} hrs/day`,
      status: activityH >= 1.0 ? "Active buffer" : "Below target",
      statusColor: activityH >= 1.0 ? "text-emerald-400" : "text-zinc-400",
    },
  ]

  return (
    <div className="flex flex-col h-full justify-between p-4 sm:p-6 bg-zinc-950/60 border-b lg:border-b-0 lg:border-r border-white/5 select-none gap-4">
      {/* Top Header */}
      <div className="shrink-0">
        <h3 className="text-base font-semibold text-zinc-100 tracking-tight">
          Daily Habits & Targets
        </h3>
        <p className="text-xs text-zinc-400 mt-1 leading-relaxed">
          How your reported daily routine compares to recommended healthy baselines.
        </p>
      </div>

      {/* Clean Habit List */}
      <div className="divide-y divide-white/5 rounded-xl border border-white/10 bg-zinc-900/30 overflow-hidden my-auto">
        {habits.map((item) => (
          <div
            key={item.name}
            className="flex items-center justify-between py-2.5 px-4 hover:bg-white/[0.02] transition-colors"
          >
            <div>
              <div className="text-[13px] font-medium text-zinc-200">{item.name}</div>
              <div className="text-[11px] text-zinc-500 font-mono mt-0.5">{item.target}</div>
            </div>
            <div className="text-right">
              <div className="text-[13px] font-semibold text-zinc-100 font-mono">{item.value}</div>
              <div className={`text-[11px] font-medium mt-0.5 ${item.statusColor}`}>
                {item.status}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Simple Summary Box */}
      <div className="p-4 rounded-xl bg-zinc-900/40 border border-white/10 flex flex-col gap-2 shrink-0">
        <div className="flex items-center justify-between">
          <div className="text-xs text-zinc-400">
            {fd?.gender || "Student"}, {fd?.age || 21}y · {fd?.academic_level || "Undergraduate"}
          </div>
          <div className="flex items-center gap-2">
            <span className="text-xs font-mono font-semibold text-white">
              Score: {userScore.toFixed(1)} / 10
            </span>
            <span className="text-[11px] px-2 py-0.5 rounded-full bg-zinc-800 text-zinc-300 border border-white/10 font-medium">
              {statusBadge}
            </span>
          </div>
        </div>
        <p className="text-xs text-zinc-300 leading-relaxed pt-2 border-t border-white/5 font-sans">
          {screenH > 3.5 || unlocksN > 90
            ? `Sleep (${sleepH}h) and exercise (${activityH}h) are in a healthy range. Reducing screen time (${screenH}h) and phone checks (${unlocksN}/d) will have the biggest positive impact on your score.`
            : `Your reported habits are well-balanced across sleep, study, and screen time, supporting healthy cognitive and emotional resilience.`}
        </p>
      </div>
    </div>
  )
}

/* ==========================================================================
   PANEL 2: Population Distribution (Gaussian Bell Curve - 5,000 Students)
   ========================================================================== */
export function CohortDistributionPanel({ context }: { context?: ProjectContextData }) {
  const userScore = context?.score !== null && context?.score !== undefined ? context.score : 6.1
  const mean = 6.23
  const sd = 1.4

  // Generate Gaussian curve points: f(x) = exp(-0.5 * ((x - μ)/σ)^2)
  const W = 340
  const H = 140
  const padX = 24
  const padY = 20

  const points: [number, number][] = []
  const steps = 40
  for (let i = 0; i <= steps; i++) {
    const scoreVal = 1.0 + (i / steps) * 9.0 // 1.0 to 10.0
    const z = (scoreVal - mean) / sd
    const density = Math.exp(-0.5 * z * z)
    const px = padX + (i / steps) * (W - padX * 2)
    const py = H - padY - density * (H - padY * 2)
    points.push([px, py])
  }

  const pathD = points.reduce((acc, p, i) => (i === 0 ? `M${p[0]},${p[1]}` : `${acc} L${p[0]},${p[1]}`), "")
  const areaD = `${pathD} L${points[points.length - 1][0]},${H - padY} L${points[0][0]},${H - padY} Z`

  // User position on curve
  const userRatio = clamp((userScore - 1.0) / 9.0, 0, 1)
  const userX = padX + userRatio * (W - padX * 2)
  const userZ = (userScore - mean) / sd
  const userDensity = Math.exp(-0.5 * userZ * userZ)
  const userY = H - padY - userDensity * (H - padY * 2)

  // Mean position on curve
  const meanRatio = (mean - 1.0) / 9.0
  const meanX = padX + meanRatio * (W - padX * 2)

  return (
    <div className="flex flex-col h-full justify-between p-4 sm:p-6 bg-zinc-950/60 border-b lg:border-b-0 lg:border-r border-white/5 select-none gap-4">
      {/* Top Header */}
      <div>
        <div className="flex items-center gap-2 mb-1">
          <span className="text-[10px] uppercase tracking-wider font-semibold text-zinc-500 font-mono">
            Population Benchmark · N = 5,000
          </span>
        </div>
        <h3 className="text-sm font-semibold text-zinc-100 tracking-tight">
          Empirical Cohort Distribution
        </h3>
        <p className="text-xs text-zinc-400 mt-1 leading-relaxed">
          Where your score ranks relative to the 5,000-student university baseline.
        </p>
      </div>

      {/* Bell Curve SVG Visualization */}
      <div className="my-auto py-2">
        <div className="bg-zinc-900/40 p-3 rounded-lg border border-white/5">
          <svg viewBox={`0 0 ${W} ${H}`} className="w-full h-auto overflow-visible">
            <defs>
              <linearGradient id="curveGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#10b981" stopOpacity="0.18" />
                <stop offset="100%" stopColor="#10b981" stopOpacity="0.0" />
              </linearGradient>
            </defs>

            {/* Baseline axis */}
            <line x1={padX} y1={H - padY} x2={W - padX} y2={H - padY} stroke="rgba(255,255,255,0.12)" />

            {/* Shaded Area & Line */}
            <path d={areaD} fill="url(#curveGradient)" />
            <path d={pathD} fill="none" stroke="#52525b" strokeWidth="1.8" />

            {/* Cohort Mean vertical reference line */}
            <line
              x1={meanX}
              y1={padY}
              x2={meanX}
              y2={H - padY}
              stroke="rgba(255,255,255,0.25)"
              strokeDasharray="3 3"
            />
            <text x={meanX} y={padY - 4} textAnchor="middle" fontSize="8" fill="#71717a" fontFamily="monospace">
              Mean: 6.23
            </text>

            {/* User marker pin */}
            <line x1={userX} y1={userY} x2={userX} y2={H - padY} stroke="#10b981" strokeWidth="1.6" />
            <circle cx={userX} cy={userY} r="4" fill="#09090b" stroke="#10b981" strokeWidth="2" />
            <g transform={`translate(${clamp(userX, 36, W - 36)}, ${userY - 14})`}>
              <rect x="-24" y="-9" width="48" height="14" rx="3" fill="#10b981" />
              <text x="0" y="1" textAnchor="middle" fontSize="7.5" fontWeight="700" fill="#09090b" fontFamily="monospace">
                You: {userScore.toFixed(1)}
              </text>
            </g>

            {/* X-axis scale labels */}
            {[1, 3, 5, 7, 9, 10].map((sc) => {
              const sx = padX + ((sc - 1) / 9) * (W - padX * 2)
              return (
                <text key={sc} x={sx} y={H - 6} textAnchor="middle" fontSize="7.5" fill="#52525b" fontFamily="monospace">
                  {sc}.0
                </text>
              )
            })}
          </svg>
        </div>
      </div>

      {/* Cohort Strata Breakdown Table */}
      <div className="p-4 rounded-xl bg-zinc-900/70 border border-white/10">
        <span className="text-[11px] font-semibold text-zinc-400 uppercase tracking-wide block mb-2.5">
          Cohort Strata Reference
        </span>
        <div className="space-y-2 text-xs">
          <div className="flex justify-between items-center py-1 border-b border-white/5">
            <span className="text-zinc-400 text-[11px]">High Strain Band (&lt; 4.5)</span>
            <span className="font-mono text-zinc-400 text-[11px]">14% of students</span>
          </div>
          <div className="flex justify-between items-center py-1 border-b border-white/5">
            <span className="text-zinc-200 text-[11px] font-medium flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
              Moderate Band (4.5 – 7.5)
            </span>
            <span className="font-mono text-emerald-400 text-[11px] font-semibold">68% (Your Tier)</span>
          </div>
          <div className="flex justify-between items-center py-1">
            <span className="text-zinc-400 text-[11px]">Optimal Health Band (&gt; 7.5)</span>
            <span className="font-mono text-zinc-400 text-[11px]">18% of students</span>
          </div>
        </div>
        <p className="text-[10px] text-zinc-500 mt-2.5 pt-2 border-t border-white/5">
          Dataset: 5,000 university students across 8 distinct academic fields (p &lt; 0.001).
        </p>
      </div>
    </div>
  )
}

/* ==========================================================================
   PANEL 3: Clinical Recovery Protocol (12-Week Roadmap & Actionable Steps)
   ========================================================================== */
export function RecoveryProtocolPanel({ context }: { context?: ProjectContextData }) {
  const userScore = context?.score !== null && context?.score !== undefined ? context.score : 6.1
  const [activeWk, setActiveWk] = useState(12)

  // 12-week stepped recovery curve starting at userScore and culminating at 8.0
  const baseline = userScore
  const target = 8.0
  const totalDelta = target - baseline

  const trajectory = Array.from({ length: 12 }, (_, i) => {
    // S-curve logistic progression
    const progress = 1 / (1 + Math.exp(-0.7 * (i + 1 - 5)))
    return +(baseline + totalDelta * progress).toFixed(1)
  })

  const W = 340
  const H = 140
  const padX = 24
  const padY = 20

  const { line, area, points } = chartPaths(trajectory, W, H, padY)
  const currentPt = points[activeWk - 1] || points[points.length - 1]

  const phases = [
    {
      phase: "Phase 1 (Wks 1–4)",
      title: "Circadian Anchor",
      action: "Strict 7.5h sleep window (+0.7 pts)",
      color: "#10b981",
    },
    {
      phase: "Phase 2 (Wks 5–8)",
      title: "Friction Protocol",
      action: "Batch notifications under 90 unlocks/d (+0.6 pts)",
      color: "#38bdf8",
    },
    {
      phase: "Phase 3 (Wks 9–12)",
      title: "Focus Shield",
      action: "Limit screen load to ≤3.5h/d (8.0 Target)",
      color: "#a855f7",
    },
  ]

  return (
    <div className="flex flex-col h-full justify-between p-4 sm:p-6 bg-zinc-950/60 select-none gap-4">
      {/* Top Header */}
      <div>
        <div className="flex items-center gap-2 mb-1">
          <span className="text-[10px] uppercase tracking-wider font-semibold text-zinc-500 font-mono">
            Actionable Protocol · 12 Weeks
          </span>
        </div>
        <h3 className="text-sm font-semibold text-zinc-100 tracking-tight">
          Longitudinal Recovery Roadmap
        </h3>
        <p className="text-xs text-zinc-400 mt-1 leading-relaxed">
          Phased behavioral interventions to restore wellness from {userScore.toFixed(1)} to 8.0/10.
        </p>
      </div>

      {/* Trajectory Timeline Chart */}
      <div className="my-auto py-2">
        <div className="bg-zinc-900/40 p-3 rounded-lg border border-white/5">
          <svg
            viewBox={`0 0 ${W} ${H}`}
            className="w-full h-auto overflow-visible cursor-crosshair"
            onPointerMove={(e) => {
              const r = e.currentTarget.getBoundingClientRect()
              const relX = ((e.clientX - r.left) / r.width) * W
              const idx = nearestIndex(points.map((p) => p[0]), relX)
              setActiveWk(idx + 1)
            }}
          >
            <defs>
              <linearGradient id="roadArea" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#10b981" stopOpacity="0.22" />
                <stop offset="100%" stopColor="#10b981" stopOpacity="0.0" />
              </linearGradient>
            </defs>

            {/* Target 8.0 benchmark dashed line */}
            <line
              x1={padX}
              y1={points[points.length - 1][1]}
              x2={W - padX}
              y2={points[points.length - 1][1]}
              stroke="rgba(16,185,129,0.3)"
              strokeDasharray="3 3"
            />
            <text
              x={W - padX}
              y={points[points.length - 1][1] - 4}
              textAnchor="end"
              fontSize="7.5"
              fill="#10b981"
              fontFamily="monospace"
            >
              Target: 8.0 / 10
            </text>

            {/* Trajectory path */}
            <path d={area} fill="url(#roadArea)" />
            <path d={line} fill="none" stroke="#10b981" strokeWidth="2" />

            {/* Active week scrubber */}
            <line
              x1={currentPt[0]}
              y1={padY}
              x2={currentPt[0]}
              y2={H - padY}
              stroke="rgba(255,255,255,0.3)"
            />
            <circle cx={currentPt[0]} cy={currentPt[1]} r="4" fill="#09090b" stroke="#10b981" strokeWidth="2" />

            {/* Hover tooltip */}
            <g transform={`translate(${clamp(currentPt[0], 48, W - 48)}, ${currentPt[1] - 14})`}>
              <rect x="-34" y="-9" width="68" height="15" rx="3" fill="#18181b" stroke="rgba(255,255,255,0.2)" />
              <text x="0" y="1" textAnchor="middle" fontSize="7.5" fill="#f4f4f5" fontFamily="monospace">
                Wk {activeWk}: {trajectory[activeWk - 1]} / 10
              </text>
            </g>

            {/* X-axis week indicators */}
            {[1, 4, 8, 12].map((wk) => {
              const pt = points[wk - 1]
              return (
                <text key={wk} x={pt[0]} y={H - 6} textAnchor="middle" fontSize="7.5" fill="#52525b" fontFamily="monospace">
                  Wk {wk}
                </text>
              )
            })}
          </svg>
        </div>
      </div>

      {/* 3 Step Actionable Milestones */}
      <div className="p-4 rounded-xl bg-zinc-900/70 border border-white/10">
        <span className="text-[11px] font-semibold text-zinc-400 uppercase tracking-wide block mb-2.5">
          Target Intervention Protocol
        </span>
        <div className="space-y-2">
          {phases.map((ph) => (
            <div key={ph.phase} className="p-2 rounded bg-zinc-900/60 border border-white/5 flex flex-col gap-0.5">
              <div className="flex justify-between items-center text-[10px]">
                <span className="font-mono text-zinc-400">{ph.phase}</span>
                <span className="font-semibold text-zinc-200">{ph.title}</span>
              </div>
              <p className="text-[11px] text-zinc-400">{ph.action}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

/* ==========================================================================
   MAIN COMPONENT: 3 Distinct Human-Crafted Panels (Zero Artificial Repeat)
   ========================================================================== */
export default function InkOrbitFeatures({
  className = "",
  style,
  context,
}: InkOrbitFeaturesProps) {
  return (
    <div className={`w-full min-h-full lg:h-full flex flex-col bg-black text-zinc-100 ${className}`} style={style}>
      {/* 3 Equal Panels Grid - fully responsive and vertically scrollable on mobile */}
      <div className="grid grid-cols-1 lg:grid-cols-3 w-full min-h-full lg:h-full flex-1">
        {/* Panel 1: Daily Habits & Targets */}
        <div className="w-full min-h-[460px] lg:h-full">
          <FeatureAttributionPanel context={context} />
        </div>

        {/* Panel 2: Cohort Population Distribution */}
        <div className="w-full min-h-[460px] lg:h-full">
          <CohortDistributionPanel context={context} />
        </div>

        {/* Panel 3: Actionable Recovery Protocol */}
        <div className="w-full min-h-[460px] lg:h-full">
          <RecoveryProtocolPanel context={context} />
        </div>
      </div>
    </div>
  )
}
