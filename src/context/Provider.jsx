// Provider.jsx
import React, { createContext, useReducer, useEffect, useCallback } from 'react';
import { postReducer, searchReducer } from '../reducers';
import { postsAPI } from '../services/postsAPI'; // Import the API service

// Create contexts
export const PostContext = createContext();
export const SearchContext = createContext();

// Post Provider
export function PostProvider({ children }) {
  const [state, dispatch] = useReducer(postReducer, {
    posts: [],
    currentPost: null,
    loading: false,
    error: null
  });

  // Function to transform Strapi data to your frontend format
  const transformStrapiPost = (strapiPost) => {
    return {
      id: strapiPost.id,
      documentId: strapiPost.documentId,
      title: strapiPost.attributes?.Title || strapiPost.Title,
      slug: strapiPost.attributes?.slug || strapiPost.slug,
      content: strapiPost.attributes?.Content || strapiPost.Content,
      author: strapiPost.attributes?.Author || strapiPost.Author || 'Unknown', // 👈 FIXED
      date: new Date(strapiPost.attributes?.publishedAt || strapiPost.publishedAt).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
      }),
      status: strapiPost.attributes?.PostStatus || strapiPost.PostStatus
    };
  };


  // API functions to provide through context
  const fetchPosts = useCallback(async (searchQuery = '') => {
    dispatch({ type: 'SET_LOADING', payload: true });
    try {
      const strapiPosts = await postsAPI.getAll(searchQuery);
      const transformedPosts = strapiPosts.map(transformStrapiPost);
      dispatch({ type: 'SET_POSTS', payload: transformedPosts });
      return transformedPosts;
    } catch (error) {
      dispatch({ type: 'SET_ERROR', payload: error.message });
      throw error;
    } finally {
      dispatch({ type: 'SET_LOADING', payload: false });
    }
  }, []);

  const fetchPostBySlug = useCallback(async (slug) => {
    dispatch({ type: 'SET_LOADING', payload: true });
    try {
      const strapiPost = await postsAPI.getBySlug(slug);
      if (!strapiPost) throw new Error('Post not found');
      const transformedPost = transformStrapiPost(strapiPost);
      dispatch({ type: 'SET_CURRENT_POST', payload: transformedPost });
      return transformedPost;
    } catch (error) {
      dispatch({ type: 'SET_ERROR', payload: error.message });
      throw error;
    } finally {
      dispatch({ type: 'SET_LOADING', payload: false });
    }
  }, []);

  const updatePost = useCallback(async (documentId, postData) => {
  dispatch({ type: 'SET_LOADING', payload: true });
  try {
    const updatedPost = await postsAPI.updateByDocumentId(documentId, postData);
    const transformedPost = transformStrapiPost(updatedPost);
    dispatch({ type: 'UPDATE_POST', payload: transformedPost });
    
    // Refresh the posts list to ensure UI is updated
    await fetchPosts();
    
    return transformedPost;
  } catch (error) {
    dispatch({ type: 'SET_ERROR', payload: error.message });
    throw error;
  } finally {
    dispatch({ type: 'SET_LOADING', payload: false });
  }
}, [fetchPosts]); // Add fetchPosts to dependencies

const createPost = useCallback(async (postData) => {
  dispatch({ type: 'SET_LOADING', payload: true });
  try {
    const newPost = await postsAPI.create(postData);
    const transformedPost = transformStrapiPost(newPost);
    dispatch({ type: 'ADD_POST', payload: transformedPost });
    
    // Refresh the posts list
    await fetchPosts();
    
    return transformedPost;
  } catch (error) {
    dispatch({ type: 'SET_ERROR', payload: error.message });
    throw error;
  } finally {
    dispatch({ type: 'SET_LOADING', payload: false });
  }
}, [fetchPosts]); // Add fetchPosts to dependencies

 const deletePost = useCallback(async (documentId) => {
  dispatch({ type: 'SET_LOADING', payload: true });
  try {
    await postsAPI.deleteByDocumentId(documentId);
    
    // Immediately remove from local state
    dispatch({ type: 'DELETE_POST', payload: documentId });
    
    // Also refresh from server to ensure consistency
    await fetchPosts();
    
  } catch (error) {
    dispatch({ type: 'SET_ERROR', payload: error.message });
    throw error;
  } finally {
    dispatch({ type: 'SET_LOADING', payload: false });
  }
}, [fetchPosts]); 


  // Fetch posts from Strapi on component mount
  useEffect(() => {
    fetchPosts();
  }, [fetchPosts]);

  // Value to provide through context
  const contextValue = {
    state,
    dispatch,
    fetchPosts,
    fetchPostBySlug,
    createPost,
    updatePost,
    deletePost
  };

  return (
    <PostContext.Provider value={contextValue}>
      {children}
    </PostContext.Provider>
  );
}

// Search Provider remains the same...
export function SearchProvider({ children }) {
  const [state, dispatch] = useReducer(searchReducer, {
    query: '',
    results: [],
    loading: false
  });

  return (
    <SearchContext.Provider value={{ state, dispatch }}>
      {children}
    </SearchContext.Provider>
  );
}