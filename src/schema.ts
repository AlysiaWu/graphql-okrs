import { gql } from "apollo-server";

// Type definitions define the "shape" of your data and specify
// which ways the data can be fetched from the GraphQL server.
export const typeDefs = gql`
  type File {
    id: String
    name: String
    objectives: [Objective]
  }

  # Comments in GraphQL are defined with the hash (#) symbol.
  type Objective {
    title: String
    keyResults: [KeyResult]
  }

  type KeyResult {
    description: String
    priority: String
    status: String
    score: String
    lead: String
    notes: String
  }

  # The "Query" type is the root of all GraphQL queries.
  # (A "Mutation" type will be covered later on.)
  type Query {
    files(name: String): [File]
  }
`;
