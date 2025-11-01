"use client";

import { Card, CardDescription, CardTitle } from "@/components/ui/card";
import { SidebarMenuButton } from "@/components/ui/sidebar";
import { socket } from "@/lib/socket";
import { UserWithFriendshipId } from "@/types/db-model-types";
import { User } from "@prisma/client";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { toast } from "sonner";

export interface SidebarFriendButtonsProps {
  user: User;
  friends: UserWithFriendshipId[];
}

export function SidebarFriendButtons({
  user,
  friends,
}: SidebarFriendButtonsProps) {
  const pathname = usePathname();
  const router = useRouter();
  const [friendList, setFriendList] = useState<UserWithFriendshipId[]>(friends);

  useEffect(() => {
    setFriendList(friends);
  }, [friends]);

  useEffect(() => {
    socket.on("friendAdded", (friend, friendshipId) => {
      setFriendList((prev) => [...prev, { ...friend, friendshipId }]);
    });

    socket.on("friendRemoved", (friendId) => {
      setFriendList((prev) => prev.filter((friend) => friend.id !== friendId));
      if (pathname.startsWith(`/${friendId}`)) {
        toast.error("Friend you were chatting with unfriended you");
        router.push("/");
      }
    });

    return () => {
      socket.off("friendAdded");
      socket.off("friendRemoved");
    };
  }, []);

  return friendList.map((friend) => (
    <SidebarMenuButton
      key={friend.id}
      isActive={pathname.startsWith(`/messages/${friend.friendshipId}`)}
      className="h-fit flex flex-col items-start justify-center gap-0 data-[active=true]:font-normal"
      asChild
    >
      <Link href={`/messages/${friend.friendshipId}`}>
        <CardTitle className="leading-5">{friend.name}</CardTitle>
        <CardDescription>{friend.email}</CardDescription>
      </Link>
    </SidebarMenuButton>
  ));
}
