import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { createBlog, generateContent } from '../services/blogService';
import RichTextEditor from '../components/editor/RichTextEditor';
import TagInput from '../components/blog/TagInput';
import { Loader, Sparkles } from 'lucide-react';
import toast from 'react-hot-toast';

const CreateBlogPage: React.FC = () => {
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [tags, setTags] = useState<string[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);
  const [topic, setTopic] = useState('');
  
  const navigate = useNavigate();

  // For AI generation
  const handleGenerate = async () => {
    if (!topic.trim()) {
      toast.error('Please enter a prompt for AI generation');
      return;
    }
    
    setIsGenerating(true);
    try {
      const generatedContent = await generateContent(topic);
      setContent(generatedContent);
      toast.success('Content generated successfully');
    } catch (error) {
      toast.error('Failed to generate content');
    } finally {
      setIsGenerating(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!title.trim()) {
      toast.error('Please enter a title');
      return;
    }
    
    if (!content.trim()) {
      toast.error('Please add some content to your blog');
      return;
    }
    
    setIsSubmitting(true);
    try {
      const blog = await createBlog({
        title,
        content,
        tags,
      });
      
      toast.success('Blog created successfully!');
      navigate(`/blog/${blog.id}`);
    } catch (error) {
      toast.error('Failed to create blog. Please try again.');
      setIsSubmitting(false);
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-serif font-bold text-gray-900 mb-6">
          Create New Blog Post
        </h1>
        
        <form onSubmit={handleSubmit}>
          <div className="mb-6">
            <label htmlFor="title" className="block text-gray-700 font-medium mb-2">
              Title
            </label>
            <input
              type="text"
              id="title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Enter a captivating title..."
              className="w-full px-4 py-3 text-xl border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              required
            />
          </div>
          
          <div className="mb-6">
            <label htmlFor="tags" className="block text-gray-700 font-medium mb-2">
              Tags
            </label>
            <TagInput
              tags={tags}
              onChange={setTags}
              placeholder="Add topics (press Enter after each tag)..."
            />
            <p className="mt-1 text-sm text-gray-500">
              Add up to 5 tags to help readers discover your blog
            </p>
          </div>
          
          <div className="mb-8">
            <label className="block text-gray-700 font-medium mb-2">
              Content
            </label>
            <RichTextEditor content={content} onChange={setContent} />
          </div>
          
          <div className="mb-8 bg-gray-50 p-4 rounded-lg border border-gray-200">
            <h3 className="flex items-center text-lg font-medium text-gray-900 mb-3">
              <Sparkles size={18} className="mr-2 text-blue-600" />
              Generate content with AI
            </h3>
            <div className="flex flex-col sm:flex-row gap-3">
              <input
                type="text"
                value={topic}
                onChange={(e) => setTopic(e.target.value)}
                placeholder="Enter a topic or idea for your blog post..."
                className="flex-grow px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
              <button
                type="button"
                onClick={handleGenerate}
                disabled={isGenerating || !topic.trim()}
                className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center sm:w-auto w-full"
              >
                {isGenerating ? (
                  <>
                    <Loader size={16} className="animate-spin mr-2" />
                    Generating...
                  </>
                ) : (
                  'Generate'
                )}
              </button>
            </div>
            <p className="mt-2 text-sm text-gray-500">
              AI-generated content should be reviewed and edited before publishing
            </p>
          </div>
          
          <div className="flex justify-end space-x-4">
            <button
              type="button"
              onClick={() => navigate('/')}
              className="px-6 py-2 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors disabled:opacity-50 flex items-center"
            >
              {isSubmitting ? (
                <>
                  <Loader size={16} className="animate-spin mr-2" />
                  Publishing...
                </>
              ) : (
                'Publish'
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CreateBlogPage;