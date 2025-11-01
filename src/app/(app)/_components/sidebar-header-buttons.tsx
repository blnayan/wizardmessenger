"use client";

import { SidebarMenuButton } from "@/components/ui/sidebar";
import Link from "next/link";
import { usePathname } from "next/navigation";

export function SidebarHeaderButtons() {
  const pathname = usePathname();

  return (
    <>
      <SidebarMenuButton isActive={pathname.startsWith("/friends")} asChild>
        <Link href="/friends/all">Friends</Link>
      </SidebarMenuButton>
    </>
  );
}
