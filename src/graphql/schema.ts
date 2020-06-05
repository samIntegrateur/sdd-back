import { buildSchema } from 'graphql';

// todo : replace it with Apollo and/or TypeGraphQL and typegoose ?
// https://blog.logrocket.com/integrating-typescript-graphql/
// https://pusher.com/tutorials/graphql-typescript
const graphqlSchema = buildSchema(`

  type Author {
    _id: ID!
    email: String!
    password: String!
    name: String!
    createdAt: String!
    updatedAt: String!
  }

  type Offer {
    _id: ID!
    title: String!
    description: String!
    imageUrl: String
    thumbUrl: String
    author: Author
    createdAt: String!
    updatedAt: String!
  }
  
  type RootQuery {
    offers: [Offer]!
  }  
  
  schema {
    query: RootQuery
  }
`);

export default graphqlSchema;
