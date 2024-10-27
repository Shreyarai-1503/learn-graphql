import { createHmac, randomBytes } from "node:crypto"
import { prismaClient } from "../lib/db";

export interface CreateUserPayload {
    firstName: string
    lastName?: string
    email: string
    password: string
}

class UserService {
    public static createUser(payload: CreateUserPayload) {
        const { firstName, lastName, email, password } = payload
        const salt = randomBytes(16).toString();
        const hashedPassword = createHmac("sha256", salt).update(password).digest("hex");

        return prismaClient.user.create({
            data: {
                firstName,
                lastName,
                email,
                password: hashedPassword,
                salt
            }
        })

    }
}

export default UserService;