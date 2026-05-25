"use client";

import { useState } from "react";
import axios from "axios";

export default function AIAnalysisPage() {
  const [logs, setLogs] = useState("");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<any>(null);

  const analyzeLogs = async () => {
    try {
      setLoading(true);

      const response = await axios.post(
        "https://ai-sre-copilot.onrender.com/api/ai/analyze",
        {
          logs,
        }
      );

      setResult(response.data);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">AI Incident Analyzer</h1>
        <p className="text-gray-400">
          Paste logs and let AI detect root cause
        </p>
      </div>

      <textarea
        value={logs}
        onChange={(e) => setLogs(e.target.value)}
        placeholder="Paste logs here..."
        className="w-full rounded-lg border bg-black p-4 text-white"
        rows={10}
      />

      <button
        onClick={analyzeLogs}
        className="rounded-lg bg-blue-600 px-6 py-3 font-semibold"
      >
        {loading ? "Analyzing..." : "Analyze Logs"}
      </button>

      {result && (
  <div className="space-y-6 rounded-2xl border bg-card p-6 shadow-sm">

    {/* Severity */}
    <div className="flex items-center justify-between">
      <div>
        <h2 className="text-lg font-bold">Incident Severity</h2>
        <p className="text-muted-foreground">
          AI-generated infrastructure analysis
        </p>
      </div>

      <span
        className={`rounded-full px-4 py-2 text-sm font-semibold ${
          result.severity === "Critical"
            ? "bg-red-500/20 text-red-500"
            : result.severity === "High"
            ? "bg-orange-500/20 text-orange-500"
            : "bg-yellow-500/20 text-yellow-500"
        }`}
      >
        {result.severity}
      </span>
    </div>

    {/* Root Cause */}
    <div className="rounded-xl border p-5">
      <h3 className="mb-2 text-lg font-semibold">
        Root Cause Analysis
      </h3>

      <p className="text-muted-foreground">
        {result.root_cause}
      </p>
    </div>

    {/* Impact */}
    <div className="rounded-xl border p-5">
      <h3 className="mb-2 text-lg font-semibold">
        Business Impact
      </h3>

      <p className="text-muted-foreground">
        {result.impact}
      </p>
    </div>

    {/* Solution */}
    <div className="rounded-xl border p-5">
      <h3 className="mb-2 text-lg font-semibold">
        AI Suggested Solution
      </h3>

      <p className="text-muted-foreground">
        {result.solution}
      </p>
    </div>

    {/* Actions */}
    <div className="rounded-xl border p-5">
      <h3 className="mb-4 text-lg font-semibold">
        Recommended Actions
      </h3>

      <div className="space-y-3">
        {result.recommended_actions?.map(
          (item: string, index: number) => (
            <div
              key={index}
              className="rounded-lg border bg-accent/40 px-4 py-3"
            >
              ✅ {item}
            </div>
          )
        )}
      </div>
    </div>
  </div>
)}
    </div>
  );
}