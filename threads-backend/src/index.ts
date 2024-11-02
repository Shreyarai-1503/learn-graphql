import express from 'express';
import { expressMiddleware } from '@apollo/server/express4';
import createApolloGraphqlServer from './graphql';
import UserService from './services/user';

async function init() {
    const app = express();
    const PORT = Number(process.env.PORT) || 8000;

    app.use(express.json());

    app.get('/', (req, res) => {
        res.json({ message: 'Server is up and running' });
    });

    const gqlServer = await createApolloGraphqlServer();
    //Expose the GraphQL server
    app.use('/graphql', expressMiddleware(
        (gqlServer),
        {
            context: async ({ req }) => {
                //@ts-ignore
                const token = req.headers["token"];
                try {
                    const user = UserService.decodeToken(token as string);
                    return { user };
                } catch (error) {
                    console.log(error);
                    return {};
                }
            }
        }
    ));

    app.listen(PORT, () => {
        console.log(`Server is running on http://localhost:${PORT}/graphql`);
    });
}

init();