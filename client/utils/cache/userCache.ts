import { User } from "@/lib/models/User";
import redis from "@/lib/redis/Redis";
import { IUser } from "@/types/schema/User";

export async function getUserByEmail(email: string): Promise<IUser | null> {

  const redisKey = `user:${email}`;

  const cached = await redis.get(redisKey);
  if (cached) {
    console.log("Cache Hit")
    return JSON.parse(cached);
  }
console.log("Cache Missed")


  const user = await User.findOne({ email: email });
  console.log("User", user)
  if (!user) return null;

  await redis.set(redisKey, JSON.stringify(user));

  return user;
}
