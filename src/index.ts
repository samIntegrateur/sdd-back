import "reflect-metadata";
import dotenv from 'dotenv';
import { ApolloServer } from 'apollo-server-express';
import express from 'express';
const mongoose = require('mongoose');
import cors from 'cors';
import { buildSchema } from 'type-graphql';
import { envVarCheck } from './shared/utils/envVarCheck';
import cookieParser from 'cookie-parser';
import authRouter from './rest/routes/auth';
import { graphqlUploadExpress } from 'graphql-upload';

dotenv.config();

const envVars = process.env;

envVarCheck(envVars);

const {
  MONGO_USER,
  MONGO_PASSWORD,
  MONGO_HOST,
  MONGO_DB,
  PORT,
  FRONT_URL,
} = envVars;

const MONGODB_URI = `mongodb+srv://${MONGO_USER}:${MONGO_PASSWORD}@${MONGO_HOST}.mongodb.net/${MONGO_DB}`;

const main = async () => {

  // Will generate a schema.gql with the npm run build-tsc commad
  // https://blog.logrocket.com/integrating-typescript-graphql/
  const schema = await buildSchema({
    resolvers: [__dirname + '/resolvers/**/*.ts'],
  })

  const mongooseCnx = await mongoose.connect(MONGODB_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useCreateIndex: true,
  });
  await mongooseCnx.connection;

  const apolloServer = new ApolloServer({
    schema,
    context: ({ req, res }) => ({ req, res }), // access to express request in our resolvers
    playground: {
      settings: {
        'request.credentials': 'include', // doesn't authorize cookies otherwise
      }
    },
    introspection: true,
    uploads: false // disable apollo upload property
  });

  const app = express();

  // Cors access
  app.use(cors({
    credentials: true,
    origin: FRONT_URL,
  }))

  app.use(cookieParser());

  app.use('/auth', authRouter);

  app.use(graphqlUploadExpress({ maxFileSize: 5_000_000, maxFiles: 10 }));

  apolloServer.applyMiddleware({ app, cors: false });

  app.listen({ port: PORT }, () =>
    console.log(`🚀 Server ready and listening at ==> http://localhost:${PORT}${apolloServer.graphqlPath}`))
}

main().catch((error) => {
  console.log(error, 'error');
})
