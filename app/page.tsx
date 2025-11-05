import Chat from "@/components/Chat";

export default function Page() {
  return (
    <div className="card">
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 12 }}>
        <div className="badge"><span className="dot"/> Premium Multi-Model Chat</div>
      </div>
      <Chat />
    </div>
  );
}
