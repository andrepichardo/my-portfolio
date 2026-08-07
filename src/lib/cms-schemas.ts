import { z } from "zod";

/**
 * Payload shapes for the CMS endpoints. They live here rather than in the route
 * files because Next validates the exports of a route module and rejects
 * anything that is not a handler or a segment config.
 */

export const skillSchema = z.object({
  name: z.string().min(1, "Name is required"),
  imageUrl: z.string().min(1, "An image is required"),
  iconSize: z.coerce.number().int().min(16).max(160).default(64),
  published: z.boolean().default(true),
});

export const socialLinkSchema = z.object({
  label: z.string().min(1, "Label is required"),
  url: z.string().min(1, "URL is required"),
  icon: z.string().min(1, "Icon is required"),
  published: z.boolean().default(true),
});

export const settingsSchema = z.object({
  metaTitle: z.string().min(1, "Title is required"),
  metaDescription: z.string().min(1, "Description is required"),
  resumeUrl: z.string().default(""),
});

export const sectionSchema = z.object({
  eyebrow: z.string().default(""),
  heading: z.string().default(""),
  highlight: z.string().default(""),
  subheading: z.string().default(""),
  body: z.array(z.string()).default([]),
  imageUrl: z.string().default(""),
  ctaLabel: z.string().default(""),
  ctaHref: z.string().default(""),
});

export const reorderSchema = z.object({
  ids: z.array(z.string().min(1)).min(1),
});
