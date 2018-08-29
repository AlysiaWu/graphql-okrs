import { ApolloServer } from "apollo-server";

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
const server = new ApolloServer({ typeDefs, resolvers });

// This `listen` method launches a web-server.  Existing apps
// can utilize middleware options, which we'll discuss later.
server.listen().then(({ url }) => {
  // tslint:disable-next-line:no-console
  console.log(`🚀  Server ready at ${url}`);
});
