export interface Blog {
  id: string;
  created_at: string;
  title: string;
  slug: string;
  excerpt: string;
  content: string;
  cover_image: string | null;
  category: string;
  tags: string[];
  author_name: string;
  read_time: number;
  is_published: boolean;
  is_featured: boolean;
  published_at: string | null;
}

export type BlogInsert = Omit<Blog, "id" | "created_at">;
export type BlogUpdate = Partial<BlogInsert>;
