import React from 'react';
import { Link } from 'react-router-dom';
import { Calendar, User, Edit, Trash2, Eye } from 'lucide-react';
import IconButtonWithTooltip from './IconButtonWithTooltip';

function PostCard({ post, variant = "default", showActions = false, onEdit, onDelete }) {

  // Handle missing post data
  if (!post) {
    return (
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 animate-pulse">
        <div className="h-4 bg-gray-200 rounded w-1/3 mb-4"></div>
        <div className="h-6 bg-gray-300 rounded mb-3"></div>
        <div className="h-4 bg-gray-200 rounded mb-4"></div>
        <div className="h-4 bg-gray-200 rounded w-2/3 mb-6"></div>
        <div className="flex justify-between items-center">
          <div className="h-4 bg-gray-200 rounded w-20"></div>
          <div className="h-6 bg-gray-200 rounded-full w-16"></div>
        </div>
      </div>
    );
  }

  const cardClasses = variant === "featured" 
    ? "group cursor-pointer bg-white rounded-lg shadow-sm border border-gray-200 hover:shadow-md transition-shadow" 
    : "group cursor-pointer bg-white rounded-lg shadow-sm border border-gray-200 hover:shadow-md transition-shadow";

  const contentClasses = "p-6";

  // Extract excerpt from plain text content
  const getExcerpt = () => {
    if (post.excerpt) return post.excerpt;
    
    if (post.content) {
      // Handle plain text content
      if (typeof post.content === 'string') {
        const text = post.content.trim();
        return text.length > 150 ? text.substring(0, 150) + '...' : text;
      }
      
      // Handle legacy array format (if any old data exists)
      if (Array.isArray(post.content)) {
        const firstParagraph = post.content.find(block => block.type === 'paragraph');
        if (firstParagraph && firstParagraph.children) {
          const text = firstParagraph.children.map(child => child.text || '').join('');
          return text.length > 150 ? text.substring(0, 150) + '...' : text;
        }
      }
    }
    
    return 'No excerpt available.';
  };

  return (
    <article className={cardClasses}>
      <div className={contentClasses}>
        {/* Status Badge */}
        <div className="flex justify-between items-start mb-3">
          <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
            post.status === 'Published' 
              ? 'bg-green-100 text-green-800' 
              : 'bg-yellow-100 text-yellow-800'
          }`}>
            <Eye className="w-3 h-3 mr-1" />
            {post.status || 'Draft'}
          </span>
          
          {/* Action buttons */}
          {showActions && (
            <div className="flex space-x-1 opacity-0 group-hover:opacity-100 transition-opacity">
              {onEdit && (
                <IconButtonWithTooltip
                  icon={Edit}
                  tooltip="Edit post"
                  onClick={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    onEdit(post);
                  }}
                  className="bg-blue-500 hover:bg-blue-600 text-white"
                  size="sm"
                />
              )}
              {onDelete && (
                <IconButtonWithTooltip
                  icon={Trash2}
                  tooltip="Delete post"
                  onClick={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    onDelete(post.documentId);
                  }}
                  className="bg-red-500 hover:bg-red-600 text-white"
                  size="sm"
                />
              )}
            </div>
          )}
        </div>

        {/* Meta Information */}
        <div className="flex items-center text-sm text-gray-500 mb-3">
          <User className="w-4 h-4 mr-2" />
          <span>{post.author || 'Unknown Author'}</span>
          <span className="mx-2">•</span>
          <Calendar className="w-4 h-4 mr-2" />
          <span>{post.date || 'No date'}</span>
        </div>
        
        {/* Title */}
        <h3 className="text-xl font-bold text-gray-900 mb-3 group-hover:text-green-600 transition-colors">
          <Link to={`/posts/${post.slug}`} className="hover:no-underline">
            {post.title || 'Untitled Post'}
          </Link>
        </h3>
        
        {/* Excerpt */}
        <p className="text-gray-600 mb-4 leading-relaxed">
          {getExcerpt()}
        </p>
       
        {/* Read More Link */}
        <div className="flex justify-between items-center">
          <Link 
            to={`/posts/${post.slug}`}
            className="text-green-600 hover:text-green-700 font-medium text-sm transition-colors"
          >
            Read more →
          </Link>
        
        </div>
      </div>
    </article>
  );
}

export default PostCard;