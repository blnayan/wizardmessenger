"use client";

import { usePathname } from "next/navigation";
import { FriendsMenuButton } from "./_components/friends-menu-button";
import Link from "next/link";

export default function FriendsLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const pathname = usePathname();

  return (
    <main className="p-2 flex flex-col min-h-screen w-full gap-2">
      <div className="px-2 flex flex-row gap-2">
        <FriendsMenuButton isActive={pathname.endsWith("/all")} asChild>
          <Link href="/friends/all">All</Link>
        </FriendsMenuButton>
        <FriendsMenuButton isActive={pathname.endsWith("/requests")} asChild>
          <Link href="/friends/requests">Requests</Link>
        </FriendsMenuButton>
        <FriendsMenuButton isActive={pathname.endsWith("/add")} asChild>
          <Link href="/friends/add">Add</Link>
        </FriendsMenuButton>
      </div>
      <div className="px-2 flex flex-col gap-2">{children}</div>
    </main>
  );
}
