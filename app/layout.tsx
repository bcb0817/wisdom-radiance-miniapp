import type { Metadata } from "next"; import "./globals.css"; import BottomNav from "../components/BottomNav";import LiffInitializer from "../components/LiffInitializer";import Announcements from "../components/Announcements";import LegalLinks from "../components/LegalLinks";
export const metadata: Metadata={title:"Wisdom Radiance",description:"更年期の体験から自分なりの答えを探す"};
export default function RootLayout({children}:{children:React.ReactNode}){return <html lang="ja"><body><LiffInitializer/>{children}<Announcements/><LegalLinks/><BottomNav /></body></html>}
