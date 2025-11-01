import { cn } from "@/lib/utils";
import { Message } from "@prisma/client";
import { cva } from "class-variance-authority";

export interface MessageCardProps {
  userId: string;
  message: Message;
}

const messageStyle = cva("py-2 px-3 rounded-md max-w-[75%] text-sm w-fit", {
  variants: {
    variant: {
      user: "ml-auto bg-primary text-primary-foreground",
      friend: "bg-muted",
    },
  },
});

export function MessageCard({ userId, message }: MessageCardProps) {
  const messageFrom = message.senderId === userId ? "user" : "friend";

  return (
    <div className={cn(messageStyle({ variant: messageFrom }))}>
      {message.content}
    </div>
  );
}
