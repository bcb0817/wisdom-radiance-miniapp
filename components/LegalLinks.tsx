import Link from "next/link";

export default function LegalLinks() {
  return (
    <footer className="legal-links">
      <Link href="/privacy">プライバシーポリシー</Link>
      <span aria-hidden="true">｜</span>
      <Link href="/terms">利用規約</Link>
    </footer>
  );
}
