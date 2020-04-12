import { testConn } from "../../test/testConn";
import { Connection } from "typeorm";
import { gCall } from "../../test/gCall";
import * as faker from "faker";
import { User } from "../../entity/User";

let conn: Connection;
beforeAll(async () => {
  conn = await testConn();
});

afterAll(async () => {
  await conn.close();
});

const registrationMutation = `
mutation Register($input: RegisterInput!) {
    register(input: $input) {
        id
        firstName
        lastName
        email
        name
    }
}
`;

describe("Register", () => {
  it("should create a user", async () => {
    const user = {
      firstName: faker.name.firstName(),
      lastName: faker.name.lastName(),
      email: faker.internet.email(),
      password: faker.internet.password(),
    };

    const response = await gCall({
      source: registrationMutation,
      variableValues: {
        input: user,
      },
    });

    expect(response).toMatchObject({
      data: {
        register: {
          firstName: user.firstName,
          lastName: user.lastName,
          email: user.email,
        },
      },
    });

    const dbUser = await User.findOne({ where: { email: user.email } });
    expect(dbUser).toBeDefined();
    expect(dbUser!.confirmed).toBeFalsy();
  });
});
