export type UserData = {
    id: string,
    createdAt: Date,
    updatedAt: Date,
    email: string,
    emailVerified: boolean,
    name: string,
    image?: string | null | undefined
}