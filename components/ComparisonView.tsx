"use client";

import { useEffect, useMemo, useState } from "react";
import { ProviderInfo } from "@/lib/types";

export default function ComparisonView() {
  const [providers, setProviders] = useState<ProviderInfo[]>([]);
  const [selected, setSelected] = useState<Record<string, boolean>>({});
  const [prompt, setPrompt] = useState("");
  const [results, setResults] = useState<Record<string, string>>({});
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    fetch("/api/providers")
      .then((r) => r.json())
      .then((data) => {
        setProviders(data.providers);
        const defaults: Record<string, boolean> = {};
        for (const p of data.providers) defaults[p.id] = p.enabled !== false;
        setSelected(defaults);
      })
      .catch(() => setProviders([]));
  }, []);

  const selectedProviderIds = useMemo(() => providers.filter((p) => selected[p.id]).map((p) => p.id), [providers, selected]);

  async function runCompare() {
    if (!prompt.trim()) return;
    setIsLoading(true);
    setResults({});
    try {
      const res = await fetch("/api/compare", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ providerIds: selectedProviderIds, messages: [{ role: "user", content: prompt }] })
      });
      const data = await res.json();
      setResults(data.results || {});
    } catch (err: any) {
      setResults({ error: err?.message || String(err) });
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <div>
      <div className="row" style={{ alignItems: "flex-start" }}>
        <div className="col">
          <div style={{ marginBottom: 8, fontWeight: 600 }}>Models</div>
          <div className="card" style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
            {providers.map((p) => (
              <label key={p.id} style={{ display: "flex", alignItems: "center", gap: 8 }}>
                <input type="checkbox" checked={!!selected[p.id]} disabled={p.enabled === false}
                  onChange={(e) => setSelected((s) => ({ ...s, [p.id]: e.target.checked }))} />
                {p.name}{p.enabled === false ? " (disabled)" : ""}
              </label>
            ))}
          </div>
        </div>
        <div className="col">
          <div style={{ marginBottom: 8, fontWeight: 600 }}>Prompt</div>
          <textarea rows={6} value={prompt} onChange={(e) => setPrompt(e.target.value)} placeholder="Enter a single prompt to compare responses?" />
          <div className="inputRow" style={{ marginTop: 8 }}>
            <button className="button" disabled={isLoading} onClick={runCompare}>Run Comparison</button>
          </div>
        </div>
      </div>

      <div style={{ marginTop: 16 }}>
        <div className="grid">
          {Object.entries(results).map(([id, text]) => (
            <div key={id} className="card">
              <div className="badge" style={{ marginBottom: 8 }}><span className="dot"/> {id}</div>
              <div style={{ whiteSpace: "pre-wrap" }}>{text}</div>
            </div>
          ))}
        </div>
        {isLoading && <div style={{ marginTop: 12 }}>Waiting for models?</div>}
      </div>
    </div>
  );
}
