import { prisma } from "@/lib/prisma";
import { AiOutlineMessage } from "react-icons/ai";
import { PostCard } from "@/app/components/posts/PostCard";
import { getSession } from "@/app/actions/auth";
import { getUserInfo } from "@/app/actions/user";

async function getPublicPosts(userProfileId?: string) {
  try {
    const posts = await prisma.post.findMany({
      where: { visibility: "public" },
      orderBy: { date_posted: "desc" },
      include: {
        author: {
          select: {
            user_profile_id: true,
            full_name: true,
            username: true,
            avatar_pic: true,
          },
        },
        likes: true,
        comments: {
          orderBy: { created_at: "asc" },
          include: {
            user_profile: {
              select: { full_name: true, username: true, avatar_pic: true },
            },
          },
        },
      },
    });

    return posts.map((post) => ({
      ...post,
      likeCount: post.likes.length,
      commentCount: post.comments.length,
      isLiked: userProfileId
        ? post.likes.some((l) => l.user_profile_id === userProfileId)
        : false,
      initialComments: post.comments,
    }));

  } catch (err) {
    console.error("Failed to fetch posts:", err);
    return [];
  }
}

const PostsPage = async () => {
  const session = await getSession();
  const userInfo = session ? await getUserInfo(session.username) : null;
  const posts = await getPublicPosts(userInfo?.user_profile_id);

  return (
    <div
      className="min-h-screen"
      style={{ background: "linear-gradient(135deg, #050a05 0%, #0a140a 50%, #050a05 100%)" }}
    >
      <div className="fixed inset-0 pointer-events-none opacity-[0.03]"
        style={{
          backgroundImage: "linear-gradient(#22c55e 1px,transparent 1px),linear-gradient(90deg,#22c55e 1px,transparent 1px)",
          backgroundSize: "40px 40px",
        }}
      />

      <div className="relative z-10 max-w-[680px] mx-auto px-4 py-10">
        <div className="mb-8">
          <h1 className="text-3xl font-black text-white">Community Feed</h1>
          <p className="text-sm mt-1" style={{ color: "#4b5563" }}>
            {posts.length} public post{posts.length !== 1 ? "s" : ""} from the community
          </p>
        </div>

        {posts.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-24 rounded-2xl"
            style={{ border: "2px dashed #1a2e1a" }}>
            <AiOutlineMessage size={32} style={{ color: "#1a2e1a" }} />
            <p className="font-bold text-white mt-4">No posts yet</p>
            <p className="text-xs mt-1" style={{ color: "#4b5563" }}>
              Be the first to share something with the community.
            </p>
          </div>
        ) : (
          <div className="flex flex-col gap-5">
            {posts.map((post) => (
              <PostCard
                key={post.post_id}
                post={post}
                initialLikeCount={post.likeCount}
                initialCommentCount={post.commentCount}
                initialIsLiked={post.isLiked}
                initialComments={post.initialComments}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default PostsPage;