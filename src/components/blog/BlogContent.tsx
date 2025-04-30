import React from 'react';
import DOMPurify from 'dompurify';
import { Blog } from '../../types';
import { Calendar, Clock } from 'lucide-react';

interface BlogContentProps {
  blog: Blog;
}

const BlogContent: React.FC<BlogContentProps> = ({ blog }) => {
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
      month: 'long',
      day: 'numeric',
    }).format(date);
  };

  // Get author name and initial
  const authorName = typeof blog.author === 'string' ? blog.author : blog.author.name;
  const authorInitial = authorName.charAt(0).toUpperCase();

  // Sanitize the HTML content to prevent XSS attacks
  const sanitizedContent = DOMPurify.sanitize(blog.content);

  return (
    <article className="max-w-3xl mx-auto">
      <header className="mb-8">
        <h1 className="text-3xl md:text-4xl font-serif font-bold text-gray-900 mb-4">
          {blog.title}
        </h1>
        
        <div className="flex flex-wrap items-center text-gray-600 gap-4 mb-4">
          <div className="flex items-center">
            <Calendar size={16} className="mr-2" />
            <span>{formatDate(blog.createdAt)}</span>
          </div>
          <div className="flex items-center">
            <Clock size={16} className="mr-2" />
            <span>{readTime} min read</span>
          </div>
        </div>
        
        <div className="flex items-center space-x-3">
          <div className="w-8 h-8 bg-blue-200 rounded-full flex items-center justify-center text-blue-700">
            {authorInitial}
          </div>
          <span className="font-medium">{authorName}</span>
        </div>
        
        {blog.tags.length > 0 && (
          <div className="flex flex-wrap gap-2 mt-4">
            {blog.tags.map((tag, index) => (
              <span 
                key={index} 
                className="text-sm bg-gray-100 text-gray-700 px-3 py-1 rounded-full"
              >
                {tag}
              </span>
            ))}
          </div>
        )}
      </header>
      
      <div 
        className="prose prose-lg max-w-none prose-headings:font-serif prose-headings:font-bold prose-a:text-blue-600 prose-img:rounded-lg"
        dangerouslySetInnerHTML={{ __html: sanitizedContent }}
      />
    </article>
  );
};

export default BlogContent;