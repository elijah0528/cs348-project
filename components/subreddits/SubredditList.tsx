import { Subreddit } from "../types";

type SubredditListTypes = {
  subreddits: Subreddit[];
  userSubreddits: Subreddit[];
  userId: string;
  onDelete: () => void;
};

export default function SubredditList({
  subreddits,
  userSubreddits,
  userId,
  onDelete,
}: SubredditListTypes) {
  
  const handleDeleteSubreddit = async (subredditId: string) => {
    try {
      const response = await fetch(`/api/reddit/subreddits/${subredditId}`, {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ user_id: userId }),
      });
      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || "Subreddit deletion failed");
      }
      onDelete();
    } catch (error: any) {
      console.error(error);
    }
  };

  return (
    <div>
      <div className="mb-8">
        <h2 className="text-xl mb-4">Your Subreddits</h2>
        <div>
            {userSubreddits.map((subreddit) => (
              <div key={subreddit.subreddit_id} className="flex justify-between items-center border p-3 mb-2">
                <div>
                  <h3>r/{subreddit.subreddit_name}</h3>
                </div>
                <button
                  onClick={() => handleDeleteSubreddit(subreddit.subreddit_id)}
                  className="bg-red-500 text-white px-3 py-1 rounded text-sm"
                >
                  Delete
                </button>
              </div>
            ))}
          </div>
      </div>

      <div>
        <h2 className="text-xl mb-4">All Subreddits</h2>
        <div>
            {subreddits.map((subreddit) => (
              <div key={subreddit.subreddit_id} className="border p-3 mb-2">
                <h3>r/{subreddit.subreddit_name}</h3>
                <p className="text-sm text-gray-600">Admin: {subreddit.username}</p>
              </div>
            ))}
          </div>
      </div>
    </div>
  );
} 