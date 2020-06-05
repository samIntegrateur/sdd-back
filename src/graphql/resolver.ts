import {Request} from 'express';
import mongoose from 'mongoose';

import User from '../models/user';
import Offer from '../models/offer';

const graphqlResolver = {
  offers: async ({}, req: Request) => {
    const offers = await Offer.find().populate('author');
    console.log('offers', offers);

    return offers;
  }
}

export default graphqlResolver;
