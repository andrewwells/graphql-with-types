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

const meQuery = `
query {
    me {
        id
        firstName
        lastName
        email
        name
    }
}
`;

describe("Me", () => {
  it("should not return user if not signed in", async () => {
    const response = await gCall({ source: meQuery });
    expect(response.data).toBeNull();
    expect(response.errors).not.toBeNull();
    expect(response.errors?.length).toEqual(1);
  });

  it("should return the user", async () => {
    const data = {
      firstName: faker.name.firstName(),
      lastName: faker.name.lastName(),
      email: faker.internet.email(),
      password: faker.internet.password(),
    };

    const user = await User.create(data).save();

    const response = await gCall({
      source: meQuery,
      userId: user.id,
    });

    expect(response).toMatchObject({
      data: {
        me: {
          id: `${user.id}`,
          firstName: user.firstName,
          lastName: user.lastName,
          email: user.email,
        },
      },
    });
  });
});
