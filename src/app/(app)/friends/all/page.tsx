import {
  Card,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { prisma } from "@/lib/db";
import { getServerSession } from "@/lib/get-server-session";
import { Friends } from "./_components/friends";

export default async function FriendsAllPage() {
  const session = await getServerSession();

  if (!session) {
    return <div>Not logged in</div>;
  }

  const userId = session.user.id;
  const friendships = await prisma.friendship.findMany({
    where: {
      OR: [{ addresseeId: userId }, { requesterId: userId }],
      status: "ACCEPTED",
    },
    include: {
      addressee: true,
      requester: true,
    },
  });

  return <Friends userId={userId} friendships={friendships} />;
}
