"use client";

import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export interface FriendsMenuButtonProps
  extends React.ComponentProps<typeof Button> {
  isActive: boolean;
}

export function FriendsMenuButton({
  className,
  isActive,
  ...props
}: FriendsMenuButtonProps) {
  return (
    <Button
      variant="ghost"
      size="sm"
      className={cn(isActive && "bg-accent dark:hover:bg-accent", className)}
      {...props}
    />
  );
}
