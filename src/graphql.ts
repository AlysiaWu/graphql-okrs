import { makeExecutableSchema } from "apollo-server-express";

import { files } from "./resolvers";
import { typeDefs } from "./schema";

import { graphqlExpress } from "apollo-server-express/dist/expressApollo";

// Resolvers define the technique for fetching the types in the
// schema.
const resolvers = {
  Query: {
    files,
  },
};

const schema = makeExecutableSchema({
    resolvers,
    typeDefs,
});

export const handler = graphqlExpress({
    schema,
    tracing: true,
});
