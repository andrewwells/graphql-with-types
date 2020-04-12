import { Resolver, Mutation, Ctx } from "type-graphql";
import { AppContext } from "../../types/AppContext";

@Resolver()
export class LogoutResolver {
  @Mutation(() => Boolean)
  async logout(@Ctx() { req, res }: AppContext): Promise<Boolean> {
    return new Promise((resolve, reject) =>
      req.session!.destroy((err) => {
        if (err) {
          console.log(err);
          return reject(false);
        }
        res.clearCookie("sid");
        resolve(true);
      })
    );
  }
}
