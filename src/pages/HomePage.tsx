import React, { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import { getAllBlogs } from '../services/blogService';
import { Blog } from '../types';
import BlogCard from '../components/blog/BlogCard';
import TagFilter from '../components/blog/TagFilter';
import { Loader } from 'lucide-react';

const HomePage: React.FC = () => {
  const [blogs, setBlogs] = useState<Blog[]>([]);
  const [filteredBlogs, setFilteredBlogs] = useState<Blog[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedTag, setSelectedTag] = useState<string | null>(null);
  const [allTags, setAllTags] = useState<string[]>([]);
  
  const location = useLocation();

  const getSearchQuery = () => {
    const params = new URLSearchParams(location.search);
    return params.get('search');
  };

  const searchQuery = getSearchQuery();

  useEffect(() => {
    const fetchBlogs = async () => {
      setLoading(true);
      try {
        const fetchedBlogs = await getAllBlogs();
        setBlogs(fetchedBlogs);
        
        const tags = Array.from(
          new Set(fetchedBlogs.flatMap(blog => blog.tags))
        );
        setAllTags(tags);
        
        setError(null);
      } catch (err) {
        setError('Failed to load blogs. Please try again later.');
      } finally {
        setLoading(false);
      }
    };

    fetchBlogs();
  }, []);

  useEffect(() => {
    let result = blogs;
    
    if (selectedTag) {
      result = result.filter(blog => blog.tags.includes(selectedTag));
    }
    
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      result = result.filter(
        blog => 
          blog.title.toLowerCase().includes(query) || 
          blog.content.toLowerCase().includes(query) ||
          blog.tags.some(tag => tag.toLowerCase().includes(query))
      );
    }
    
    setFilteredBlogs(result);
  }, [blogs, selectedTag, searchQuery]);

  return (
    <div className="container mx-auto px-4 py-8">
      {searchQuery && (
        <h1 className="text-2xl font-serif font-bold mb-6">
          Search results for: "{searchQuery}"
        </h1>
      )}
      
      {!searchQuery && (
        <h1 className="text-3xl font-serif font-bold mb-6">
          Featured Stories
        </h1>
      )}
      
      {loading ? (
        <div className="flex justify-center items-center h-64">
          <Loader size={32} className="animate-spin text-blue-600" />
        </div>
      ) : error ? (
        <div className="text-center text-red-600 p-6">
          <p>{error}</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          <div className="lg:col-span-1">
            <TagFilter 
              tags={allTags} 
              selectedTag={selectedTag} 
              onSelectTag={setSelectedTag} 
            />
          </div>
          
          <div className="lg:col-span-3">
            {filteredBlogs.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {filteredBlogs.map((blog) => (
                  <BlogCard key={blog.id} blog={blog} />
                ))}
              </div>
            ) : (
              <div className="text-center p-12 bg-gray-50 rounded-lg">
                <img
                  src="https://images.pexels.com/photos/3646172/pexels-photo-3646172.jpeg?auto=compress&cs=tinysrgb&w=800"
                  alt="Dinosaur reading a book"
                  className="w-64 h-64 object-cover mx-auto mb-6 rounded-lg"
                />
                <h3 className="text-xl font-medium mb-2">No stories found</h3>
                <p className="text-gray-600">
                  {searchQuery
                    ? `No results matching "${searchQuery}"`
                    : selectedTag
                    ? `No stories with the tag "${selectedTag}"`
                    : "Looks like our dinosaur hasn't discovered any stories yet!"}
                </p>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default HomePage;