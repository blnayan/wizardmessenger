import { headers } from "next/headers";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { auth } from "@/lib/auth";
import { Default } from "./_components/default";

export default async function IndexPage() {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session) return <Default />;

  return <div>Hello</div>;
}
