import { z } from "zod";

export const environmentSchema = z.object({
  name: z.string().min(1, "Name is required"),
  description: z.string().optional(),
});

export const flagEvaluateSchema = z.object({
  flagKey: z.string().min(1, "Flag key is required"),
  environmentId: z.string().uuid("Valid Environment ID is required"),
  userId: z.string().optional(),
  groups: z.array(z.string()).optional(),
});

export const featureTargetingSchema = z.object({
  userIds: z.array(z.string()).optional(),
  groupNames: z.array(z.string()).optional(),
});

export const rolloutSchema = z.object({
  percentage: z.number().min(0).max(100),
});
