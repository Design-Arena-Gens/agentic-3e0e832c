import dynamic from "next/dynamic";

const ComparisonView = dynamic(() => import("@/components/ComparisonView"), { ssr: false });

export default function ComparePage() {
  return (
    <div className="card">
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 12 }}>
        <div className="badge"><span className="dot"/> Model Comparison</div>
      </div>
      <ComparisonView />
    </div>
  );
}
