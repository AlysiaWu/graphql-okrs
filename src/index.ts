import express from "express";

import { ApolloServer } from "apollo-server-express";

import { KeyResult, objectives } from "./resolvers";
import { typeDefs } from "./schema";

// Resolvers define the technique for fetching the types in the
// schema.
const resolvers = {
  KeyResult,
  Query: {
    // tslint:disable-next-line:no-console
    objectives,
  },
};

// In the most basic sense, the ApolloServer can be started
// by passing type definitions (typeDefs) and the resolvers
// responsible for fetching the data for those types.
const server = new ApolloServer({
    playground: false,
    resolvers,
    tracing: true,
    typeDefs,
});

const port = 4000;
const app = express();

server.applyMiddleware({app});

// Serve the application at the given port
app.listen({ port }, () =>
  // tslint:disable-next-line:no-console
  console.log(`🚀 Server ready at http://localhost:${port}${server.graphqlPath}`),
);
