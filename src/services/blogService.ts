import axios, { AxiosInstance } from 'axios';
import { Blog, CreateBlogPayload, UpdateBlogPayload } from '../types';

const API_URL = 'https://blogosaurus-revamp.onrender.com';

// Create an axios instance with default config
const api: AxiosInstance = axios.create({
  baseURL: API_URL,
});

// Add request interceptor for authentication
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('access_token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

export const getAllBlogs = async (tag?: string): Promise<Blog[]> => {
  try {
    const url = tag ? `/blog/all?tag=${tag}` : '/blog/all';
    const response = await api.get(url);
    // Handle both array and { blogs: [...] } responses
    const blogs = Array.isArray(response.data) ? response.data : response.data.blogs;
    return blogs.map((blog: any) => ({
      ...blog,
      id: blog.id || String(Math.random()), // Fallback ID if none provided
      author: blog.author || { id: '1', name: 'Anonymous' }, // Fallback author if none provided
      createdAt: blog.createdAt || new Date().toISOString(), // Fallback dates if none provided
      updatedAt: blog.updatedAt || new Date().toISOString(),
      tags: blog.tags || [] // Fallback empty tags if none provided
    }));
  } catch (error) {
    throw new Error('Failed to fetch blogs');
  }
};

export const getBlogById = async (id: string): Promise<Blog> => {
  try {
    const response = await api.get(`/blog/${id}`);
    const blogData = response.data;
    
    // Transform the response to match the Blog interface
    return {
      ...blogData,
      id: blogData.id || String(Math.random()),
      author: blogData.author || { 
        id: String(blogData.user_id || '1'),
        name: blogData.author || 'Anonymous'
      },
      createdAt: blogData.created_at || new Date().toISOString(),
      updatedAt: blogData.updated_at || blogData.created_at || new Date().toISOString(),
      tags: blogData.tags || []
    };
  } catch (error) {
    throw new Error('Failed to fetch blog');
  }
};

export const getMyBlogs = async (): Promise<Blog[]> => {
  try {
    const response = await api.get('/blog/my');
    // Handle both array and { blogs: [...] } responses
    const blogs = Array.isArray(response.data) ? response.data : response.data.blogs || [];
    return blogs.map((blog: any) => ({
      ...blog,
      id: blog.id || String(Math.random()), // Fallback ID if none provided
      author: blog.author || { id: '1', name: 'Anonymous' }, // Fallback author if none provided
      createdAt: blog.createdAt || new Date().toISOString(), // Fallback dates if none provided
      updatedAt: blog.updatedAt || new Date().toISOString(),
      tags: blog.tags || [] // Fallback empty tags if none provided
    }));
  } catch (error) {
    throw new Error('Failed to fetch your blogs');
  }
};

export const createBlog = async (blogData: CreateBlogPayload): Promise<Blog> => {
  try {
    const response = await api.post('/blog/', blogData);
    return response.data.blog;
  } catch (error) {
    throw new Error('Failed to create blog');
  }
};

export const updateBlog = async ({ id, ...blogData }: UpdateBlogPayload): Promise<Blog> => {
  try {
    const response = await api.put(`/blog/${id}`, blogData);
    return response.data.blog;
  } catch (error) {
    throw new Error('Failed to update blog');
  }
};

export const deleteBlog = async (id: string): Promise<void> => {
  try {
    await api.delete(`/blog/${id}`);
  } catch (error) {
    throw new Error('Failed to delete blog');
  }
};

export const generateContent = async (topic: string): Promise<string> => {
  try {
    const response = await api.post('/ai/generate', { topic });
    return response.data.content;
  } catch (error) {
    throw new Error('Failed to generate content');
  }
};