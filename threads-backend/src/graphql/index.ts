import { ApolloServer } from '@apollo/server';
import {User} from './user';

async function createApolloGraphqlServer() {
    //Create GraphQL server 
    const gqlServer = new ApolloServer({
        typeDefs: `
            ${User.typeDefs}
            type Query {
                ${User.queries}
            }
            type Mutation {
                ${User.mutations}
            }
        `,  //Schema goes here
        resolvers: {
            Query: {
                ...User.resolvers.queries
            },
            Mutation: {
                ...User.resolvers.mutations
            }    //Functions to resolve queries and mutations
        }
    })

    //Start GraphQL the server
    await gqlServer.start();

    return gqlServer;
}

export default createApolloGraphqlServer;