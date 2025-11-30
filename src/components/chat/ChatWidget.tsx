"use client";

import { useEffect, useRef, useState } from "react";
import Cookies from "js-cookie";
import { io } from "socket.io-client";
type Socket = any;

interface Message {
  sender: "client" | "admin";
  text: string;
  createdAt?: string | Date;
}

export default function ChatWidget() {
  const [open, setOpen] = useState(false);
  const [chatId, setChatId] = useState<string | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const socketRef = useRef<Socket | null>(null);
  const clientIdRef = useRef<string>("");
  const chatIdRef = useRef<string | null>(null);

  useEffect(() => {
    const cid = Cookies.get("chat_client_id") || crypto.randomUUID();
    Cookies.set("chat_client_id", cid, { expires: 365 });
    clientIdRef.current = cid;
  }, []);

  // Hydrate existing chat if any on mount
  useEffect(() => {
    (async () => {
      try {
        if (!clientIdRef.current) return;
        const res = await fetch(`/api/chats/by-client/${clientIdRef.current}`);
        if (!res.ok) return;
        const data = await res.json();
        if (data?.found && data?.chatId) {
          setChatId(data.chatId as string);
          if (Array.isArray(data.messages)) setMessages(data.messages as any);
        }
      } catch {}
    })();
  }, []);

  // Connect socket once
  useEffect(() => {
    fetch("/api/socket").catch(() => {});
    const s = io({ path: "/api/socket_io" });
    socketRef.current = s;
    s.on("connect", () => {
      if (chatIdRef.current) s.emit("join", chatIdRef.current);
    });
    s.on("message", (payload: any) => {
      if (!chatIdRef.current || payload.chatId !== chatIdRef.current) return;
      if (payload.clientId && payload.clientId === clientIdRef.current) return;
      setMessages((m) => [...m, { sender: payload.sender, text: payload.text, createdAt: new Date().toISOString() }]);
    });
    return () => {
      s.disconnect();
    };
  }, []);

  // Keep ref in sync and join room when chatId changes
  useEffect(() => {
    chatIdRef.current = chatId;
    if (chatId && socketRef.current) {
      socketRef.current.emit("join", chatId);
    }
  }, [chatId]);

  async function ensureStarted(firstMessage?: string) {
    if (chatId) return chatId;
    const res = await fetch("/api/chats/start", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ clientId: clientIdRef.current, message: firstMessage || "Hi" }),
    });
    const data = await res.json();
    if (res.ok) {
      setChatId(data.chatId);
      socketRef.current?.emit("join", data.chatId);
      return data.chatId as string;
    } else {
      throw new Error(data.error || "Failed to start chat");
    }
  }

  async function send() {
    const text = input.trim();
    if (!text) return;
    setInput("");
    if (!chatId) {
      // Starting chat with this first message – server will broadcast, we ignore our echo
      await ensureStarted(text);
      setMessages((m) => [...m, { sender: "client", text, createdAt: new Date().toISOString() }]);
      return;
    }
    // Existing chat
    const id = chatId;
    setMessages((m) => [...m, { sender: "client", text, createdAt: new Date().toISOString() }]);
    await fetch(`/api/chats/${id}/message`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ clientId: clientIdRef.current, message: text }),
    }).catch(() => {});
  }

  return (
    <>
      {/* FAB */}
      <button
        onClick={() => setOpen((o) => !o)}
        style={{ position: "fixed", right: 20, bottom: 20, zIndex: 10000 }}
        className="h-14 w-14 rounded-full bg-black text-white shadow-xl flex items-center justify-center hover:opacity-90 transition"
        aria-label="Open chat"
      >
        {!open ? (
          <svg width="26" height="26" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M4 4h16v11a3 3 0 0 1-3 3H9l-5 4V4z" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        ) : (
          <span className="text-2xl leading-none">×</span>
        )}
      </button>

      {/* Panel */}
      {open && (
        <div
          style={{ position: "fixed", right: 20, bottom: 92, zIndex: 10000, width: 340 }}
          className="bg-white rounded-2xl shadow-2xl border border-gray-200 overflow-hidden"
        >
          <div className="flex items-center justify-between bg-black text-white px-4 py-3 text-sm font-semibold">
            <span>Chat with us</span>
            <button onClick={() => setOpen(false)} aria-label="Close" className="text-white/80 hover:text-white text-xl">×</button>
          </div>
          <div className="h-72 overflow-y-auto p-3 space-y-2 bg-gray-50">
            {messages.length === 0 && (
              <div className="text-xs text-gray-500">Hi 👋, ask us anything. We reply here.</div>
            )}
            {messages.map((m, idx) => (
              <div key={idx} className={`flex ${m.sender === "client" ? "justify-end" : "justify-start"}`}>
                <div className={`${m.sender === "client" ? "bg-black text-white" : "bg-white text-gray-900 border"} px-3 py-2 rounded-xl max-w-[75%] shadow` }>
                  {m.text}
                </div>
              </div>
            ))}
          </div>
          <div className="border-t p-2 flex gap-2 bg-white">
            <input
              className="flex-1 border rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-black"
              placeholder="Write message"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  e.preventDefault();
                  send();
                }
              }}
            />
            <button type="button" onClick={send} className="bg-black text-white rounded-md px-4 text-sm">Send</button>
          </div>
        </div>
      )}
    </>
  );
}
