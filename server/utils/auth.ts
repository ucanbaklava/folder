import { createUser, getUserByEmail } from "./db";

export const uuid = () => crypto.randomUUID();

export const createOrGetUser = async ({
  name,
  email,
  avatar,
  provider,
  email_verified,
}: UserParams) => {
  if (!email) {
    throw new Error(`${provider} account must have an email address`);
  }
  if (!email_verified) {
    throw new Error(`${provider} account must have a verified email address`);
  }
  const existingUser = await getUserByEmail(email);
  if (existingUser) {
    return existingUser;
  } else {
    const newUser: CreateUserType = {
      id: uuid(),
      name,
      email,
      avatar,
      provider,
      createdAt: new Date(),
    };
    await createUser(newUser);
    return newUser;
  }
};
