import React, { useEffect, useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { getBlogById, deleteBlog } from '../services/blogService';
import { Blog } from '../types';
import BlogContent from '../components/blog/BlogContent';
import { Loader, Edit, Trash2 } from 'lucide-react';
import toast from 'react-hot-toast';

const BlogDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [blog, setBlog] = useState<Blog | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);
  const { user } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    const fetchBlog = async () => {
      if (!id) return;
      
      setLoading(true);
      try {
        const fetchedBlog = await getBlogById(id);
        setBlog(fetchedBlog);
        setError(null);
        
        // Update page title
        document.title = `${fetchedBlog.title} | Blogosaurus`;
      } catch (err) {
        setError('Failed to load blog. It may have been removed or you may not have permission to view it.');
      } finally {
        setLoading(false);
      }
    };

    fetchBlog();
    
    // Reset title on unmount
    return () => {
      document.title = 'Blogosaurus';
    };
  }, [id]);

  const handleDelete = async () => {
    if (!blog || !window.confirm('Are you sure you want to delete this blog post? This action cannot be undone.')) {
      return;
    }
    
    setIsDeleting(true);
    try {
      await deleteBlog(blog.id);
      toast.success('Blog post deleted successfully');
      navigate('/dashboard');
    } catch (err) {
      toast.error('Failed to delete blog post');
      setIsDeleting(false);
    }
  };

  const isAuthor = user && blog && typeof blog.author !== 'string' && user.id === blog.author.id;

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <Loader size={32} className="animate-spin text-blue-600" />
      </div>
    );
  }

  if (error || !blog) {
    return (
      <div className="container mx-auto px-4 py-12">
        <div className="max-w-2xl mx-auto text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">
            {error || 'Blog not found'}
          </h2>
          <p className="text-gray-600 mb-6">
            The blog post you're looking for doesn't exist or might have been removed.
          </p>
          <Link 
            to="/"
            className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
          >
            Back to Home
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      {isAuthor && (
        <div className="max-w-3xl mx-auto mb-6 flex justify-end space-x-4">
          <Link
            to={`/edit/${blog.id}`}
            className="flex items-center px-4 py-2 bg-gray-100 text-gray-700 rounded-md hover:bg-gray-200 transition-colors"
          >
            <Edit size={18} className="mr-2" />
            Edit
          </Link>
          <button
            onClick={handleDelete}
            disabled={isDeleting}
            className="flex items-center px-4 py-2 bg-red-100 text-red-700 rounded-md hover:bg-red-200 transition-colors disabled:opacity-50"
          >
            <Trash2 size={18} className="mr-2" />
            {isDeleting ? 'Deleting...' : 'Delete'}
          </button>
        </div>
      )}
      
      <BlogContent blog={blog} />
      
      <div className="max-w-3xl mx-auto mt-12 pt-8 border-t border-gray-200">
        <h3 className="text-xl font-serif font-bold text-gray-900 mb-4">
          Enjoyed this article?
        </h3>
        <p className="text-gray-600 mb-6">
          Sign up to receive notifications on new posts from this author.
        </p>
        
        <div className="flex flex-col sm:flex-row gap-4">
          <input
            type="email"
            placeholder="Your email address"
            className="flex-grow px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
          <button className="px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors">
            Subscribe
          </button>
        </div>
      </div>
    </div>
  );
};

export default BlogDetailPage;