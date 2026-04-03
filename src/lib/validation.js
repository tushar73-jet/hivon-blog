import { z } from 'zod';

export const PostSchema = z.object({
  title: z.string().min(5, "Title must be at least 5 characters").max(255, "Title is too long"),
  body: z.string().min(20, "Content must be at least 20 characters (too short for an article)"),
  imageUrl: z.string().url("Invalid image URL format").nullable().optional(),
  summary: z.string().nullable().optional()
});

export const CommentSchema = z.object({
  commentText: z.string().min(3, "Comment is too short (minimum 3 characters)").max(1000, "Comment is too long")
});
