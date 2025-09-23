import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { PostProvider, SearchProvider } from './context/Provider';
import Layout from './components/layout/Layout';
import HomePage from './pages/HomePage';
import PostDetailPage from './pages/PostDetailPage';
import PostEditorPage from './pages/PostEditorPage';
import SearchResultsPage from './pages/SearchResultsPage';

function App() {
  return (
    <Router>
      <PostProvider>
        <SearchProvider>
          <Layout>
            <Routes>
              <Route path="/" element={<HomePage />} />
              <Route path="/posts/:slug" element={<PostDetailPage />} />
              <Route path="/create" element={<PostEditorPage />} />
              <Route path="/edit/:id" element={<PostEditorPage />} />
              <Route path="/search" element={<SearchResultsPage />} />
            </Routes>
          </Layout>
        </SearchProvider>
      </PostProvider>
    </Router>
  );
}

export default App;