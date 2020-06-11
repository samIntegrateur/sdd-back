import dotenv from 'dotenv';
import { ApolloServer } from 'apollo-server-express';
import express from 'express';
import { connect } from 'mongoose';;
import 'reflect-metadata';
import session from 'express-session';
const MongoDBStore = require('connect-mongodb-session')(session);
import cors from 'cors';
import { buildSchema } from 'type-graphql';

// resolvers
import { OfferResolver } from './resolvers/offer/OfferResolver';
import { RegisterResolver } from './resolvers/user/RegisterResolver';
import { LoginResolver } from './resolvers/user/LoginResolver';

dotenv.config();

const {
  NODE_ENV,
  MONGO_USER,
  MONGO_PASSWORD,
  MONGO_HOST,
  MONGO_DB,
  DOMAIN,
  PORT,
  FRONT_URL,
  SESSION_KEY,
  SESSION_NAME,
} = process.env;

const MONGODB_URI = `mongodb+srv://${MONGO_USER}:${MONGO_PASSWORD}@${MONGO_HOST}.mongodb.net/${MONGO_DB}`;


const main = async () => {

  // Will generate a schema.gql with the npm run build-tsc commad
  // https://blog.logrocket.com/integrating-typescript-graphql/
  const schema = await buildSchema({
    resolvers: [LoginResolver, RegisterResolver, OfferResolver],
  })

  // configure cnx between session and mongodb
  const store = new MongoDBStore({
    uri: MONGODB_URI,
    collection: 'sessions',
  });

  const mongoose = await connect(MONGODB_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useCreateIndex: true,
  });
  await mongoose.connection;

  const server = new ApolloServer({
    schema,
    context: ({ req }) => ({ req }), // access to express request in our resolvers
    playground: {
      settings: {
        'request.credentials': 'include', // doesn't authorize cookies otherwise
      }
    }
  });

  const app = express();

  // Cors access
  app.use(cors({
    credentials: true,
    optionsSuccessStatus: 200,
    origin: FRONT_URL,
  }))

  // Configure session
  app.use(session({
    store: store, // store it in mongodb
    name: SESSION_NAME,
    secret: SESSION_KEY as string,
    resave: false,
    saveUninitialized: false,
    cookie: {
      httpOnly: true,
      domain: DOMAIN,
      secure: NODE_ENV === 'production',
      maxAge: 1000 * 60 * 60 * 24 * 365, // 1 year
    },
  }));


  server.applyMiddleware({ app });

  app.listen({ port: PORT }, () =>
    console.log(`🚀 Server ready and listening at ==> http://localhost:${PORT}${server.graphqlPath}`))
}

main().catch((error) => {
  console.log(error, 'error');
})
