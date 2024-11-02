import UserService, { CreateUserPayload, GetUserTokenPayload } from "../../services/user";

const queries = {
    getUserToken: async(_: any, payload: GetUserTokenPayload) => {
        const token = await UserService.getUserToken(payload);
        return token;
    },

    getCurrentUser: async(_:any, parameters:any, context:any) => {
        if(context && context.user) {
            return context.user.id;
        }
        
        throw new Error("Cannot get current user");
    }
}

const mutations = {
    createUser: async (_: any, payload: CreateUserPayload) => {
        const res = await UserService.createUser(payload); 
        return res.id;
    }
}

export const resolvers = { queries, mutations };