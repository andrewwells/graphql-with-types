import { buildSchema } from "type-graphql";

export const createSchema = async () =>
  buildSchema({
    resolvers: [__dirname + "/../modules/**/*.resolver.ts"],
    authChecker: ({ root, args, context, info }, roles) => {
      console.log(root, args, info, roles);
      return context.req.session.userId != null;
    },
  });
