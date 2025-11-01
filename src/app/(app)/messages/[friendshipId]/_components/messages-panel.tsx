"use client";

import { safeFetch } from "@/lib/safe-fetch";
import { Message } from "@prisma/client";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { MessageTextArea } from "./message-text-area";
import { MessageCard } from "./message-card";
import { socket } from "@/lib/socket";

export interface MessagesPanelProps {
  userId: string;
  friendshipId: string;
  messages: Message[];
}

export function MessagesPanel({
  userId,
  friendshipId,
  messages,
}: MessagesPanelProps) {
  const [messageList, setMessageList] = useState<Message[]>(messages);

  useEffect(() => {
    setMessageList(messages);
  }, [messages]);

  useEffect(() => {
    socket.on("messageSent", (message) => {
      setMessageList((prev) => [...prev, message]);
    });

    return () => {
      socket.off("messageSent");
    };
  }, []);

  async function handleSendMessage(content: string) {
    const result = await safeFetch.post<Message>(
      `/api/messages/${friendshipId}`,
      {
        content,
      },
    );

    if (!result.ok) {
      toast.error(result.error);
      return;
    }

    const message = result.data;

    socket.emit("messageSent", message);

    setMessageList((prev) => [...prev, message]);
    return;
  }

  return (
    <div className="flex flex-col gap-4 p-4 h-full w-full">
      <div className="flex-1 flex flex-col gap-4">
        {messageList.map((message) => (
          <MessageCard key={message.id} message={message} userId={userId} />
        ))}
      </div>
      <MessageTextArea onSendMessage={handleSendMessage} />
    </div>
  );
}
