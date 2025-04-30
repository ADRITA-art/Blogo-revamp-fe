import React from 'react';
import { Link } from 'react-router-dom';
import { Blog } from '../../types';
import { Clock } from 'lucide-react';

interface BlogCardProps {
  blog: Blog;
}

const BlogCard: React.FC<BlogCardProps> = ({ blog }) => {
  // Calculate estimated read time: average reading speed is ~200-250 words per minute
  const calculateReadTime = (content: string): number => {
    const wordCount = content.split(/\s+/).length;
    const readTime = Math.ceil(wordCount / 200);
    return readTime < 1 ? 1 : readTime;
  };

  const readTime = calculateReadTime(blog.content);
  
  // Format date to readable format
  const formatDate = (dateString: string): string => {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    }).format(date);
  };

  // Extract a preview of the content
  const getContentPreview = (content: string): string => {
    // Remove HTML tags for preview
    const textContent = content.replace(/<[^>]*>/g, '');
    return textContent.length > 150 
      ? `${textContent.substring(0, 150)}...` 
      : textContent;
  };

  return (
    <article className="bg-white rounded-lg overflow-hidden shadow-sm hover:shadow-md transition-shadow border border-gray-100">
      <Link to={`/blog/${blog.id}`} className="block">
        <div className="p-6">
          <div className="flex items-center space-x-2 mb-3">
            {blog.tags.length > 0 && blog.tags.slice(0, 2).map((tag, index) => (
              <span 
                key={index} 
                className="text-xs font-medium bg-gray-100 text-gray-600 px-2 py-1 rounded-full"
              >
                {tag}
              </span>
            ))}
            {blog.tags.length > 2 && (
              <span className="text-xs font-medium text-gray-500">
                +{blog.tags.length - 2} more
              </span>
            )}
          </div>
          
          <h2 className="text-xl font-serif font-bold text-gray-900 mb-2 line-clamp-2">
            {blog.title}
          </h2>
          
          <p className="text-gray-600 mb-4 line-clamp-3">
            {getContentPreview(blog.content)}
          </p>
          
          <div className="flex items-center justify-between text-sm">
            <div className="text-gray-500">
              By <span className="font-medium">{blog.author.name}</span>
            </div>
            
            <div className="flex items-center text-gray-500 space-x-4">
              <div className="flex items-center">
                <Clock size={14} className="mr-1" />
                <span>{readTime} min read</span>
              </div>
              <span>{formatDate(blog.createdAt)}</span>
            </div>
          </div>
        </div>
      </Link>
    </article>
  );
};

export default BlogCard;