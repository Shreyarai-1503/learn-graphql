import { ApolloServer } from '@apollo/server';
import { expressMiddleware } from '@apollo/server/express4';
import express from 'express';
import { prismaClient } from './lib/db';

async function init() {
    const app = express();
    const PORT = Number(process.env.PORT) || 8000;

    //Create GraphQL server 
    const gqlServer = new ApolloServer({
        typeDefs: `
            type Query {
                hello: String
                say(name: String): String
            }
            type Mutation {
                createUser(firstName: String!, lastName: String!, email: String!, password: String!): Boolean
            }
        `,                                              //Schema goes here
        resolvers: {
            Query: {
                hello: () => 'Hello World',
                say: (_, { name }: { name: string }) => `Hello ${name}`
            },
            Mutation: {
                createUser: async (_, { firstName, lastName, email, password }:
                    { firstName: string, lastName: string, email: string, password: string }) => {
                    await prismaClient.user.create({
                        data: {
                            firstName,
                            lastName,
                            email,
                            password,
                            salt: '1234'
                        }
                    });
                    return true;
                }
            }                                               //Functions to resolve queries and mutations
        }
    })

    app.use(express.json());

    //Start GraphQL the server
    await gqlServer.start();

    app.get('/', (req, res) => {
        res.json({ message: 'Server is up and running' });
    });

    //Expose the GraphQL server
    app.use('/graphql', expressMiddleware(gqlServer));

    app.listen(PORT, () => {
        console.log(`Server is running on http://localhost:${PORT}/graphql`);
    });
}

init();