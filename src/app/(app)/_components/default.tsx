import { Header } from "@/components/header";
import { Button } from "@/components/ui/button";
import Link from "next/link";

export function Default() {
  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <main className="flex flex-col flex-1 items-center justify-center">
        <h1 className="text-4xl font-bold">Welcome to Wizard Messenger!</h1>
        <p className="text-lg text-muted-foreground/60">
          Start chatting with your favorite wizards.
        </p>
        <Button asChild>
          <Link className="mt-4" href="/sign-in">
            Sign in
          </Link>
        </Button>
      </main>
    </div>
  );
}
