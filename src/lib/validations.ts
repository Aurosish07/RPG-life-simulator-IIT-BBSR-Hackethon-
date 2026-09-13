import { z } from 'zod'

export const RegisterSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),
  email: z.string().email('Invalid email address'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
})

export const LoginSchema = z.object({
  email: z.string().email('Invalid email address'),
  password: z.string().min(1, 'Password is required'),
})

export const TaskSchema = z.object({
  title: z.string().min(1, 'Task title is required').max(100, 'Title too long'),
  description: z.string().max(500, 'Description too long').optional(),
  attribute: z.enum(['STRENGTH', 'INTELLECT', 'AGILITY', 'VITALITY', 'CHARISMA', 'WISDOM']),
  difficulty: z.enum(['EASY', 'MEDIUM', 'HARD', 'EPIC']).default('MEDIUM'),
  isRecurring: z.boolean().default(false),
  recurrenceRule: z.string().optional(),
  dueDate: z.string().optional(),
})

export type RegisterInput = z.infer<typeof RegisterSchema>
export type LoginInput = z.infer<typeof LoginSchema>
export type TaskInput = z.infer<typeof TaskSchema>