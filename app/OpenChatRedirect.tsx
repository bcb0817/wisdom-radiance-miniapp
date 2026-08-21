"use client";
import { useEffect } from "react";

const OPEN_CHAT_URL = process.env.NEXT_PUBLIC_OPENCHAT_URL || "https://line.me/ti/g2/IIlnQOJd8PVRn1746WHAU8_6ed0v8UbutjeEow?utm_source=invitation&utm_medium=link_copy&utm_campaign=default";

export default function OpenChatRedirect() {
  useEffect(() => {
    const handleClick = (event: MouseEvent) => {
      const element = event.target as HTMLElement | null;
      const button = element?.closest("button");
      if (button?.textContent?.includes("今みんなに聞いてみる")) {
        event.preventDefault();
        event.stopImmediatePropagation();
        window.location.assign(OPEN_CHAT_URL);
      }
    };
    document.addEventListener("click", handleClick, true);
    return () => document.removeEventListener("click", handleClick, true);
  }, []);
  return null;
}
