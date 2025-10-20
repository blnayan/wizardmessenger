import { ThemeModeToggle } from "@/components/theme-mode-toggle";
import Image from "next/image";

export default function Home() {
  return (
    <div className="flex flex-col min-h-screen">
      <div className="flex-0">
        <div className="flex flex-row">
          <div className="flex-1"></div>
          <div className="flex flex-row flex-0 p-2">
            <ThemeModeToggle />
          </div>
        </div>
      </div>
      <div className="flex flex-col flex-1 items-center justify-center">
        <h1 className="text-4xl font-bold">Welcome to Wizard Messenger!</h1>
        <p className="text-lg text-muted-foreground/60">
          Start chatting with your favorite wizards.
        </p>
      </div>
    </div>
  );
}
