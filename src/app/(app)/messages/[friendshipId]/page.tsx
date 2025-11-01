import { prisma } from "@/lib/db";
import { getServerSession } from "@/lib/get-server-session";
import { MessagesPanel } from "./_components/messages-panel";

export default async function Page({
  params,
}: {
  params: Promise<{ friendshipId: string }>;
}) {
  const session = await getServerSession();

  if (!session) {
    return null;
  }

  const userId = session.user.id;
  const { friendshipId } = await params;

  const messages = await prisma.message.findMany({
    where: {
      friendshipId: friendshipId,
    },
    orderBy: {
      createdAt: "asc",
    },
    take: 100,
  });

  return (
    <MessagesPanel
      userId={userId}
      friendshipId={friendshipId}
      messages={messages}
    />
  );
}
