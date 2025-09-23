import React, { useContext, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { PostContext } from '../context/Provider';
import PostCard from '../components/ui/PostCard';
import SectionHeading from '../components/ui/SectionHeading';

function HomePage() {
  const { state, deletePost, fetchPosts } = useContext(PostContext);
  const navigate = useNavigate();
  
  useEffect(() => {
    if (state.posts.length === 0 && !state.loading) {
      fetchPosts();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleEditPost = (post) => {
    navigate(`/edit/${post.documentId}`);
  };

const handleDeletePost = async (documentId) => {
  if (window.confirm('Are you sure you want to delete this post?')) {
    try {
      await deletePost(documentId);  // ✅ Use the parameter
      await fetchPosts();
      // Remove navigate('/') since we're already on the home page
    } catch (error) {
      alert('Failed to delete post. Please try again.');
      console.error('Error deleting post:', error);
    }
  }
};

  // Updated loading skeleton without image
  const LoadingSkeleton = () => (
    <div className="bg-white rounded-lg shadow-sm border border-gray-100 overflow-hidden animate-pulse">
      <div className="p-6">
        <div className="h-4 bg-gray-200 rounded w-1/3 mb-4"></div>
        <div className="h-6 bg-gray-300 rounded mb-3"></div>
        <div className="h-4 bg-gray-200 rounded mb-4"></div>
        <div className="h-4 bg-gray-200 rounded w-2/3 mb-6"></div>
        <div className="flex justify-between items-center">
          <div className="h-4 bg-gray-200 rounded w-20"></div>
          <div className="h-6 bg-gray-200 rounded-full w-16"></div>
        </div>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      {/* Hero Section */}
      <div className="relative overflow-hidden bg-white border-b border-gray-200">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="text-center">
            <p className="text-green-600 font-medium mb-4">Our blog</p>
            <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
              The Untitled UI <span className="italic font-light">journal</span>
            </h1>
            <p className="text-lg md:text-xl text-gray-600 max-w-3xl mx-auto mb-8">
              Insights, stories, and perspectives from our team. Subscribe for new posts in your inbox.
            </p>
          
          </div>
        </div>
      </div>

      {/* All Blog Posts Section */}
      <div className="py-16">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <SectionHeading>Latest Articles</SectionHeading>
            <p className="text-gray-600 mt-4">Discover our latest thoughts and insights</p>
          </div>

          {state.loading ? (
            <div className="grid md:grid-cols-2 gap-6">
              {[...Array(4)].map((_, index) => (
                <LoadingSkeleton key={index} />
              ))}
            </div>
          ) : (
            <>
              <div className="grid gap-6">
                {state.posts.map((post) => (
                  <PostCard
                    key={post.documentId}
                    post={post}
                    showActions={true}
                    onEdit={() => handleEditPost(post)}
                    onDelete={() => handleDeletePost(post.documentId)}
                  />
                ))}
              </div>

              {state.posts.length === 0 && !state.loading && (
                <div className="text-center py-16">
                  <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-12">
                    <div className="text-6xl mb-4">📝</div>
                    <h3 className="text-xl font-semibold text-gray-900 mb-2">No posts yet</h3>
                    <p className="text-gray-600 mb-6">Be the first to share your thoughts and insights.</p>
                    <button 
                      onClick={() => navigate('/edit/new')}
                      className="bg-green-600 text-white px-6 py-3 rounded-lg hover:bg-green-700 transition-colors"
                    >
                      Create Your First Post
                    </button>
                  </div>
                </div>
              )}
            </>
          )}

          {/* Simple Pagination */}
          {state.posts.length > 6 && (
            <div className="flex justify-center mt-12">
              <div className="flex items-center space-x-2 bg-white rounded-lg shadow-sm border border-gray-200 p-2">
                <button className="p-2 rounded hover:bg-gray-100 transition-colors">
                  <ChevronLeft className="w-5 h-5" />
                </button>
                <button className="px-3 py-2 rounded bg-green-600 text-white">
                  1
                </button>
                <button className="px-3 py-2 rounded text-gray-700 hover:bg-gray-100 transition-colors">
                  2
                </button>
                <button className="px-3 py-2 rounded text-gray-700 hover:bg-gray-100 transition-colors">
                  3
                </button>
                <span className="px-2 text-gray-500">...</span>
                <button className="px-3 py-2 rounded text-gray-700 hover:bg-gray-100 transition-colors">
                  10
                </button>
                <button className="p-2 rounded hover:bg-gray-100 transition-colors">
                  <ChevronRight className="w-5 h-5" />
                </button>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* CTA Section */}
      <div className="bg-white border-t border-gray-200 py-12">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Ready to share your story?</h2>
          <p className="text-gray-600 mb-6">Join our community of writers and start publishing today.</p>
          <button 
            onClick={() => navigate('/edit/new')}
            className="bg-green-600 text-white px-8 py-3 rounded-lg hover:bg-green-700 transition-colors"
          >
            Write a Post
          </button>
        </div>
      </div>
    </div>
  );
}

export default HomePage;