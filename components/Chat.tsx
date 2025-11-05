"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { ProviderInfo, ChatMessage } from "@/lib/types";

export default function Chat() {
  const [providers, setProviders] = useState<ProviderInfo[]>([]);
  const [selectedProviderId, setSelectedProviderId] = useState<string>("super");
  const [messages, setMessages] = useState<ChatMessage[]>([
    { role: "assistant", content: "Welcome to Super AI. How can I help today?" },
  ]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const endRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    fetch("/api/providers")
      .then((r) => r.json())
      .then((data) => {
        setProviders(data.providers);
      })
      .catch(() => setProviders([]));
  }, []);

  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isLoading]);

  const selectableProviders = useMemo(() => {
    return [{ id: "super", name: "Super AI (Ensemble)", enabled: true }, ...providers];
  }, [providers]);

  async function sendMessage() {
    if (!input.trim()) return;
    const userMessage: ChatMessage = { role: "user", content: input.trim() };
    setMessages((m) => [...m, userMessage]);
    setInput("");
    setIsLoading(true);

    try {
      const endpoint = selectedProviderId === "super" ? "/api/super" : "/api/chat";
      const body = selectedProviderId === "super"
        ? { messages: [...messages, userMessage] }
        : { providerId: selectedProviderId, messages: [...messages, userMessage] };

      const res = await fetch(endpoint, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });
      const data = await res.json();
      const answer: string = data.answer ?? data.response ?? "[No response]";
      setMessages((m) => [...m, { role: "assistant", content: answer }]);
    } catch (err: any) {
      setMessages((m) => [...m, { role: "assistant", content: "Error: " + (err?.message || String(err)) }]);
    } finally {
      setIsLoading(false);
    }
  }

  function reset() {
    setMessages([{ role: "assistant", content: "New conversation started. What would you like to do?" }]);
  }

  return (
    <div>
      <div className="row" style={{ marginBottom: 12 }}>
        <div className="col">
          <label htmlFor="provider">Model</label>
          <select id="provider" value={selectedProviderId} onChange={(e) => setSelectedProviderId(e.target.value)}>
            {selectableProviders.map((p) => (
              <option key={p.id} value={p.id} disabled={p.enabled === false}>
                {p.name}{p.enabled === false ? " (disabled)" : ""}
              </option>
            ))}
          </select>
        </div>
        <div className="col" style={{ display: "flex", alignItems: "flex-end", justifyContent: "flex-end", gap: 8 }}>
          <button className="button secondary" onClick={reset}>Reset</button>
        </div>
      </div>

      <div className="chat" style={{ minHeight: 320 }}>
        {messages.map((m, i) => (
          <div key={i} className={`message ${m.role}`}>
            <div className={`bubble ${m.role}`}>{m.content}</div>
          </div>
        ))}
        {isLoading && (
          <div className="message assistant"><div className="bubble assistant">Thinking?</div></div>
        )}
        <div ref={endRef} />
      </div>

      <div className="inputRow">
        <input
          placeholder="Ask anything?"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => { if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); sendMessage(); } }}
        />
        <button className="button" disabled={isLoading} onClick={sendMessage}>Send</button>
      </div>
    </div>
  );
}
