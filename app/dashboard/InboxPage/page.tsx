"use client";

import { useEffect, useRef, useState } from "react";
import io from "socket.io-client";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

interface Message {
  id: number;
  sender: string;
  avatar?: string;
  message: string;
  time: string;
}

let socket: any;

export default function InboxPage() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState("");
  const scrollRef = useRef<HTMLDivElement>(null);

  // connect socket
  useEffect(() => {
    socket = io();

    socket.on("receive-message", (msg: Message) => {
      setMessages((prev) => [...prev, msg]);
    });

    return () => {
      socket.disconnect();
    };
  }, []);

  // auto scroll to bottom
  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  const sendMessage = () => {
    if (!newMessage.trim()) return;
    const msg: Message = {
      id: Date.now(),
      sender: "You",
      message: newMessage,
      time: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
    };
    socket.emit("send-message", msg);
    setNewMessage("");
  };

  return (
    <div className="flex h-screen w-full items-center justify-center bg-gray-50 p-4">
      <Card className="flex h-[85vh] w-full max-w-2xl flex-col shadow-xl rounded-2xl overflow-hidden">
        {/* Header */}
        <CardHeader className="flex items-center justify-between border-b bg-white py-3 px-5">
          <div className="flex items-center gap-3">
            <Avatar className="h-10 w-10">
              <AvatarImage src="" />
              <AvatarFallback>A</AvatarFallback>
            </Avatar>
            <div>
              <h2 className="text-base font-semibold">Agent Smith</h2>
              <p className="text-xs text-green-500">Online</p>
            </div>
          </div>
          <Button size="sm" variant="outline">⋮</Button>
        </CardHeader>

        {/* Chat area */}
        <CardContent className="flex flex-1 flex-col bg-gray-100">
          <div
            ref={scrollRef}
            className="flex flex-1 flex-col gap-3 overflow-y-auto p-4"
          >
            {messages.map((msg) => (
              <div
                key={msg.id}
                className={`flex items-end gap-2 ${
                  msg.sender === "You" ? "justify-end" : "justify-start"
                }`}
              >
                {msg.sender !== "You" && (
                  <Avatar className="h-8 w-8">
                    <AvatarImage src={msg.avatar || ""} />
                    <AvatarFallback>{msg.sender[0]}</AvatarFallback>
                  </Avatar>
                )}
                <div
                  className={`relative max-w-[70%] rounded-2xl px-4 py-2 text-sm shadow-md ${
                    msg.sender === "You"
                      ? "bg-blue-600 text-white rounded-br-none"
                      : "bg-white text-gray-800 rounded-bl-none"
                  }`}
                >
                  <p>{msg.message}</p>
                  <span className="mt-1 block text-xs opacity-70 text-right">{msg.time}</span>
                </div>
              </div>
            ))}
          </div>

          {/* Input box */}
          <div className="border-t bg-white p-3 flex items-center gap-2">
            <Input
              placeholder="Type a message..."
              value={newMessage}
              onChange={(e) => setNewMessage(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && sendMessage()}
              className="flex-1 rounded-full"
            />
            <Button
              onClick={sendMessage}
              className="rounded-full px-5 bg-blue-600 hover:bg-blue-700"
            >
              Send
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
