const REACT_APP_BASE_URL = 'http://localhost:1337/api';

// Generic fetch wrapper with error handling
const apiRequest = async (url, options = {}) => {
  const config = {
    headers: {
      'Content-Type': 'application/json',
      ...options.headers,
    },
    ...options,
  };

  try {
    const response = await fetch(`${REACT_APP_BASE_URL}${url}`, config);
    
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    
    const contentType = response.headers.get('content-type');
    if (contentType && contentType.includes('application/json')) {
      const data = await response.json();
      return data;
    } else {
      return null;
    }
  } catch (error) {
    console.error(`API request failed for ${url}:`, error);
    throw error;
  }
};

// Posts API
export const postsAPI = {
  // Get all posts with optional search query
 getAll: async (searchQuery = '') => {
  try {
    const queryParam = searchQuery ? 
      `filters[Title][$containsi]=${encodeURIComponent(searchQuery)}` : '';
    const populate = 'populate=*';
    const separator = queryParam ? '&' : '';
    const url = `/posts?${queryParam}${separator}${populate}`;
    
    const data = await apiRequest(url);
    return data.data;
  } catch (error) {
    console.error('Error fetching posts:', error);
    throw error;
  }
},

  // Get single post by ID
  getById: async (id) => {
    try {
      const data = await apiRequest(`/posts/${id}?populate=*`);
      return data.data;
    } catch (error) {
      console.error('Error fetching post:', error);
      throw error;
    }
  },

  // Get single post by slug
  getBySlug: async (slug) => {
    try {
      const data = await apiRequest(`/posts?filters[slug][$eq]=${slug}&populate=*`);
      return data.data[0]; // Strapi returns array, we want first match
    } catch (error) {
      console.error('Error fetching post by slug:', error);
      throw error;
    }
  },

  // Create new post
  // postsAPI.js - Fix the create function
create: async (postData) => {
  const strapiData = {
    data: {
      Title: postData.title,
      Content: postData.content,
      PostStatus: postData.status || 'Draft',
      slug: postData.slug || postData.title.toLowerCase().replace(/\s+/g, '-').replace(/[^\w-]/g, ''),
      Author: postData.author || 'Admin',
    }
  };

  const data = await apiRequest('/posts', {
    method: 'POST',
    body: JSON.stringify(strapiData),
  });
  return data.data;
},


  // Update existing post by ID
  update: async (id, postData) => {
    try {
      const strapiData = {
        data: {
          Title: postData.title,
          Content: postData.content,
          PostStatus: postData.status || 'Draft',
          slug: postData.slug || postData.title.toLowerCase().replace(/\s+/g, '-').replace(/[^\w-]/g, ''),
          // Add other fields as needed
        }
      };

      const data = await apiRequest(`/posts/${id}`, {
        method: 'PUT',
        body: JSON.stringify(strapiData),
      });
      return data.data;
    } catch (error) {
      console.error('Error updating post:', error);
      throw error;
    }
  },

  // Update existing post by documentId (Strapi v5)
  updateByDocumentId: async (documentId, postData) => {
    try {
      const strapiData = {
        data: {
          Title: postData.title,
          Content: postData.content,
          PostStatus: postData.status || 'Draft',
          slug: postData.slug || postData.title.toLowerCase().replace(/\s+/g, '-').replace(/[^\w-]/g, ''),
        }
      };

      const data = await apiRequest(`/posts/${documentId}`, {
        method: 'PUT',
        body: JSON.stringify(strapiData),
      });
      return data.data;
    } catch (error) {
      console.error('Error updating post by documentId:', error);
      throw error;
    }
  },

  // Delete post by ID
  delete: async (id) => {
    try {
      const data = await apiRequest(`/posts/${id}`, {
        method: 'DELETE',
      });
      return data.data;
    } catch (error) {
      console.error('Error deleting post:', error);
      throw error;
    }
  },

  // Delete post by documentId (Strapi v5)
  deleteByDocumentId: async (documentId) => {
  try {
    const response = await apiRequest(`/posts/${documentId}`, {
      method: 'DELETE',
    });
    // Strapi DELETE requests often return null or a simple success message
    // Just return the documentId to confirm deletion
    return documentId;
  } catch (error) {
    console.error('Error deleting post by documentId:', error);
    throw error;
  }
},

  // Publish post
  publish: async (id) => {
    try {
      const data = await apiRequest(`/posts/${id}`, {
        method: 'PUT',
        body: JSON.stringify({
          data: {
            PostStatus: 'Published',
            publishedAt: new Date().toISOString(),
          }
        }),
      });
      return data.data;
    } catch (error) {
      console.error('Error publishing post:', error);
      throw error;
    }
  },

  // Unpublish post
  unpublish: async (id) => {
    try {
      const data = await apiRequest(`/posts/${id}`, {
        method: 'PUT',
        body: JSON.stringify({
          data: {
            PostStatus: 'Draft',
            publishedAt: null,
          }
        }),
      });
      return data.data;
    } catch (error) {
      console.error('Error unpublishing post:', error);
      throw error;
    }
  },
};

// Health check
export const healthCheck = async () => {
  try {
    const data = await apiRequest('/health');
    return data;
  } catch (error) {
    console.error('Health check failed:', error);
    throw error;
  }
};

export default postsAPI;