// https://blog.logrocket.com/integrating-typescript-graphql/
import { ObjectId } from 'mongodb';
export type Ref<T> = T | ObjectId;
