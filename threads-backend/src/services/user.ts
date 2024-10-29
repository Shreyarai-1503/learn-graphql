import { createHmac, randomBytes } from "node:crypto"
import JWT from "jsonwebtoken";
import { prismaClient } from "../lib/db";
import { env } from "node:process";

export interface CreateUserPayload {
    firstName: string
    lastName?: string
    email: string
    password: string
}

export interface GetUserTokenPayload {
    email: string
    password: string
}

class UserService {
    private static hashPassword(password: string, salt: string) {
        return createHmac("sha256", salt).update(password).digest("hex");
    }

    public static createUser(payload: CreateUserPayload) {
        const { firstName, lastName, email, password } = payload
        const salt = randomBytes(16).toString("hex");
        const hashedPassword = UserService.hashPassword(password, salt);

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

    private static async getUserByEmail(email: string) {
        return await prismaClient.user.findUnique({ where: {email}});
    }

    public static async getUserToken(payload: GetUserTokenPayload) {
        const {email, password} = payload;

        const user = await UserService.getUserByEmail(email);

        if (!user) throw new Error("User not found");

        const hashedPassword = UserService.hashPassword(password, user.salt);

        if(hashedPassword !== user.password) throw new Error("Invalid password");

        //Generate token
        if (!env.JWT_SECRET) throw new Error("JWT_SECRET is not defined");
        
        const token = JWT.sign({id: user.id, email: user.email}, env.JWT_SECRET);

        return token;
    }
}

export default UserService;