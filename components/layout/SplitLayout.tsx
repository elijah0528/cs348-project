"use client";

import { useState, createContext, useContext } from "react";
import { User } from "@/components/types";
import PostSidebar from "@/components/posts/PostSidebar";

interface SplitLayoutContextType {
  openPost: (postId: string) => void;
  closePost: () => void;
  selectedPostId: string | null;
  refreshSidebar?: () => void;
}

const SplitLayoutContext = createContext<SplitLayoutContextType | null>(null);

export function useSplitLayout() {
  const context = useContext(SplitLayoutContext);
  if (!context) {
    throw new Error("useSplitLayout must be used within SplitLayoutProvider");
  }
  return context;
}

interface SplitLayoutProviderProps {
  children: React.ReactNode;
  user: User | null;
  refreshSidebar?: () => void;
}

export default function SplitLayoutProvider({ children, user, refreshSidebar }: SplitLayoutProviderProps) {
  const [selectedPostId, setSelectedPostId] = useState<string | null>(null);

  const openPost = (postId: string) => {
    setSelectedPostId(postId);
  };

  const closePost = () => {
    setSelectedPostId(null);
  };

  return (
    <SplitLayoutContext.Provider value={{ openPost, closePost, selectedPostId, refreshSidebar }}>
      <div className="flex h-full">
        <div className={`${selectedPostId ? "w-1/2" : "w-full"} transition-all duration-300 overflow-y-auto`}>
          {children}
        </div>
        {selectedPostId && (
          <PostSidebar
            postId={selectedPostId}
            user={user}
            onClose={closePost}
          />
        )}
      </div>
    </SplitLayoutContext.Provider>
  );
}
