const { createServer } = require("http");
const express = require("express");
const { ApolloServer } = require("apollo-server-express");
const { ApolloServerPluginDrainHttpServer } = require("apollo-server-core");
const { makeExecutableSchema } = require("@graphql-tools/schema");
const { WebSocketServer } = require("ws");
const { useServer } = require("graphql-ws/lib/use/ws");

const { typeDefs } = require("./src/types");
const { resolvers } = require("./src/resolvers");

const PORT = 4000;

// Create schema, which will be used separately by ApolloServer and
// the WebSocket server.
const schema = makeExecutableSchema({ typeDefs, resolvers });

// Create an Express app and HTTP server; we will attach the WebSocket
// server and the ApolloServer to this HTTP server.
const app = express();
const httpServer = createServer(app);

// Set up WebSocket server.
const wsServer = new WebSocketServer({
  server: httpServer,
  path: "/graphql",
});
const serverCleanup = useServer(
  {
    schema,
    onConnect: async (ctx) => {
      // Check authentication every time a client connects.
      //   if (tokenIsNotValid(ctx.connectionParams)) {
      //     // You can return false to close the connection  or throw an explicit error
      //     throw new Error("Auth token missing!");
      //   }
    },
  },
  wsServer
);

// Set up ApolloServer.
const server = new ApolloServer({
  schema,
  context: ({ req }) => {
    return { token: req.headers.authorization || "" };
  },
  plugins: [
    // Proper shutdown for the HTTP server.
    ApolloServerPluginDrainHttpServer({ httpServer }),

    // Proper shutdown for the WebSocket server.
    {
      async serverWillStart() {
        return {
          async drainServer() {
            await serverCleanup.dispose();
          },
        };
      },
    },
  ],
});

const init = async () => {
  await server.start();
  server.applyMiddleware({ app });

  // Now that our HTTP server is fully set up, actually listen.
  httpServer.listen(PORT, () => {
    console.log(
      `🚀 Query endpoint ready at http://localhost:${PORT}${server.graphqlPath}`
    );
    console.log(
      `🚀 Subscription endpoint ready at ws://localhost:${PORT}${server.graphqlPath}`
    );
  });

//   httpServer.on("request", ({ headers }) => {
//     console.log("REQUEST", headers);
//   });
};

init();
