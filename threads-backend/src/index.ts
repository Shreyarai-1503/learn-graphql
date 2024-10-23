import { ApolloServer } from '@apollo/server';
import { expressMiddleware } from '@apollo/server/express4';
import express from 'express';

async function init() {
    const app = express();
    const PORT = Number(process.env.PORT) || 8000;

    //Create GraphQL server
    const gqlServer = new ApolloServer({
        typeDefs: `
            type Query {
                hello: String
            }
        `,                                              //Schema goes here
        resolvers: {
            Query: {
                hello: () => 'Hello World'
            }
        }                                               //Functions to resolve queries and mutations
    });

    app.use(express.json());

    //Start GraphQL the server
    await gqlServer.start();

    app.get('/', (req, res) => {
        res.json({ message: 'Server is up and running' });
    });

    //Expose the GraphQL server
    app.use('/graphql', expressMiddleware(gqlServer));

    app.listen(PORT, () => {
        console.log(`Server is running on http://localhost:${PORT}`);
    });
}

init();