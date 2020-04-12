import { Resolver, Mutation, Arg } from "type-graphql";
import { User } from "../../entity/User";
import { redis } from "../../redis";
import { confirmEmailPrefix } from "../../constants/redisPrefixes";

@Resolver()
export class ConfirmEmailResolver {
  @Mutation(() => Boolean)
  async confirmEmail(@Arg("token") token: string): Promise<Boolean> {
    const userId = (await redis.get(confirmEmailPrefix + token)) as any;
    if (!userId) {
      return false;
    }
    const updateUser = User.update({ id: userId }, { confirmed: true });
    const removeToken = redis.del(token);
    await Promise.all([updateUser, removeToken]);
    return true;
  }
}
