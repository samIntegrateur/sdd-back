import dotenv from 'dotenv';
import express, {Request, Response, NextFunction} from 'express';
import mongoose, {Schema} from 'mongoose';
import bodyParser from 'body-parser';
import graphqlHTTP from 'express-graphql';

import User from './models/user';
import Offer from './models/offer';

import graphqlSchema from './graphql/schema';
import graphqlResolver from './graphql/resolver';

dotenv.config();

const { MONGO_USER, MONGO_PASSWORD, MONGO_HOST, MONGO_DB, PORT} = process.env;

const MONGODB_URI = `mongodb+srv://${MONGO_USER}:${MONGO_PASSWORD}@${MONGO_HOST}.mongodb.net/${MONGO_DB}`;

const app = express();

app.use(bodyParser.json());

// Allow cross origin
app.use((req: Request, res: Response, next: NextFunction) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, PATCH, DELETE');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');

  // Avoid a confusing 405 error
  if (req.method === 'OPTIONS') {
    return res.sendStatus(200);
  }
  next();
});


app.get("/", (req: Request, res: Response, next: NextFunction) => {
  res.send('Hello world');
});


const createDumbOffer = async (userId: Schema.Types.ObjectId) => {

  const offer = await Offer.findOne();

  if (!offer) {
    console.log('no offer creating a dumb one');
    const offer = new Offer({
      title: 'my offer',
      description: 'lorem ipsum',
      author: userId,
    });

    const saveResult = await offer.save();
    console.log('saveResult from createDumbOffer', saveResult);
  }
}

const createDumbUser = async () => {

  const user = await User.findOne();

  if (!user) {
    console.log('no user creating a dumb one');
    const user = new User({
      name: 'Sam',
      email: 'sam@test.com',
      password: 'toto',
    });

    const saveResult = await user.save();
    console.log('saveResult from createDumbUser', saveResult);
    createDumbOffer(saveResult._id);
  }
}


app.use('/graphql', graphqlHTTP({
  schema: graphqlSchema,
  rootValue: graphqlResolver,
  graphiql: true,
}));


mongoose.connect(MONGODB_URI, {useNewUrlParser: true, useUnifiedTopology: true})
  .then(result => {

    // Create dumb user if there isn't
   createDumbUser();

    app.listen(PORT);
  })
  .catch(err => console.error(err));

