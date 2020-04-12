import { Resolver, Query, Ctx, Authorized } from "type-graphql";
import { User } from "../../entity/User";
import { AppContext } from "../../types/AppContext";

@Resolver(User)
export class MeResolver {
  @Authorized()
  @Query(() => User)
  async me(@Ctx() { req }: AppContext): Promise<User> {
    const user = await User.findOne(req.session!.userId);
    if (!user) {
      throw Error("not authenticated");
    }
    return user;
  }
}
