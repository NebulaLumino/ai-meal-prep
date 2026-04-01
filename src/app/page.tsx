"use client";
import { useState } from "react";

function Page() {
  const [goal, setGoal] = useState("");
  const [servings, setServings] = useState("5");
  const [dietary, setDietary] = useState("None");
  const accent = "sky";
  const [output, setOutput] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleGenerate = async () => {
    if (!goal.trim()) { setError("Please enter your meal prep goal."); return; }
    setLoading(true); setError(""); setOutput("");
    try {
      const res = await fetch("/api/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ goal, servings, dietary }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Generation failed");
      setOutput(data.output);
    } catch (err: any) { setError(err.message); }
    finally { setLoading(false); }
  };

  return (
    <main className="max-w-5xl mx-auto px-4 py-12">
      <div className="text-center mb-10">
        <h1 className={`text-4xl font-bold mb-3 bg-gradient-to-r from-${accent}-400 to-${accent}-600 bg-clip-text text-transparent`}>AI Meal Prep Planner</h1>
        <p className="text-gray-400 text-sm">Plan efficient weekly meal prep sessions with batch cooking schedules</p>
      </div>
      <div className="bg-gray-800/50 border border-gray-700 rounded-xl p-6 mb-6">
        <h2 className="text-lg font-semibold mb-4 text-gray-200">Meal Prep Details</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="md:col-span-2">
            <label className="block text-sm font-medium mb-1">Meal Prep Goal *</label>
            <textarea value={goal} onChange={e => setGoal(e.target.value)} placeholder="e.g., High protein weight loss, busy work week dinners, muscle gain, budget-friendly family meals" rows={3} className="w-full bg-gray-800 border border-gray-700 rounded px-3 py-2 text-sm focus:outline-none focus:border-sky-500" />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Servings to Prep</label>
            <select value={servings} onChange={e => setServings(e.target.value)} className="w-full bg-gray-800 border border-gray-700 rounded px-3 py-2 text-sm focus:outline-none focus:border-sky-500">
              <option>3</option><option>5</option><option>7</option><option>10</option><option>14</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Dietary</label>
            <select value={dietary} onChange={e => setDietary(e.target.value)} className="w-full bg-gray-800 border border-gray-700 rounded px-3 py-2 text-sm focus:outline-none focus:border-sky-500">
              <option>None</option><option>Vegetarian</option><option>Vegan</option><option>Gluten-Free</option><option>Keto</option><option>Paleo</option><option>Low-Carb</option>
            </select>
          </div>
        </div>
      </div>
      <div className="flex justify-center mb-6">
        <button onClick={handleGenerate} disabled={loading} className={`px-8 py-3 rounded-lg font-semibold text-white ${loading ? 'bg-sky-700 cursor-not-allowed' : 'bg-sky-600 hover:bg-sky-500 transition-all'}`}>
          {loading ? "Planning..." : "Generate Meal Prep Plan"}
        </button>
      </div>
      {error && <div className="bg-red-900/30 border border-red-700 rounded-lg p-4 text-red-300 text-sm mb-6">{error}</div>}
      {output && (
        <div className="bg-gray-800/70 border border-gray-700 rounded-xl p-6">
          <h2 className="text-lg font-semibold mb-4 text-gray-200">Weekly Meal Prep Plan</h2>
          <pre className="text-gray-300 text-sm whitespace-pre-wrap font-sans">{output}</pre>
        </div>
      )}
    </main>
  );
}
export default Page;
