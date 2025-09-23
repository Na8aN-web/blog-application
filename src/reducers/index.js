// Post reducer
export function postReducer(state, action) {
  switch (action.type) {
    case 'SET_POSTS':
      return { ...state, posts: action.payload };

    case 'SET_CURRENT_POST':
      return { ...state, currentPost: action.payload };

    case 'SET_LOADING':
      return { ...state, loading: action.payload };

    case 'SET_ERROR':
      return { ...state, error: action.payload, loading: false };

    case 'CLEAR_ERROR':
      return { ...state, error: null };

    // CRUD Actions
    case 'ADD_POST':
      return {
        ...state,
        posts: [action.payload, ...state.posts],
        loading: false
      };

    case 'UPDATE_POST':
      return {
        ...state,
        posts: state.posts.map(post =>
          post.id === action.payload.id ? action.payload : post
        ),
        currentPost: state.currentPost?.id === action.payload.id ? action.payload : state.currentPost,
        loading: false
      };


    case 'DELETE_POST':
      return {
        ...state,
        posts: state.posts.filter(post =>
          post.documentId !== action.payload && post.id !== action.payload
        )
      };

    case 'RESET_STATE':
      return {
        posts: [],
        currentPost: null,
        loading: false,
        error: null
      };

    default:
      return state;
  }
}

// Search reducer
export function searchReducer(state, action) {
  switch (action.type) {
    case 'SET_QUERY':
      return { ...state, query: action.payload };

    case 'SET_RESULTS':
      return { ...state, results: action.payload };

    case 'SET_LOADING':
      return { ...state, loading: action.payload };

    case 'SET_ERROR':
      return { ...state, error: action.payload, loading: false };

    case 'CLEAR_RESULTS':
      return { ...state, results: [], query: '' };

    case 'CLEAR_ERROR':
      return { ...state, error: null };

    default:
      return state;
  }
}