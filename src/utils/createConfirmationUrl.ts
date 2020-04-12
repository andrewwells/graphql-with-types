import { v4 } from "uuid";
import { redis } from "../redis";
import { confirmEmailPrefix } from "../constants/redisPrefixes";

export const createConfirmationUrl = async (userId: number) => {
  const token = v4();
  await redis.set(confirmEmailPrefix + token, userId, "ex", 60 * 60 * 24); // 1 day expiration
  return `http://localhost3000/user/confirm-email/${token};`;
};
