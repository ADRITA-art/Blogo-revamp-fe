export interface User {
  id: string;
  email: string;
  name: string;
}

export interface AuthState {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
}

export interface BlogAuthor {
  id: string;
  name: string;
}

export interface Blog {
  id: string;
  title: string;
  content: string;
  tags: string[];
  author: BlogAuthor | string;
  createdAt: string;
  updatedAt: string;
}

export interface CreateBlogPayload {
  title: string;
  content: string;
  tags: string[];
}

export interface UpdateBlogPayload extends CreateBlogPayload {
  id: string;
}