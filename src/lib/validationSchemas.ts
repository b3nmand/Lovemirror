import { z } from 'zod';

// Profile setup validation schema
export const profileSchema = z.object({
  name: z.string().min(2, { message: "Name must be at least 2 characters" }).max(50),
  age: z.coerce.number().int().min(18, { message: "You must be at least 18 years old" }).max(120, { message: "Please enter a valid age" }),
  gender: z.enum(["male", "female"], { 
    errorMap: () => ({ message: "Please select your gender" })
  }),
  region: z.enum(["africa", "asia", "europe", "north_america", "south_america", "oceania"], {
    errorMap: () => ({ message: "Please select your region" })
  }),
  culturalContext: z.enum(["global", "african"], {
    errorMap: () => ({ message: "Please select your cultural context" })
  }).default("global")
});

export type ProfileFormData = z.infer<typeof profileSchema>;

// Auth validation schema
export const authSchema = z.object({
  name: z.string().min(2, { message: "Name must be at least 2 characters" }).max(50).optional(),
  dob: z.string().refine((val) => {
    if (!val) return false;
    const birthDate = new Date(val);
    const today = new Date();
    let age = today.getFullYear() - birthDate.getFullYear();
    const m = today.getMonth() - birthDate.getMonth();
    if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) {
      age--;
    }
    return age >= 18;
  }, { message: "You must be at least 18 years old" }),
  country: z.string().min(1, { message: "Please select your country" }).optional(),
  email: z.string().email({ message: "Please enter a valid email address" }),
  password: z.string().min(6, { message: "Password must be at least 6 characters" })
});

export type AuthFormData = z.infer<typeof authSchema>;

// Invite assessor validation schema
export const inviteAssessorSchema = z.object({
  email: z.string().email({ message: "Please enter a valid email address" }),
  relationship: z.enum(["parent", "friend", "sibling", "partner"], {
    errorMap: () => ({ message: "Please select a relationship type" })
  }),
  assessment_type: z.enum(["wife-material", "bridal-price"], {
    errorMap: () => ({ message: "Please select an assessment type" })
  }).optional()
});

export type InviteAssessorFormData = z.infer<typeof inviteAssessorSchema>;

// Goal creation validation schema
export const goalSchema = z.object({
  area: z.string().min(1, { message: "Please select an area" }),
  title: z.string().optional(),
  target: z.coerce.number().min(1, { message: "Target must be at least 1" }).max(100, { message: "Target cannot exceed 100" }),
  deadline: z.string().min(1, { message: "Please select a deadline" })
});

export type GoalFormData = z.infer<typeof goalSchema>;

// Habit creation validation schema
export const habitSchema = z.object({
  name: z.string().min(3, { message: "Habit name must be at least 3 characters" }).max(50),
  description: z.string().max(200).optional()
});

export type HabitFormData = z.infer<typeof habitSchema>;