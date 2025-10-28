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
    <main className="p-4 flex flex-col min-h-full w-full gap-4">
      <div className="flex flex-row gap-2">
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
      <div className="flex flex-col gap-4">{children}</div>
    </main>
  );
}
