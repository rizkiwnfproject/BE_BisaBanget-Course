import { z } from 'zod'

// user
export const signUpSchema = z.object({
    name: z.string().min(3),
    email: z.string().email(),
    password: z.string().min(5),
    // role: z.enum(['admin', 'teacher', 'student'])
})

// mengambil dari signupschema tp name dan rolennya gausah
export const signInSchema = signUpSchema.omit({ name: true })


// subject
export const subjectSchema = z.object({
    name: z.string().min(3)
})


// class
export const classSchema = z.object({
    name: z.string().min(5),
    description: z.string().min(10),
    classAdvisorId: z.string().min(5),
    subjects: z.array(
        z.object({
            subjectId: z.string().min(5),
            teacherId: z.string().min(5),
        })

    )
        .optional()
        .default([])
})
