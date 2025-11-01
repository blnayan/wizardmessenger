"use client";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { SidebarMenuButton } from "@/components/ui/sidebar";
import { authClient } from "@/lib/auth-client";
import { User } from "@prisma/client";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

export interface SidebarFooterButtonsProps {
  user: User;
}

export function SidebarFooterButtons({ user }: SidebarFooterButtonsProps) {
  const router = useRouter();

  async function handleSignOut() {
    await authClient.signOut({
      fetchOptions: {
        onSuccess: () => {
          router.push("/sign-in");
        },
        onError: (error) => {
          toast.error("Failed to sign out");
        },
      },
    });
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger className="hover:cursor-pointer" asChild>
        <SidebarMenuButton>Settings</SidebarMenuButton>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-60" side="right">
        <DropdownMenuItem
          className="hover:cursor-pointer"
          onClick={handleSignOut}
          variant="destructive"
        >
          Sign out
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
