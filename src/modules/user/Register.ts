import { Resolver, Query, Mutation, Arg } from "type-graphql";
import { User } from "../../entity/User";
import * as bcrypt from "bcryptjs";
import { RegisterInput } from "./RegisterInput";
import { sendMail } from "../../utils/sendMail";
import { createConfirmationUrl } from "../../utils/createConfirmationUrl";

@Resolver(User)
export class RegisterResolver {
  @Query(() => String)
  async hello() {
    return "Hello world!";
  }

  @Mutation(() => User)
  async register(
    @Arg("input") { firstName, lastName, password, email }: RegisterInput
  ): Promise<User> {
    const hashedPassword = await bcrypt.hash(password, 10);
    const user = await User.create({
      firstName,
      lastName,
      email,
      password: hashedPassword,
    }).save();

    await sendMail(user.email, await createConfirmationUrl(user.id));

    return user;
  }
}
