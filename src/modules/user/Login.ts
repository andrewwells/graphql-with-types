import { Resolver, Mutation, Arg, InputType, Field, Ctx } from "type-graphql";
import { User } from "../../entity/User";
import * as bcrypt from "bcryptjs";
import { IsEmail } from "class-validator";
import { AppContext } from "../../types/AppContext";

@InputType()
export class LoginInput {
  @Field()
  @IsEmail()
  email: string;

  @Field()
  password: string;
}

@Resolver(User)
export class LoginResolver {
  @Mutation(() => User, { nullable: true })
  async login(
    @Arg("input") { password, email }: LoginInput,
    @Ctx() ctx: AppContext
  ): Promise<User | null> {
    const user = await User.findOne({ where: { email } });
    if (!user) {
      return null;
    }

    const valid = await bcrypt.compare(password, user.password);
    if (!valid) {
      return null;
    }

    if (!user.confirmed) {
      throw Error("user not confirmed");
    }

    ctx.req.session!.userId = user.id;

    return user;
  }
}
