"use client";

import {
  InputGroup,
  InputGroupAddon,
  InputGroupAutoSizingTextarea,
} from "@/components/ui/input-group";
import { Spinner } from "@/components/ui/spinner";
import { SendIcon } from "lucide-react";
import { useState } from "react";

export interface MessageTextAreaProps {
  onSendMessage: (message: string) => Promise<void>;
}

export function MessageTextArea({ onSendMessage }: MessageTextAreaProps) {
  const [draft, setDraft] = useState("");
  const [sending, setSending] = useState(false);

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (draft.trim() === "") return;
    setSending(true);
    await onSendMessage(draft);
    setDraft("");
    setSending(false);
  }

  function handleChange(event: React.ChangeEvent<HTMLTextAreaElement>) {
    setDraft(event.target.value);
  }

  function handleKeyDown(event: React.KeyboardEvent<HTMLTextAreaElement>) {
    if (event.key === "Enter" && !event.shiftKey) {
      event.preventDefault();
      event.currentTarget.form?.requestSubmit();
    }
  }

  return (
    <form onSubmit={handleSubmit}>
      <InputGroup className="items-end">
        <InputGroupAutoSizingTextarea
          className="h-11 min-h-11"
          disabled={sending}
          value={draft}
          onChange={handleChange}
          onKeyDown={handleKeyDown}
          name="message-input"
          placeholder="Type your message..."
        />
        <InputGroupAddon align="inline-end" className="p-3">
          <div className="h-5">
            {sending ? (
              <Spinner className="size-5" />
            ) : (
              <button
                className="hover:cursor-pointer"
                type="submit"
                disabled={sending}
              >
                <SendIcon size={20} />
              </button>
            )}
          </div>
        </InputGroupAddon>
      </InputGroup>
    </form>
  );
}
