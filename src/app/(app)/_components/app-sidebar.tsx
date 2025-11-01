import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenuButton,
} from "@/components/ui/sidebar";
import { SidebarHeaderButtons } from "./sidebar-header-buttons";
import { prisma } from "@/lib/db";
import { SidebarFriendButtons } from "./sidebar-friend-buttons";
import { Separator } from "@/components/ui/separator";
import { User } from "@prisma/client";
import { SidebarFooterButtons } from "./sidebar-footer-buttons";

interface AppSidebarProps {
  user: User;
}

export async function AppSidebar({ user }: AppSidebarProps) {
  const userId = user.id;
  const friendships = await prisma.friendship.findMany({
    where: {
      OR: [{ recipientId: userId }, { senderId: userId }],
      status: "ACCEPTED",
    },
    include: {
      recipient: true,
      sender: true,
    },
  });

  const friends = friendships.map((friendship) => {
    const friend =
      friendship.recipientId === userId
        ? friendship.sender
        : friendship.recipient;
    return { ...friend, friendshipId: friendship.id };
  });

  return (
    <Sidebar
      collapsible="none"
      className="shrink-0 grow-0 w-sm border-r-sidebar-border border-r h-screen max-md:hidden"
    >
      <SidebarHeader className="flex-0">
        <SidebarHeaderButtons />
      </SidebarHeader>
      <Separator />
      <SidebarContent className="flex-1 p-2 flex flex-col gap-2">
        <SidebarFriendButtons user={user} friends={friends} />
      </SidebarContent>
      <SidebarFooter className="flex-0 bottom-0">
        <SidebarFooterButtons user={user} />
      </SidebarFooter>
    </Sidebar>
  );
}
