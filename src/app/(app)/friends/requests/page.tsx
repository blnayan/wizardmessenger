import { prisma } from "@/lib/db";
import { getServerSession } from "@/lib/get-server-session";
import { FriendshipRequests } from "./_components/friend-requests";

export default async function FriendsRequestsPage() {
  const session = await getServerSession();

  if (!session) {
    return <div>Not logged in</div>;
  }

  const userId = session.user.id;
  const friendshipRequests = await prisma.friendship.findMany({
    where: {
      recipientId: userId,
      status: "PENDING",
    },
    include: {
      sender: true,
      recipient: true,
    },
  });

  return (
    <FriendshipRequests
      userId={userId}
      friendshipRequests={friendshipRequests}
    />
  );
}
