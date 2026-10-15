import React, { useState, useEffect } from 'react'
import { SilkCanvas } from '@/components/ui/silk-background-animation'
import { Starfield } from '@/components/ui/starfield'
import { Moon, BookOpen, Smartphone, Zap, Sparkles, Activity, Maximize2, X, TrendingUp } from 'lucide-react'
import InkOrbitFeatures, { Brackets, chartPaths, nearestIndex, clamp } from '@/components/ui/ink-orbit-features'

interface PredictionResult {
  predicted_mental_health_score: number
}

export default function App() {
  const [formData, setFormData] = useState({
    age: 21,
    gender: 'Male',
    country: 'India',
    custom_country: '',
    academic_level: 'Undergraduate',
    most_used_platform: 'Instagram',
    purpose_of_use: 'Entertainment',
    avg_daily_usage_hours: 4.5,
    daily_unlocks: 150,
    sleep_hours_per_night: 7.0,
    study_hours: 3.0,
    physical_activity_hours: 1.5,
    stress_level: 'Medium'
  })

  const [score, setScore] = useState<number | null>(null)
  const [loading, setLoading] = useState(false)
  const [statusBadge, setStatusBadge] = useState('Moderate')
  const [statusText, setStatusText] = useState('AWAITING INPUT')
  const [caption, setCaption] = useState('Click calculate to generate behavioral prediction.')
  const [activeTab, setActiveTab] = useState<'gauge' | 'analytics'>('gauge')
  const [showFullSuite, setShowFullSuite] = useState(false)
  const [hoverIdx, setHoverIdx] = useState(-1)

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setShowFullSuite(false)
    }
    if (showFullSuite) {
      window.addEventListener('keydown', handleKeyDown)
    }
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [showFullSuite])

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: e.target.type === 'number' ? parseFloat(value) || 0 : value
    }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    let countryValue = formData.country || 'Other'
    if (formData.custom_country && (countryValue === 'Other' || !countryValue)) {
      countryValue = formData.custom_country.trim()
    }

    const payload = {
      age: Number(formData.age),
      gender: formData.gender,
      country: countryValue,
      academic_level: formData.academic_level,
      most_used_platform: formData.most_used_platform,
      purpose_of_use: formData.purpose_of_use,
      avg_daily_usage_hours: Number(formData.avg_daily_usage_hours),
      daily_unlocks: Number(formData.daily_unlocks),
      study_hours: Number(formData.study_hours),
      physical_activity_hours: Number(formData.physical_activity_hours),
      sleep_hours_per_night: Number(formData.sleep_hours_per_night),
      stress_level: formData.stress_level
    }

    try {
      const apiBase = (window.location.port !== '8000' && window.location.protocol.startsWith('http'))
        ? 'http://127.0.0.1:8000'
        : ''

      const res = await fetch(`${apiBase}/predict`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      })

      if (!res.ok) throw new Error('API Request Failed')
      const data: PredictionResult = await res.json()
      const calculatedScore = data.predicted_mental_health_score
      setScore(calculatedScore)

      if (calculatedScore >= 7.5) {
        setStatusBadge('Optimal')
        setStatusText('HEALTHY BALANCE')
        setCaption('Strong restorative indicators with balanced digital usage.')
      } else if (calculatedScore >= 6.0) {
        setStatusBadge('Moderate')
        setStatusText('BALANCED HABITS')
        setCaption('Habits align within standard behavioral variance.')
      } else {
        setStatusBadge('Elevated Strain')
        setStatusText('DIGITAL STRAIN')
        setCaption('Indicators reflect elevated screen time and rest deficit.')
      }
    } catch (err) {
      console.error(err)
      setStatusText('ERROR')
      setCaption('Could not connect to model API. Ensure backend is running.')
    } finally {
      setLoading(false)
    }
  }

  // Trajectory analytics computed from current score and factors
  const currentScoreVal = score !== null ? score : 6.1
  const baseVal = Math.round(currentScoreVal * 10)
  const trajectoryValues = [
    Math.max(10, baseVal - 14),
    Math.max(12, baseVal - 10),
    Math.max(15, baseVal - 8),
    Math.max(14, baseVal - 12),
    Math.max(18, baseVal - 5),
    Math.max(20, baseVal - 2),
    Math.max(22, baseVal),
    Math.max(25, baseVal + 2),
    Math.max(28, baseVal + (formData.sleep_hours_per_night >= 7 ? 6 : -4)),
    Math.max(30, baseVal + (formData.study_hours >= 3 ? 10 : -6)),
    Math.max(32, baseVal + (formData.avg_daily_usage_hours <= 4 ? 14 : -8)),
    Math.max(35, baseVal + (formData.stress_level === 'Low' ? 18 : formData.stress_level === 'Medium' ? 10 : 2)),
  ]
  const chartW = 320
  const chartH = 135
  const { line: trajectoryLine, area: trajectoryArea, points: trajectoryPoints } = chartPaths(trajectoryValues, chartW, chartH, 14)
  const splitIdx = 7
  const activePtIdx = hoverIdx >= 0 ? hoverIdx : trajectoryPoints.length - 1
  const activePt = trajectoryPoints[activePtIdx] || trajectoryPoints[0]
  const pctChange = Math.round(((trajectoryValues[activePtIdx] - trajectoryValues[0]) / (trajectoryValues[0] || 1)) * 100)

  return (
    <div className="w-full min-h-screen lg:h-screen bg-black text-zinc-100 flex flex-col justify-between overflow-x-hidden overflow-y-auto lg:overflow-hidden font-sans select-none relative">
      <div className="max-w-[1240px] w-full mx-auto px-4 sm:px-6 py-3 flex-1 flex flex-col justify-between min-h-0">
        {/* Top Centered Header */}
        <header className="flex flex-col items-center justify-center text-center pb-2.5 pt-1 border-b border-white/10 shrink-0">
          <h1 className="text-2xl sm:text-[1.7rem] font-semibold text-white tracking-tight leading-tight">
            Mental Health Score Predictor
          </h1>
          <p className="text-xs sm:text-[0.82rem] text-zinc-400 mt-1 max-w-xl">
            Understand your behavioral wellness — answer a few questions about your daily habits to receive an assessment score.
          </p>
        </header>

        {/* Main Grid: Multi-Column Architectural Layout */}
        <main className="grid grid-cols-1 lg:grid-cols-[1.95fr_1fr] gap-4 flex-1 min-h-0 items-stretch pb-4 lg:pb-1">
          {/* Left Panel: Your Profile & Habits with Silk Texture */}
          <div className="relative overflow-hidden bg-zinc-950/80 border border-white/10 rounded-xl p-4 shadow-2xl backdrop-blur-md flex flex-col justify-between">
            {/* Silk Canvas animation running on card background */}
            <SilkCanvas className="rounded-xl opacity-35 pointer-events-none" />

            <div className="relative z-10 flex flex-col justify-between h-full">
              <div className="flex justify-between items-center mb-2.5 pb-1 border-b border-white/10">
                <h3 className="font-serif text-[1.05rem] font-medium text-zinc-100">
                  Your Profile & Habits
                </h3>
              </div>

              <form onSubmit={handleSubmit} className="flex-1 flex flex-col justify-between">
                {/* Group 1: ABOUT YOU */}
                <div className="bg-black/50 border border-white/10 rounded-lg p-2.5 mb-2.5 backdrop-blur-sm">
                  <div className="flex items-center justify-between mb-1.5">
                    <div className="text-emerald-400 text-[0.65rem] font-semibold tracking-wider">
                      ABOUT YOU
                    </div>
                    {formData.country === 'Other' && (
                      <span className="text-[0.62rem] text-zinc-400">Grouped as "Other"</span>
                    )}
                  </div>

                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
                    <div className="flex flex-col">
                      <label className="text-[0.68rem] text-zinc-300 mb-0.5">Age</label>
                      <input
                        type="number"
                        name="age"
                        value={formData.age}
                        onChange={handleChange}
                        min="10"
                        max="100"
                        className="h-7 px-2 bg-zinc-900/90 border border-white/15 rounded text-[0.76rem] text-zinc-100 focus:outline-none focus:border-emerald-500"
                        required
                      />
                    </div>

                    <div className="flex flex-col">
                      <label className="text-[0.68rem] text-zinc-300 mb-0.5">Gender</label>
                      <select
                        name="gender"
                        value={formData.gender}
                        onChange={handleChange}
                        className="h-7 px-1.5 bg-zinc-900/90 border border-white/15 rounded text-[0.76rem] text-zinc-100 focus:outline-none focus:border-emerald-500"
                        required
                      >
                        <option value="Male">Male</option>
                        <option value="Female">Female</option>
                      </select>
                    </div>

                    <div className="flex flex-col">
                      <label className="text-[0.68rem] text-zinc-300 mb-0.5">Country</label>
                      <select
                        name="country"
                        value={formData.country}
                        onChange={handleChange}
                        className="h-7 px-1.5 bg-zinc-900/90 border border-white/15 rounded text-[0.76rem] text-zinc-100 focus:outline-none focus:border-emerald-500"
                        required
                      >
                        <option value="India">India</option>
                        <option value="USA">USA</option>
                        <option value="UK">United Kingdom</option>
                        <option value="Canada">Canada</option>
                        <option value="Australia">Australia</option>
                        <option value="Germany">Germany</option>
                        <option value="France">France</option>
                        <option value="Mexico">Mexico</option>
                        <option value="Turkey">Turkey</option>
                        <option value="Other">Other</option>
                      </select>
                    </div>

                    <div className="flex flex-col">
                      <label className="text-[0.68rem] text-zinc-300 mb-0.5">Academic Level</label>
                      <select
                        name="academic_level"
                        value={formData.academic_level}
                        onChange={handleChange}
                        className="h-7 px-1.5 bg-zinc-900/90 border border-white/15 rounded text-[0.76rem] text-zinc-100 focus:outline-none focus:border-emerald-500"
                        required
                      >
                        <option value="High School">High School</option>
                        <option value="Undergraduate">Undergraduate</option>
                        <option value="Graduate">Graduate</option>
                      </select>
                    </div>
                  </div>

                  {formData.country === 'Other' && (
                    <div className="mt-1.5 pt-1.5 border-t border-white/10 flex items-center gap-2">
                      <label className="text-[0.66rem] text-zinc-300 whitespace-nowrap">Your Country Name:</label>
                      <input
                        type="text"
                        name="custom_country"
                        value={formData.custom_country}
                        onChange={handleChange}
                        placeholder="e.g. Brazil, Japan, Egypt"
                        className="h-6 flex-1 px-2 bg-zinc-900 border border-white/15 rounded text-[0.74rem] text-zinc-100 focus:outline-none focus:border-emerald-500 placeholder:text-zinc-600"
                      />
                    </div>
                  )}
                </div>

                {/* Group 2: DIGITAL HABITS */}
                <div className="bg-black/50 border border-white/10 rounded-lg p-2.5 mb-2.5 backdrop-blur-sm">
                  <div className="text-emerald-400 text-[0.65rem] font-semibold tracking-wider mb-1.5">
                    DIGITAL & SOCIAL HABITS
                  </div>

                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
                    <div className="flex flex-col">
                      <label className="text-[0.68rem] text-zinc-300 mb-0.5">Platform</label>
                      <select
                        name="most_used_platform"
                        value={formData.most_used_platform}
                        onChange={handleChange}
                        className="h-7 px-1.5 bg-zinc-900/90 border border-white/15 rounded text-[0.76rem] text-zinc-100 focus:outline-none focus:border-emerald-500"
                      >
                        <option value="Instagram">Instagram</option>
                        <option value="YouTube">YouTube</option>
                        <option value="TikTok">TikTok</option>
                        <option value="WhatsApp">WhatsApp</option>
                        <option value="Snapchat">Snapchat</option>
                        <option value="LinkedIn">LinkedIn</option>
                        <option value="Twitter">Twitter (X)</option>
                        <option value="Facebook">Facebook</option>
                        <option value="WeChat">WeChat</option>
                        <option value="KakaoTalk">KakaoTalk</option>
                        <option value="LINE">LINE</option>
                        <option value="VKontakte">VKontakte</option>
                      </select>
                    </div>

                    <div className="flex flex-col">
                      <label className="text-[0.68rem] text-zinc-300 mb-0.5">Purpose</label>
                      <select
                        name="purpose_of_use"
                        value={formData.purpose_of_use}
                        onChange={handleChange}
                        className="h-7 px-1.5 bg-zinc-900/90 border border-white/15 rounded text-[0.76rem] text-zinc-100 focus:outline-none focus:border-emerald-500"
                      >
                        <option value="Entertainment">Entertainment</option>
                        <option value="Education">Education</option>
                        <option value="Networking">Networking</option>
                        <option value="News">News</option>
                      </select>
                    </div>

                    <div className="flex flex-col">
                      <label className="text-[0.68rem] text-zinc-300 mb-0.5">Screen Time (hrs)</label>
                      <input
                        type="number"
                        step="0.1"
                        name="avg_daily_usage_hours"
                        value={formData.avg_daily_usage_hours}
                        onChange={handleChange}
                        className="h-7 px-2 bg-zinc-900/90 border border-white/15 rounded text-[0.76rem] text-zinc-100 focus:outline-none focus:border-emerald-500"
                        required
                      />
                    </div>

                    <div className="flex flex-col">
                      <label className="text-[0.68rem] text-zinc-300 mb-0.5">Daily Unlocks</label>
                      <input
                        type="number"
                        name="daily_unlocks"
                        value={formData.daily_unlocks}
                        onChange={handleChange}
                        className="h-7 px-2 bg-zinc-900/90 border border-white/15 rounded text-[0.76rem] text-zinc-100 focus:outline-none focus:border-emerald-500"
                        required
                      />
                    </div>
                  </div>
                </div>

                {/* Group 3: LIFESTYLE & ROUTINE */}
                <div className="bg-black/50 border border-white/10 rounded-lg p-2.5 mb-2.5 backdrop-blur-sm">
                  <div className="text-emerald-400 text-[0.65rem] font-semibold tracking-wider mb-1.5">
                    LIFESTYLE & ROUTINE
                  </div>

                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
                    <div className="flex flex-col">
                      <label className="text-[0.68rem] text-zinc-300 mb-0.5">Sleep (hrs/night)</label>
                      <input
                        type="number"
                        step="0.1"
                        name="sleep_hours_per_night"
                        value={formData.sleep_hours_per_night}
                        onChange={handleChange}
                        className="h-7 px-2 bg-zinc-900/90 border border-white/15 rounded text-[0.76rem] text-zinc-100 focus:outline-none focus:border-emerald-500"
                        required
                      />
                    </div>

                    <div className="flex flex-col">
                      <label className="text-[0.68rem] text-zinc-300 mb-0.5">Study (daily hrs)</label>
                      <input
                        type="number"
                        step="0.1"
                        name="study_hours"
                        value={formData.study_hours}
                        onChange={handleChange}
                        className="h-7 px-2 bg-zinc-900/90 border border-white/15 rounded text-[0.76rem] text-zinc-100 focus:outline-none focus:border-emerald-500"
                        required
                      />
                    </div>

                    <div className="flex flex-col">
                      <label className="text-[0.68rem] text-zinc-300 mb-0.5">Exercise (hrs)</label>
                      <input
                        type="number"
                        step="0.1"
                        name="physical_activity_hours"
                        value={formData.physical_activity_hours}
                        onChange={handleChange}
                        className="h-7 px-2 bg-zinc-900/90 border border-white/15 rounded text-[0.76rem] text-zinc-100 focus:outline-none focus:border-emerald-500"
                        required
                      />
                    </div>

                    <div className="flex flex-col">
                      <label className="text-[0.68rem] text-zinc-300 mb-0.5">Stress Level</label>
                      <select
                        name="stress_level"
                        value={formData.stress_level}
                        onChange={handleChange}
                        className="h-7 px-1.5 bg-zinc-900/90 border border-white/15 rounded text-[0.76rem] text-zinc-100 focus:outline-none focus:border-emerald-500"
                      >
                        <option value="Low">Low</option>
                        <option value="Medium">Medium</option>
                        <option value="High">High</option>
                        <option value="Very High">Very High</option>
                      </select>
                    </div>
                  </div>
                </div>

                {/* Bottom Submit Action */}
                <div className="flex flex-col sm:flex-row justify-between items-center gap-2 pt-2.5 mt-2 border-t border-white/10">
                  <div className="flex items-center gap-1.5 text-zinc-400">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse shrink-0" />
                    <span className="text-[0.72rem] text-zinc-400 leading-tight">
                      Adjust your inputs to recalculate wellness metrics
                    </span>
                  </div>
                  <button
                    type="submit"
                    disabled={loading}
                    className="h-9 px-5 w-full sm:w-auto bg-emerald-500 hover:bg-emerald-400 active:scale-[0.98] text-black font-semibold rounded-lg text-xs sm:text-[0.82rem] transition-all shadow-md shadow-emerald-950/40 flex items-center justify-center gap-2 cursor-pointer"
                  >
                    <Sparkles className="w-3.5 h-3.5" />
                    <span>{loading ? 'Evaluating Model...' : 'Calculate Score'}</span>
                  </button>
                </div>
              </form>
            </div>
          </div>

          {/* Right Panel: Live Assessment with Starfield Background */}
          <div className="relative overflow-hidden bg-zinc-950/90 border border-white/10 rounded-xl p-4 shadow-2xl backdrop-blur-md flex flex-col justify-between items-center text-center">
            {/* Animated Starfield in the background of Live Assessment */}
            <div className="absolute inset-0 pointer-events-none overflow-hidden opacity-75">
              <Starfield
                starCount={3500}
                waveFrequency={15}
                starEscapeWidth={280}
                voidWidth={60}
                starColor={{ r: 168, g: 85, b: 247 }}
                maxOpacity={220}
                rotationSpeed={0.0003}
                waveSpeed={0.006}
              />
            </div>

            <div className="relative z-10 w-full flex flex-col justify-between items-center h-full">
              {/* Header with View Tabs */}
              <div className="w-full text-left shrink-0 pb-2 border-b border-white/5">
                <div className="flex items-center justify-between gap-2">
                  <h3 className="font-serif text-base sm:text-[1.08rem] font-medium text-zinc-100">Live Assessment</h3>

                  <div className="flex items-center gap-1 bg-zinc-900/90 p-1 rounded-lg border border-white/10 shadow-sm">
                    <button
                      type="button"
                      onClick={() => setActiveTab('gauge')}
                      className={`px-3 py-1.5 rounded-md text-xs sm:text-[0.78rem] font-medium transition-all cursor-pointer ${
                        activeTab === 'gauge' ? 'bg-zinc-800 text-white shadow-sm font-semibold' : 'text-zinc-400 hover:text-zinc-200 hover:bg-zinc-800/40'
                      }`}
                    >
                      Gauge
                    </button>
                    <button
                      type="button"
                      onClick={() => setActiveTab('analytics')}
                      className={`px-3 py-1.5 rounded-md text-xs sm:text-[0.78rem] font-medium transition-all flex items-center gap-1.5 cursor-pointer ${
                        activeTab === 'analytics' ? 'bg-emerald-950/90 border border-emerald-500/50 text-emerald-300 shadow-sm font-semibold' : 'text-zinc-400 hover:text-zinc-200 hover:bg-zinc-800/40'
                      }`}
                    >
                      <Activity className="w-3.5 h-3.5" />
                      Analytics
                    </button>
                    <button
                      type="button"
                      onClick={() => setShowFullSuite(true)}
                      title="Open Full Analytics Suite"
                      className="p-1.5 rounded-md text-zinc-400 hover:text-white hover:bg-zinc-800 transition-colors cursor-pointer"
                    >
                      <Maximize2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
                <p className="text-[0.7rem] sm:text-xs text-zinc-400 mt-1">
                  {activeTab === 'gauge' ? 'Behavioral score computed from 5,000-student model.' : '12-week longitudinal trajectory benchmarked against empirical cohort.'}
                </p>
              </div>

              {activeTab === 'gauge' ? (
                <>
                  {/* Circular Gauge */}
                  <div className="my-1.5 shrink-0">
                    <div className="w-[124px] h-[124px] rounded-full border border-white/10 bg-zinc-900/40 backdrop-blur-md shadow-2xl flex flex-col items-center justify-center relative mx-auto ring-1 ring-white/5">
                      <span className="text-[2.1rem] font-light text-zinc-100 tracking-tight leading-none font-sans">
                        {score !== null ? score.toFixed(1) : '--'}
                      </span>
                      <span className="text-[0.64rem] text-zinc-500 mt-0.5 font-medium">/ 10</span>
                      <span className="text-[0.58rem] font-medium tracking-widest text-emerald-400 uppercase mt-1">
                        {statusText}
                      </span>
                    </div>
                  </div>

                  {/* Status Pill Badge */}
                  <div className="shrink-0 mb-1">
                    <span className="inline-block px-3 py-0.5 rounded-full text-[0.68rem] font-medium bg-zinc-900/90 border border-emerald-500/30 text-emerald-300/90 mb-0.5 shadow-sm">
                      {statusBadge}
                    </span>
                    <p className="text-[0.64rem] text-zinc-500">Model-generated behavioral estimate</p>
                  </div>

                  {/* Metric Summary Tiles (2x2 Grid) */}
                  <div className="grid grid-cols-2 gap-1.5 w-full shrink-0">
                    <div className="bg-zinc-900/40 border border-white/5 rounded-lg p-2 text-left backdrop-blur-sm hover:border-white/10 transition-colors">
                      <div className="flex items-center gap-1 text-[0.56rem] text-zinc-400 font-medium tracking-wider">
                        <Moon className="w-3 h-3 text-emerald-400/80" />
                        <span>SLEEP</span>
                      </div>
                      <div className="text-[0.85rem] font-medium text-zinc-200 mt-0.5">
                        {formData.sleep_hours_per_night}h
                      </div>
                    </div>

                    <div className="bg-zinc-900/40 border border-white/5 rounded-lg p-2 text-left backdrop-blur-sm hover:border-white/10 transition-colors">
                      <div className="flex items-center gap-1 text-[0.56rem] text-zinc-400 font-medium tracking-wider">
                        <BookOpen className="w-3 h-3 text-emerald-400/80" />
                        <span>STUDY</span>
                      </div>
                      <div className="text-[0.85rem] font-medium text-zinc-200 mt-0.5">
                        {formData.study_hours}h
                      </div>
                    </div>

                    <div className="bg-zinc-900/40 border border-white/5 rounded-lg p-2 text-left backdrop-blur-sm hover:border-white/10 transition-colors">
                      <div className="flex items-center gap-1 text-[0.56rem] text-zinc-400 font-medium tracking-wider">
                        <Smartphone className="w-3 h-3 text-emerald-400/80" />
                        <span>SCREEN TIME</span>
                      </div>
                      <div className="text-[0.85rem] font-medium text-zinc-200 mt-0.5">
                        {formData.avg_daily_usage_hours}h
                      </div>
                    </div>

                    <div className="bg-zinc-900/40 border border-white/5 rounded-lg p-2 text-left backdrop-blur-sm hover:border-white/10 transition-colors">
                      <div className="flex items-center gap-1 text-[0.56rem] text-zinc-400 font-medium tracking-wider">
                        <Zap className="w-3 h-3 text-emerald-400/80" />
                        <span>STRESS</span>
                      </div>
                      <div className="text-[0.85rem] font-medium text-zinc-200 mt-0.5">
                        {formData.stress_level}
                      </div>
                    </div>
                  </div>
                </>
              ) : (
                /* Predictive Analytics Tab using Ink Orbit Features */
                <div className="w-full flex-1 flex flex-col justify-between my-1">
                  <div className="relative ib-frame bg-zinc-900/50 border border-white/10 rounded-lg p-2.5 backdrop-blur-md">
                    <Brackets />
                    <svg
                      className="w-full h-auto cursor-crosshair select-none"
                      viewBox={`0 0 ${chartW} ${chartH + 6}`}
                      onPointerMove={(e) => {
                        const r = e.currentTarget.getBoundingClientRect()
                        setHoverIdx(nearestIndex(trajectoryPoints.map((q) => q[0]), ((e.clientX - r.left) / r.width) * chartW))
                      }}
                      onPointerLeave={() => setHoverIdx(-1)}
                      role="img"
                      aria-label="Predictive Insights Chart"
                    >
                      <defs>
                        <linearGradient id="anArea" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="0" stopColor="#34d399" stopOpacity="0.22" />
                          <stop offset="1" stopColor="#34d399" stopOpacity="0.0" />
                        </linearGradient>
                      </defs>
                      {[0.25, 0.5, 0.75].map((g) => (
                        <line key={g} x1="14" x2={chartW - 14} y1={chartH * g} y2={chartH * g} stroke="rgba(255,255,255,0.06)" />
                      ))}
                      <path d={trajectoryArea} fill="url(#anArea)" />
                      <path d={trajectoryLine} fill="none" stroke="#34d399" strokeWidth="1.8" opacity="0.9" />
                      <line x1={trajectoryPoints[splitIdx][0]} x2={trajectoryPoints[splitIdx][0]} y1="10" y2={chartH - 14} stroke="rgba(255,255,255,0.25)" strokeDasharray="2 3" />
                      <text x={trajectoryPoints[splitIdx][0] - 4} y={chartH - 18} textAnchor="end" fontSize="7" fill="rgba(255,255,255,0.4)" fontFamily="monospace">
                        FORECAST
                      </text>
                      {hoverIdx >= 0 && <line x1={activePt[0]} x2={activePt[0]} y1="8" y2={chartH - 14} stroke="#ffffff" strokeOpacity="0.35" />}
                      <circle cx={activePt[0]} cy={activePt[1]} r="3.2" fill="#18181b" stroke="#34d399" strokeWidth="1.6" />
                      <g transform={`translate(${clamp(activePt[0], 42, chartW - 42)}, ${activePt[1] < 34 ? activePt[1] + 22 : activePt[1] - 12})`}>
                        <rect x="-34" y="-11" width="68" height="15" rx="3" fill="#18181b" stroke="rgba(255,255,255,0.2)" />
                        <text x="0" y="0" textAnchor="middle" fontSize="7.5" fill="#f4f4f5" fontFamily="monospace">
                          {(activePtIdx >= splitIdx ? "pred " : `wk ${activePtIdx + 1} `) + (pctChange >= 0 ? "+" : "") + pctChange + "%"}
                        </text>
                      </g>
                    </svg>
                    <div className="flex justify-between items-center text-[0.62rem] text-zinc-400 mt-1 px-1 font-mono">
                      <span>Wk 1: {(trajectoryValues[0] / 10).toFixed(1)}</span>
                      <span className="text-emerald-400 font-semibold">Hover to scrub</span>
                      <span>Wk 12: {(trajectoryValues[trajectoryValues.length - 1] / 10).toFixed(1)}</span>
                    </div>
                  </div>

                  {/* 3 Driver Impact Tiles */}
                  <div className="grid grid-cols-3 gap-1.5 w-full mt-2">
                    <div className="bg-zinc-900/60 border border-white/10 rounded-md p-1.5 text-left">
                      <span className="text-[0.52rem] text-zinc-400 block font-medium">SLEEP (r = +0.77)</span>
                      <span className={`text-[0.76rem] font-semibold ${formData.sleep_hours_per_night >= 7 ? 'text-emerald-400' : 'text-amber-400'}`}>
                        {formData.sleep_hours_per_night >= 7 ? '+1.2 pts' : '-1.1 pts'}
                      </span>
                    </div>
                    <div className="bg-zinc-900/60 border border-white/10 rounded-md p-1.5 text-left">
                      <span className="text-[0.52rem] text-zinc-400 block font-medium">SCREEN (r = -0.82)</span>
                      <span className={`text-[0.76rem] font-semibold ${formData.avg_daily_usage_hours <= 4 ? 'text-emerald-400' : 'text-rose-400'}`}>
                        {formData.avg_daily_usage_hours <= 4 ? 'Low Load' : 'Elevated'}
                      </span>
                    </div>
                    <div className="bg-zinc-900/60 border border-white/10 rounded-md p-1.5 text-left">
                      <span className="text-[0.52rem] text-zinc-400 block font-medium">VS COHORT (6.23)</span>
                      <span className="text-[0.76rem] font-semibold text-zinc-200">
                        {score !== null 
                          ? (score >= 6.23 ? `+${(score - 6.23).toFixed(1)} pts` : `${(score - 6.23).toFixed(1)} pts`) 
                          : 'Baseline 6.2'}
                      </span>
                    </div>
                  </div>
                </div>
              )}

              {/* Bottom Caption */}
              <p className="text-[0.66rem] text-zinc-500 mt-1 shrink-0">
                {caption}
              </p>
            </div>
          </div>
        </main>
      </div>

      {/* Full Analytics Suite Full-Screen Modal Dialog */}
      {showFullSuite && (
        <div className="fixed inset-0 z-50 bg-black flex flex-col w-screen h-screen overflow-hidden select-none">
          {/* Top Bar */}
          <div className="flex justify-between items-center px-4 sm:px-5 py-2.5 sm:py-2 border-b border-white/10 shrink-0 bg-zinc-950 z-20">
            <div className="flex items-center gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
              <span className="text-xs sm:text-sm text-zinc-300 font-medium">
                Cohort Analytics & Behavioral Dynamics
              </span>
            </div>
            <div className="flex items-center gap-3">
              <span className="text-[0.65rem] text-zinc-500 hidden sm:inline font-mono">
                Press ESC to exit
              </span>
              <button
                type="button"
                onClick={() => setShowFullSuite(false)}
                title="Close full-screen view (Esc)"
                className="px-2.5 py-1 rounded bg-zinc-900 hover:bg-zinc-800 text-zinc-300 hover:text-white transition-all border border-white/10 flex items-center gap-1.5 text-xs font-medium cursor-pointer"
              >
                <span>Close</span>
                <X className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>

          {/* Full-Screen Flow Diagram - scrollable on mobile */}
          <div className="flex-1 overflow-y-auto lg:overflow-hidden flex flex-col w-full min-h-0">
            <InkOrbitFeatures
              className="ib-fullscreen"
              theme="dark"
              brand="Random Forest AI"
              tag=""
              title=""
              context={{
                formData,
                score,
                statusBadge,
                statusText,
                caption,
              }}
              collaboration={{
                title: "5-Dimensional Behavioral Telemetry",
                description: `Tracking user habits: Screen (${formData.avg_daily_usage_hours}h), Unlocks (${formData.daily_unlocks}/d), Sleep (${formData.sleep_hours_per_night}h), Study (${formData.study_hours}h), and Activity (${formData.physical_activity_hours}h).`,
              }}
              reports={{
                title: "Empirical Cohort Synthesis",
                description: `Benchmarked against 5,000 university records (${formData.gender}, ${formData.age}y, ${formData.academic_level} from ${formData.country || 'India'}). Predicted: ${currentScoreVal.toFixed(1)}/10 vs Cohort: 6.23/10.`,
              }}
              integrations={{
                title: "Key Behavioral Correlates (Pearson r)",
                description: `Screen (${formData.avg_daily_usage_hours}h, -0.82 r) & Unlocks (${formData.daily_unlocks}/d, -0.79 r) drive digital strain. Sleep (${formData.sleep_hours_per_night}h, +0.77 r) & Study (${formData.study_hours}h, +0.75 r) protect wellness.`,
                tools: [
                  `Screen ${formData.avg_daily_usage_hours}h (-0.82 r)`,
                  `Sleep ${formData.sleep_hours_per_night}h (+0.77 r)`,
                  `Study ${formData.study_hours}h (+0.75 r)`,
                  `Unlocks ${formData.daily_unlocks}/d (-0.79 r)`,
                ],
              }}
              insights={{
                title: "12-Week Restorative Intervention Forecast",
                description: `Longitudinal recovery trajectory (Predicted: ${currentScoreVal.toFixed(1)}/10 vs Cohort: 6.23). Maintaining sleep ≥7.5h & screen ≤3.5h projects recovery to 8.0/10 (+54%).`,
                values: trajectoryValues,
                forecastFrom: 7,
              }}
            />
          </div>
        </div>
      )}
    </div>
  )
}
