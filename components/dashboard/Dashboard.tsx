import { useState, useEffect } from "react";
import Link from "next/link";
import CreatePost from "../posts/CreatePost";
import { User, Subreddit, Post } from "../types";

type Vote = -1 | 1;

export default function Dashboard({ user, onLogout }: { user: User; onLogout: () => void }) {
  const [subreddits, setSubreddits] = useState<Subreddit[]>([]);
  const [myIds, setMyIds] = useState<string[]>([]);
  const [posts, setPosts] = useState<Post[]>([]);
  const [selected, setSelected] = useState<string | null>(null);
  const [sort, setSort] = useState<'recent' | 'popular'>('recent');

  const fetchSubreddits = async () => {
    const res = await fetch("/api/reddit/subreddits");
    const data = await res.json();
    setSubreddits(data.subreddits || []);
  };

  const fetchMembership = async () => {
    const res = await fetch(`/api/reddit/membership/${user.user_id}`);
    const data = await res.json();
    setMyIds(data.subredditIds || []);
  };

  const fetchPosts = async (subredditId?: string | null) => {
    if (subredditId) {
      const res = await fetch(`/api/reddit/subreddits/${subredditId}?sort=${sort}`);
      const data = await res.json();
      setPosts(data.posts || []);
    } else {
      const res = await fetch(`/api/reddit/feed/${user.user_id}?sort=${sort}`);
      const data = await res.json();
      setPosts(data.posts || []);
    }
  };

  useEffect(() => {
    fetchSubreddits();
    fetchMembership();
  }, []);

  useEffect(() => {
    fetchPosts(selected);
  }, [sort]);

  const mySubs = subreddits.filter((s) => myIds.includes(s.subreddit_id));
  const otherSubs = subreddits.filter((s) => !myIds.includes(s.subreddit_id));

  const handleJoin = async (subId: string) => {
    await fetch(`/api/reddit/subreddits/${subId}/join`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ user_id: user.user_id }),
    });
    fetchMembership();
  };

  const refreshPosts = () => fetchPosts(selected);

  const votePost = async (postId: string, vote: Vote | 0) => {
    const res = await fetch(`/api/reddit/posts/${postId}/vote`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ user_id: user.user_id, vote_type: vote }),
    });
    const data = await res.json();
    setPosts((prev) => prev.map((p) => (p.post_id === postId ? { ...p, score: data.score } : p)));
  };

  return (
    <div className="p-6 overflow-y-auto">
      <div className="flex items-center mb-4 space-x-4">
        <h2 className="text-xl">{selected ? `r/${subreddits.find(s=>s.subreddit_id===selected)?.subreddit_name}` : 'Your Feed'}</h2>
        <div className="text-sm space-x-2">
          <button className={sort==='recent'? 'underline':''} onClick={()=>setSort('recent')}>Recent</button>
          <button className={sort==='popular'? 'underline':''} onClick={()=>setSort('popular')}>Popular</button>
        </div>
      </div>

      {selected && (
        <CreatePost subredditId={selected} userId={user.user_id} onSuccess={refreshPosts} />
      )}

      {/* Post list */}
      {posts.length === 0 ? (
        <p>No posts yet.</p>
      ) : (
        posts.map((p) => (
          <div key={p.post_id} className="border p-4 mb-4">
            <Link href={`/post/${p.post_id}`} className="text-lg font-semibold mb-1 block hover:underline">
              {p.title}
            </Link>
            <p className="mb-2">{p.content}</p>
            <p className="text-xs text-gray-600">r/{p.subreddit_name} • {p.username}</p>
            <div className="flex items-center mt-1 space-x-1 text-sm">
              <button onClick={() => votePost(p.post_id, 1)} className="px-1">⬆️</button>
              <span>{p.score ?? 0}</span>
              <button onClick={() => votePost(p.post_id, -1)} className="px-1">⬇️</button>
            </div>
          </div>
        ))
      )}
    </div>
  );
} 