import React, { useContext, useEffect, useState } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import { PostContext } from '../context/Provider';
import PostList from '../components/PostList';
import SearchBar from '../components/ui/SearchBar';
import EmptyState from '../components/ui/EmptyState.';

function SearchResultsPage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const { state } = useContext(PostContext);
  const [searchResults, setSearchResults] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  
  const query = searchParams.get('q') || '';

  useEffect(() => {
    if (query) {
      setIsLoading(true);
      // Simulate search delay
      const timer = setTimeout(() => {
        const results = state.posts.filter(post =>
          post.title.toLowerCase().includes(query.toLowerCase()) ||
          post.excerpt.toLowerCase().includes(query.toLowerCase()) ||
          post.tags.some(tag => tag.toLowerCase().includes(query.toLowerCase())) ||
          post.author.toLowerCase().includes(query.toLowerCase())
        );
        setSearchResults(results);
        setIsLoading(false);
      }, 300);

      return () => clearTimeout(timer);
    } else {
      setSearchResults([]);
    }
  }, [query, state.posts]);

  const handleSearch = (newQuery) => {
    if (newQuery.trim()) {
      setSearchParams({ q: newQuery.trim() });
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Header */}
        <div className="mb-8">
          <Link 
            to="/" 
            className="inline-flex items-center text-green-600 hover:text-green-700 mb-6"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to home
          </Link>
          
          <h1 className="text-3xl font-bold text-gray-900 mb-6">
            Search Results
          </h1>
          
          {/* Search bar */}
          <div className="mb-6">
            <SearchBar onSearch={handleSearch} />
          </div>
        </div>

        {/* Results */}
        <div className="bg-white rounded-lg shadow-sm p-6">
          {query && (
            <div className="mb-6">
              <p className="text-gray-600">
                {isLoading ? (
                  'Searching...'
                ) : (
                  <>
                    {searchResults.length} result{searchResults.length !== 1 ? 's' : ''} for{' '}
                    <span className="font-semibold">"{query}"</span>
                  </>
                )}
              </p>
            </div>
          )}

          {isLoading ? (
            <div className="flex justify-center py-12">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-green-600"></div>
            </div>
          ) : searchResults.length > 0 ? (
            <PostList posts={searchResults} />
          ) : query ? (
            <EmptyState message={`No posts found matching "${query}". Try different keywords.`} />
          ) : (
            <EmptyState message="Enter a search term to find posts." />
          )}
        </div>
      </div>
    </div>
  );
}

export default SearchResultsPage;