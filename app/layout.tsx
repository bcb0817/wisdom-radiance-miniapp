import type { Metadata } from "next"; import "./globals.css"; import OpenChatRedirect from "./OpenChatRedirect";
export const metadata: Metadata={title:"Wisdom Radiance",description:"更年期の体験から自分なりの答えを探す"};
export default function RootLayout({children}:{children:React.ReactNode}){return <html lang="ja"><body><OpenChatRedirect />{children}</body></html>}
