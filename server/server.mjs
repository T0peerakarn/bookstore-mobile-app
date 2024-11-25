import { ApolloServer } from "@apollo/server";
import { startStandaloneServer } from "@apollo/server/standalone";

import dotenv from "dotenv";

import { typeDefs } from "./schema.js";
import { resolvers } from "./resolvers.js";
import { context } from "./context.js";

dotenv.config();

const server = new ApolloServer({
  typeDefs,
  resolvers,
});

startStandaloneServer(server, {
  listen: { port: 4000 },
  context,
}).then(({ url }) => console.log(`Server ready at ${url}`));
