import { z } from 'zod';

export const profileSchema = z.object({
  name: z.string().min(1, 'Name is required'),
  title: z.string().optional(),
  description: z.string().optional(),
  email: z.string().email().optional(),
  phone: z.string().optional(),
  location: z.string().optional(),
  website: z.string().url().optional().or(z.literal('')),
  photo: z.string().optional(),
  resume: z.string().optional(),
});

export const skillSchema = z.object({
  name: z.string().min(1, 'Skill name is required'),
  category: z.string().min(1, 'Category is required'),
  level: z.number().min(1).max(5),
  icon: z.string().optional(),
});

export const projectSchema = z.object({
  title: z.string().min(1, 'Title is required'),
  description: z.string().optional(),
  image: z.string().optional(),
  technologies: z.array(z.string()).optional(),
  githubUrl: z.string().url().optional().or(z.literal('')),
  liveUrl: z.string().url().optional().or(z.literal('')),
  category: z.string().optional(),
  featured: z.boolean().default(false),
});

export const articleSchema = z.object({
  title: z.string().min(1, 'Title is required'),
  slug: z.string().min(1, 'Slug is required'),
  content: z.string().min(1, 'Content is required'),
  excerpt: z.string().optional(),
  image: z.string().optional(),
  published: z.boolean().default(false),
  tags: z.array(z.string()).optional(),
});

export const experienceSchema = z.object({
  company: z.string().min(1, 'Company name is required'),
  position: z.string().min(1, 'Position is required'),
  location: z.string().optional(),
  startDate: z.string().min(1, 'Start date is required'),
  endDate: z.string().optional(),
  current: z.boolean().default(false),
  description: z.string().optional(),
  skills: z.array(z.string()).optional(),
});

export const educationSchema = z.object({
  institution: z.string().min(1, 'Institution is required'),
  degree: z.string().min(1, 'Degree is required'),
  field: z.string().optional(),
  startDate: z.string().min(1, 'Start date is required'),
  endDate: z.string().optional(),
  description: z.string().optional(),
  gpa: z.string().optional(),
});

export const organizationSchema = z.object({
  name: z.string().min(1, 'Organization name is required'),
  position: z.string().min(1, 'Position is required'),
  startDate: z.string().min(1, 'Start date is required'),
  endDate: z.string().optional(),
  current: z.boolean().default(false),
  description: z.string().optional(),
});

export const activitySchema = z.object({
  title: z.string().min(1, 'Title is required'),
  description: z.string().optional(),
  date: z.string().min(1, 'Date is required'),
  location: z.string().optional(),
  image: z.string().optional(),
});

export const socialMediaSchema = z.object({
  platform: z.string().min(1, 'Platform is required'),
  username: z.string().min(1, 'Username is required'),
  url: z.string().url('Invalid URL'),
  icon: z.string().optional(),
  order: z.number().default(0),
  active: z.boolean().default(true),
});

export const serviceSchema = z.object({
  name: z.string().min(1, 'Service name is required'),
  description: z.string().optional(),
  price: z.number().min(0, 'Price must be positive'),
  unit: z.string().default('hour'),
  features: z.array(z.string()).optional(),
  active: z.boolean().default(true),
});