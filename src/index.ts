import "reflect-metadata";
import { ApolloServer } from "apollo-server-express";
import * as Express from "express";
import { createConnection } from "typeorm";
import * as session from "express-session";
import * as connectRedis from "connect-redis";
import { redis } from "./redis";
import * as cors from "cors";
import { createSchema } from "./utils/createSchema";

const main = async () => {
  await createConnection();

  const schema = await createSchema();

  const apolloServer = new ApolloServer({
    schema,
    //formatError: formatArgumentValidationError,
    context: ({ req, res }) => ({ req, res }),
  });

  const app = Express();

  const RedisStore = connectRedis(session);

  app.use(cors({ credentials: true, origin: "http://localhost:3000" }));

  app.use(
    session({
      store: new RedisStore({ client: redis }),
      name: "sid",
      secret:
        (process.env.SESSION_SECRET as string) || "somerandomstupidsecret",
      resave: false,
      saveUninitialized: false,
      cookie: {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        maxAge: 1000 * 60 * 60 * 24 * 7, // 7 days
      },
    })
  );

  apolloServer.applyMiddleware({ app });
  app.listen(4000, () => {
    console.log("Server listening on http://localhost:4000/graphql");
  });
};

main();
