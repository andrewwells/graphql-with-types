import { Resolver, Mutation, Arg, InputType, Field, Ctx } from "type-graphql";
import { User } from "../../entity/User";
import { redis } from "../../redis";
import { ForgotPasswordPrefix } from "../../constants/redisPrefixes";
import * as bcrypt from "bcryptjs";
import { AppContext } from "../../types/AppContext";
import { PasswordInput } from "./PasswordInput";

@InputType()
export class ChangePasswordInput extends PasswordInput {
  @Field()
  token: string;
}

@Resolver()
export class ChangePasswordResolver {
  @Mutation(() => Boolean)
  async changePassword(
    @Arg("input") { token, password }: ChangePasswordInput,
    @Ctx() ctx: AppContext
  ): Promise<Boolean> {
    const userId = await redis.get(ForgotPasswordPrefix + token);

    if (!userId) {
      return false;
    }

    const user = await User.findOne({ where: { id: userId } });
    if (!user) {
      return false;
    }

    user.password = await bcrypt.hash(password, 12);
    await Promise.all([user.save(), redis.del(ForgotPasswordPrefix + token)]);

    ctx.req.session!.userId = user.id;

    return true;
  }
}
