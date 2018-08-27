import { ApolloServer } from "apollo-server";
import { RequestOptions } from "http";
import { get } from "https";

import { typeDefs } from "./schema";

const makeRequest = (options: RequestOptions) => new Promise((resolve, reject) => {
    get(options, (res) => {
        let result = "";
        res.on("data", (chunk) => result += chunk);
        res.on("end", () => resolve(JSON.parse(result)));
        res.on("error", (err) => reject(err));
    });
});

const transformKeyResult = (okr: any) => ({
    description: okr["Key Result"],
    priority: okr.Priority,
    score: okr.Score,
    status: okr.Status,
});

const transformOKR = (okrs: [any]) => okrs.reduce((accumulator: [any], okr) => {
    if (okr.Objective) {
        accumulator.push({
            keyResults: [transformKeyResult(okr)],
            title: okr.Objective,
        });
    } else {
        const prevOKR = accumulator[accumulator.length - 1].keyResults;
        prevOKR.push(transformKeyResult(okr));
    }
    return accumulator;
}, []);

const user = "btnqE34y9gpzaLumoSXC";
const psw = "63y2ES2DD7B8VDPqpX9eHWU6sfnsnYWJxAKPLtTR";
const auth = Buffer.alloc(`${user}:${psw}`.length, `${user}:${psw}`).toString("base64");

const getObjectives = () => makeRequest({
    headers: {
        Authorization: `Basic ${auth}`,
     },
    host: "sheetsu.com",
    method: "GET",
    path: "/apis/v1.0su/8779c0223ca5",
    port: 443,
}).then((okrs) => transformOKR(okrs as [any]));

// Resolvers define the technique for fetching the types in the
// schema.  We'll retrieve books from the "books" array above.
const resolvers = {
  Query: {
    // tslint:disable-next-line:no-console
    objectives: getObjectives,
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
