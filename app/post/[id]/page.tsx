import { Comment, Post } from "@/components/types";
import { getUser } from "@/lib/auth";
import PostClient from "@/components/posts/PostClient";

interface PostPageProps {
  params: { id: string };
}

export default async function PostPage({ params }: PostPageProps) {
  const { id } = params;
  const user = await getUser();

  let post: Post | null = null;
  let comments: Comment[] = [];
  let error: string | null = null;

  try {
    const res = await fetch(
      `${
        process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000"
      }/api/reddit/posts/${id}`
    );
    if (!res.ok) {
      const e = await res.json();
      throw new Error(e.error || "Failed to fetch");
    }
    const data = await res.json();
    post = data.post;
    comments = data.comments || [];
  } catch (err: any) {
    error = err.message;
  }

  if (error) return <div className="p-8">{error}</div>;
  if (!post) return <div className="p-8">Loading...</div>;

  return <PostClient post={post} initialComments={comments} user={user} />;
}
