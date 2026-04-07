"use client";

import { useState } from "react";

export default function Home() {
  const [meals, setMeals] = useState("");
  const [budget, setBudget] = useState("");
  const [dietary, setDietary] = useState("");
  const [servings, setServings] = useState("4");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    setResult("");
    try {
      const res = await fetch("/api/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ meals, budget, dietary, servings }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Generation failed");
      setResult(data.result);
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen bg-gradient-to-b from-gray-900 via-gray-950 to-gray-900 text-white">
      <div className="max-w-4xl mx-auto px-6 py-16">
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-2 mb-4 px-4 py-2 rounded-full bg-teal-500/10 border border-teal-500/20">
            <span className="text-teal-400 text-sm font-medium">HSL 150° — Teal</span>
          </div>
          <h1 className="text-4xl md:text-5xl font-bold mb-4">
            <span className="text-teal-400">AI Grocery List</span> & Meal Prep Planner
          </h1>
          <p className="text-gray-400 text-lg max-w-xl mx-auto">
            Plan your week meals, generate optimized grocery lists, and prep like a pro.
            Save time, reduce waste, and eat well.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6 mb-12">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-300">Planned Meals / Recipes</label>
              <textarea value={meals} onChange={(e) => setMeals(e.target.value)} placeholder="Monday: chicken stir-fry, Tuesday: lentil soup..." rows={4} required className="w-full bg-gray-800/50 border border-gray-700 rounded-xl px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-teal-500/50 focus:border-teal-500/50 resize-none" />
            </div>
            <div className="space-y-6">
              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-300">Weekly Food Budget</label>
                <input type="text" value={budget} onChange={(e) => setBudget(e.target.value)} placeholder="$75, $100, $150..." className="w-full bg-gray-800/50 border border-gray-700 rounded-xl px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-teal-500/50 focus:border-teal-500/50" />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-300">Dietary Restrictions</label>
                <input type="text" value={dietary} onChange={(e) => setDietary(e.target.value)} placeholder="vegetarian, gluten-free..." className="w-full bg-gray-800/50 border border-gray-700 rounded-xl px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-teal-500/50 focus:border-teal-500/50" />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-300">Servings per Meal</label>
                <input type="number" value={servings} onChange={(e) => setServings(e.target.value)} min="1" max="20" placeholder="4" className="w-full bg-gray-800/50 border border-gray-700 rounded-xl px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-teal-500/50 focus:border-teal-500/50" />
              </div>
            </div>
          </div>

          <button type="submit" disabled={loading} className="w-full py-4 rounded-xl font-semibold text-white bg-gradient-to-r from-teal-600 to-teal-700 hover:from-teal-500 hover:to-teal-600 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 shadow-lg shadow-teal-900/30">
            {loading ? <span className="flex items-center justify-center gap-2"><svg className="animate-spin h-5 w-5" viewBox="0 0 24 24" fill="none"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" /><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z" /></svg>Planning your week...</span> : "🛒 Generate Grocery List"}
          </button>
        </form>

        {error && <div className="mb-8 p-4 rounded-xl bg-red-900/20 border border-red-500/30 text-red-400">{error}</div>}

        {result && (
          <div className="rounded-xl bg-gray-800/60 border border-gray-700 p-8 shadow-xl">
            <div className="flex items-center gap-2 mb-6">
              <span className="text-2xl">✨</span>
              <h2 className="text-xl font-semibold text-white">Your Meal Prep Plan</h2>
            </div>
            <div className="prose prose-invert prose-sm max-w-none text-gray-300 leading-relaxed">
              <style>{`.prose h1, .prose h2, .prose h3 { color: #2dd4bf; font-weight: 700; margin-top: 1.5em; margin-bottom: 0.5em; } .prose strong { color: #5eead4; }`}</style>
              <div dangerouslySetInnerHTML={{ __html: result.replace(/\n/g, "<br/>") }} />
            </div>
          </div>
        )}
      </div>
    </main>
  );
}
