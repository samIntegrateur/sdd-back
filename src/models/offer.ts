import mongoose, { Schema, Document } from 'mongoose';
import {IUser} from './user';

export interface IOffer extends Document {
  title: string,
  description: string,
  imageUrl?: string,
  thumbUrl?: string,
  author: IUser['_id'],
}

const OfferSchema: Schema = new Schema({
  title: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  imageUrl: {
    type: String,
  },
  thumbUrl: {
    type: String,
  },
  author: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  }
}, { timestamps: true });

export default mongoose.model<IOffer>('Offer', OfferSchema);
