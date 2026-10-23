import Link from "next/link";
import SampleDashboard from "../../../components/admin/SampleDashboard";

export default function SampleDashboardPage() {
  return (
    <main style={{ maxWidth: 1100, margin: "0 auto", padding: "24px 16px 80px" }}>
      <Link href="/admin/moderation" className="back-link">← 運営モデレーションへ</Link>
      <h1>サンプルダッシュボード</h1>
      <SampleDashboard />
    </main>
  );
}
