import React, { useState, useContext, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { ArrowLeft, Calendar, User, Edit, Trash2, Eye } from 'lucide-react';
import { PostContext } from '../context/Provider';

function PostDetailPage() {
  const { slug } = useParams();
  const navigate = useNavigate();
  const { state, fetchPostBySlug, deletePost } = useContext(PostContext);
  const [post, setPost] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const loadPost = async () => {
      if (!slug) {
        setError('No slug provided');
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        setError(null);
        const fetchedPost = await fetchPostBySlug(slug);
        setPost(fetchedPost);
      } catch (err) {
        console.error('Error loading post:', err);
        setError('Post not found');
      } finally {
        setLoading(false);
      }
    };

    loadPost();
  }, [slug, fetchPostBySlug]);

  const handleEdit = () => {
    navigate(`/edit/${post.documentId}`);
  };

  const handleDelete = async () => {
    if (window.confirm(`Are you sure you want to delete "${post.title}"?`)) {
      try {
        await deletePost(post.documentId);
        navigate('/');
      } catch (error) {
        alert('Failed to delete post. Please try again.');
      }
    }
  };

  const renderContent = (content) => {
    if (!content) {
      return (
        <div className="prose prose-lg max-w-none">
          <p className="text-gray-600 italic">No content available.</p>
        </div>
      );
    }
    
    // Handle plain text content
    if (typeof content === 'string') {
      // Split by line breaks and create paragraphs
      const paragraphs = content.split('\n').filter(p => p.trim());
      return (
        <div className="prose prose-lg max-w-none">
          {paragraphs.length > 0 ? (
            paragraphs.map((paragraph, index) => (
              <p key={index} className="mb-6 text-gray-700 leading-relaxed">
                {paragraph.trim()}
              </p>
            ))
          ) : (
            <p className="text-gray-600 italic">No content available.</p>
          )}
        </div>
      );
    }
    
    // Fallback for array format (in case some old data exists)
    if (Array.isArray(content)) {
      return (
        <div className="prose prose-lg max-w-none">
          {content.map((block, index) => {
            if (block.type === 'paragraph' && block.children) {
              const text = block.children.map(child => child.text || '').join('');
              return (
                <p key={index} className="mb-6 text-gray-700 leading-relaxed">
                  {text}
                </p>
              );
            }
            
            if (block.type === 'heading' && block.children) {
              const text = block.children.map(child => child.text || '').join('');
              const HeadingTag = `h${block.level || 2}`;
              return React.createElement(
                HeadingTag,
                { 
                  key: index, 
                  className: "text-2xl font-bold text-gray-900 mb-4 mt-8" 
                },
                text
              );
            }
            
            return null;
          })}
        </div>
      );
    }

    return (
      <div className="prose prose-lg max-w-none">
        <p className="text-gray-600 italic">No content available.</p>
      </div>
    );
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 py-8">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Loading skeleton */}
          <div className="animate-pulse">
            <div className="h-8 bg-gray-300 rounded w-24 mb-8"></div>
            <div className="h-8 bg-gray-300 rounded mb-6"></div>
            <div className="flex items-center mb-8">
              <div className="h-4 bg-gray-300 rounded w-32 mr-4"></div>
              <div className="h-4 bg-gray-300 rounded w-24"></div>
            </div>
            <div className="space-y-4">
              <div className="h-4 bg-gray-300 rounded"></div>
              <div className="h-4 bg-gray-300 rounded"></div>
              <div className="h-4 bg-gray-300 rounded w-3/4"></div>
              <div className="h-4 bg-gray-300 rounded w-1/2"></div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 py-8">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center py-12">
            <h1 className="text-2xl font-bold text-gray-900 mb-4">Post Not Found</h1>
            <p className="text-gray-600 mb-8">The post you're looking for doesn't exist.</p>
            <Link
              to="/"
              className="inline-flex items-center px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Home
            </Link>
          </div>
        </div>
      </div>
    );
  }

  if (!post) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Back Button */}
        <div className="mb-8">
          <Link
            to="/"
            className="inline-flex items-center text-green-600 hover:text-green-700 transition-colors"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to posts
          </Link>
        </div>

        {/* Article */}
        <article className="bg-white rounded-lg shadow-sm overflow-hidden">
          {/* Article Header */}
          <div className="px-8 py-8">
            <div className="flex items-start justify-between mb-6">
              <div className="flex-1">
                {/* Status Badge */}
                <div className="mb-4">
                  <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${
                    post.status === 'Published' 
                      ? 'bg-green-100 text-green-800' 
                      : 'bg-yellow-100 text-yellow-800'
                  }`}>
                    <Eye className="w-3 h-3 mr-1" />
                    {post.status}
                  </span>
                </div>

                {/* Title */}
                <h1 className="text-4xl font-bold text-gray-900 mb-6">
                  {post.title}
                </h1>

                {/* Meta Information */}
                <div className="flex items-center text-sm text-gray-500 mb-8">
                  <User className="w-4 h-4 mr-2" />
                  <span className="mr-4">{post.author || 'Unknown Author'}</span>
                  <Calendar className="w-4 h-4 mr-2" />
                  <span>{post.date}</span>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex space-x-2 ml-6">
                <button
                  onClick={handleEdit}
                  className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                >
                  <Edit className="w-4 h-4 mr-2" />
                  Edit
                </button>
                <button
                  onClick={handleDelete}
                  className="flex items-center px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
                >
                  <Trash2 className="w-4 h-4 mr-2" />
                  Delete
                </button>
              </div>
            </div>

            {/* Article Content */}
            <div className="border-t border-gray-200 pt-8">
              {renderContent(post.content)}
            </div>
          </div>

          {/* Article Footer */}
          <div className="px-8 py-6 bg-gray-50 border-t border-gray-200">
            <div className="flex items-center justify-between">
              <div className="text-sm text-gray-500">
                Published: {post.date}
              </div>
              <div className="flex items-center space-x-4">
                <button
                  onClick={handleEdit}
                  className="text-sm text-blue-600 hover:text-blue-700 transition-colors"
                >
                  Edit this post
                </button>
                <Link
                  to="/"
                  className="text-sm text-green-600 hover:text-green-700 transition-colors"
                >
                  View all posts
                </Link>
              </div>
            </div>
          </div>
        </article>

        {/* Navigation */}
        <div className="mt-12">
          <div className="flex justify-center">
            <Link
              to="/"
              className="inline-flex items-center px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to All Posts
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

export default PostDetailPage;