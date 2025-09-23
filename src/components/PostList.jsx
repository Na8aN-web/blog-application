import React from 'react';
import PostCard from './ui/PostCard';

function PostList({ posts, variant = "grid" }) {
  if (variant === "grid") {
    return (
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
        {posts.map((post) => (
          <PostCard key={post.id} post={post} />
        ))}
      </div>
    );
  }

  // List variant
  return (
    <div className="space-y-6">
      {posts.map((post) => (
        <PostCard key={post.id} post={post} variant="list" />
      ))}
    </div>
  );
}

export default PostList;