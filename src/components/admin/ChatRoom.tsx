"use client";

import { useEffect, useRef, useState } from "react";
import { io } from "socket.io-client";
type Socket = any;

interface Message {
  sender: "client" | "admin";
  text: string;
  createdAt?: string | Date;
}

export default function ChatRoom({ chatId, initial }: { chatId: string; initial: Message[] }) {
  const [messages, setMessages] = useState<Message[]>(initial || []);
  const [input, setInput] = useState("");
  const socketRef = useRef<Socket | null>(null);
  const lastSigRef = useRef<string>("");

  useEffect(() => {
    fetch("/api/socket").catch(() => {});
    const s = io({ path: "/api/socket_io" });
    socketRef.current = s;
    s.on("connect", () => {
      s.emit("join", chatId);
    });
    s.on("message", (payload: any) => {
      if (payload.chatId !== chatId) return;
      const sig = `${payload.sender}|${payload.text}`;
      // If last message we already show has same sig, ignore to prevent duplicate
      const currentLast = messages[messages.length - 1];
      const currentSig = currentLast ? `${currentLast.sender}|${currentLast.text}` : "";
      if (sig === currentSig || sig === lastSigRef.current) return;
      lastSigRef.current = sig;
      setMessages((m) => [...m, { sender: payload.sender, text: payload.text, createdAt: new Date().toISOString() }]);
    });
    return () => {
      s.disconnect();
    };
  }, [chatId]);

  async function send() {
    const text = input.trim();
    if (!text) return;
    setInput("");
    setMessages((m) => [...m, { sender: "admin", text, createdAt: new Date().toISOString() }]);
    await fetch(`/api/admin/chats/${chatId}/reply`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ message: text }),
    }).catch(() => {});
  }

  return (
    <div className="bg-white rounded-xl border overflow-hidden">
      <div className="h-[60vh] overflow-y-auto p-4 space-y-2 bg-gray-50">
        {messages.map((m, idx) => (
          <div key={idx} className={`flex ${m.sender === "admin" ? "justify-end" : "justify-start"}`}>
            <div className={`${m.sender === "admin" ? "bg-indigo-600 text-white" : "bg-white text-gray-800"} px-3 py-2 rounded-lg max-w-[75%] shadow`}>
              {m.text}
            </div>
          </div>
        ))}
      </div>
      <div className="border-t p-3 flex gap-2">
        <input
          className="flex-1 border rounded-md px-3 py-2 text-sm"
          placeholder="Type your reply"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && send()}
        />
        <button onClick={send} className="bg-indigo-600 text-white rounded-md px-4 text-sm">Reply</button>
      </div>
    </div>
  );
}
