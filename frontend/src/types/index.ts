export interface Post {
  id: number;
  title: string;
  content: string;
  excerpt: string | null;
  cover_image_url: string | null;
  is_published: boolean;
  author_id: number;
  created_at: string;
  updated_at: string;
}

export interface Comment {
  id: number;
  content: string;
  author_username: string;
  created_at: string;
}

export interface User {
  id: number;
  username: string;
  email: string;
  bio: string | null;
  avatar_url: string | null;
  created_at: string;
}
