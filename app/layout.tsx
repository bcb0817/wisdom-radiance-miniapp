import type { Metadata } from "next"; import "./globals.css"; import BottomNav from "../components/BottomNav";
export const metadata: Metadata={title:"Wisdom Radiance",description:"更年期の体験から自分なりの答えを探す"};
export default function RootLayout({children}:{children:React.ReactNode}){return <html lang="ja"><body>{children}<BottomNav /></body></html>}
