export interface Profile {
  id: string;
  name: string;
  title: string;
  description: string;
  photo: string;
  email: string;
  phone?: string;
  location: string;
  website?: string;
  resume?: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface Skill {
  id: string;
  name: string;
  category: string;
  level: number; // 1-5
  icon?: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface Education {
  id: string;
  institution: string;
  degree: string;
  field: string;
  startDate: Date;
  endDate?: Date;
  description?: string;
  gpa?: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface Experience {
  id: string;
  company: string;
  position: string;
  location?: string;
  startDate: Date;
  endDate?: Date;
  current: boolean;
  description?: string;
  skills?: string[]; // JSON array of skills
  createdAt: Date;
  updatedAt: Date;
}

export interface Project {
  id: string;
  title: string;
  description?: string;
  image?: string;
  technologies?: string[]; // JSON array
  githubUrl?: string;
  liveUrl?: string;
  category?: string;
  featured: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface Organization {
  id: string;
  name: string;
  position: string;
  startDate: Date;
  endDate?: Date;
  current: boolean;
  description?: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface Activity {
  id: string;
  title: string;
  description?: string;
  date: Date;
  location?: string;
  image?: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface Article {
  id: string;
  title: string;
  slug: string;
  content: string;
  excerpt?: string;
  image?: string;
  published: boolean;
  tags?: string[]; // JSON array
  createdAt: Date;
  updatedAt: Date;
}

export interface SocialMedia {
  id: string;
  platform: string;
  username: string;
  url: string;
  icon?: string;
  order: number;
  active: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface Service {
  id: string;
  name: string;
  description?: string;
  price: number;
  unit: string; // hour, project, day
  features?: string[]; // JSON array
  active: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface Contact {
  id: string;
  name: string;
  email: string;
  subject?: string;
  message: string;
  read: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface User {
  id: string;
  email: string;
  password: string;
  name?: string;
  role: string;
  createdAt: Date;
  updatedAt: Date;
}

// API Response types
export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
}

export interface PaginatedResponse<T> {
  data: T[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

// Form types
export interface ContactFormData {
  name: string;
  email: string;
  subject?: string;
  message: string;
}

export interface LoginFormData {
  email: string;
  password: string;
}

// Component props types
export interface SectionProps {
  className?: string;
  children?: React.ReactNode;
}

export interface PageProps {
  params: { [key: string]: string };
  searchParams: { [key: string]: string | string[] | undefined };
}