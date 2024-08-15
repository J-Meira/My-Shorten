import { compare, genSalt, hash } from 'bcryptjs';

const SALT_RANDOMS = 8;

const make = async (value: string) => {
  const salt = await genSalt(SALT_RANDOMS);

  return await hash(value, salt);
};

const verify = async (value: string, hashValue: string) => {
  return await compare(value, hashValue);
};

export const HashService = {
  make,
  verify,
};
