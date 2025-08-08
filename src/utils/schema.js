import { z } from 'zod'

export const signUpSchema = z.object({
    name: z.string().min(3),
    email: z.string().email(),
    password: z.string().min(5),
    role: z.enum(['admin', 'teacher', 'student'])
})

// mengambil dari signupschema tp name dan rolennya gausah
export const signInSchema = signUpSchema.omit({ name: true, role: true })

export const subjectSchema = z.object({
    name: z.string().min(3)
})

