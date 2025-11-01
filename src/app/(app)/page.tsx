import { Header } from "@/components/header";

export default async function IndexPage() {
  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <main className="flex flex-col flex-1 text-center justify-center p-4">
        <h1 className="text-4xl font-bold">Welcome to Wizard Messenger!</h1>
        <p className="text-lg text-muted-foreground/60">
          Start chatting with your favorite wizards by making{" "}
          <a className="underline hover:text-foreground" href="/friends/add">
            friends
          </a>
          .
        </p>
      </main>
    </div>
  );
}
