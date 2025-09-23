// PostEditorPage.jsx
import React, { useState, useContext, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { ArrowLeft, Save, Eye, Trash2 } from 'lucide-react';
import { PostContext } from '../context/Provider';
import PostForm from '../components/PostForm';

function PostEditorPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { state, createPost, updatePost, deletePost } = useContext(PostContext);
  const [isEditing, setIsEditing] = useState(id && id !== 'new'); // Fixed this line
   const [isLoading, setIsLoading] = useState(true);
  const [currentPost, setCurrentPost] = useState({
    title: '',
    content: '',
    author: '',
    status: 'Draft'
  });

 useEffect(() => {
    if (id && id !== 'new') {
      if (state.posts.length > 0) {
        const post = state.posts.find(p => p.documentId === id || p.id === id);
        if (post) {
          setCurrentPost(post);
        }
        setIsLoading(false);
      }
      // Wait for posts to load if array is empty
    } else {
      setCurrentPost({
        title: '',
        content: '',
        author: '',
        status: 'Draft'
      });
      setIsLoading(false);
    }
  }, [id, state.posts]);

  if (isLoading || (id && id !== 'new' && !currentPost)) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-lg">Loading post...</div>
      </div>
    );
  }

  const handleSave = async (formData) => {
    try {
      if (isEditing && id !== 'new') {
        await updatePost(id, formData);
        // Force refresh posts after update
        // You'll need to add fetchPosts to your context or call it here
      } else {
        await createPost(formData);
      }
      navigate('/');
    } catch (error) {
      alert('Failed to save post. Please try again.');
      console.error('Error saving post:', error);
    }
  };

  const handleDelete = async () => {
    if (window.confirm('Are you sure you want to delete this post?')) {
      try {
        await deletePost(id);
        navigate('/');
      } catch (error) {
        alert('Failed to delete post. Please try again.');
        console.error('Error deleting post:', error);
      }
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <Link 
            to="/" 
            className="inline-flex items-center text-green-600 hover:text-green-700"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to posts
          </Link>
        </div>

        {/* Page title */}
        <h1 className="text-3xl font-bold text-gray-900 mb-8">
          {isEditing && id !== 'new' ? 'Edit Post' : 'Create New Post'}
        </h1>

        {/* Post form */}
        <div className="bg-white rounded-lg shadow-sm">
          <PostForm 
            initialData={currentPost}
            onSave={handleSave}
            onCancel={() => navigate('/')}
          />
        </div>
      </div>
    </div>
  );
}

export default PostEditorPage;