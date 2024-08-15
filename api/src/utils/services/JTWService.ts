import { sign, SignOptions, verify as verifyJWT } from 'jsonwebtoken';
import { IPayload } from '../../types';

const make = (
  payload: IPayload,
  secret: string,
  expiresIn?: SignOptions['expiresIn'],
) => {
  const token = sign(payload, secret, { expiresIn });
  return token;
};

const verify = (
  token: string,
  secret: string,
): 'INVALID_TOKEN' | IPayload => {
  try {
    const decoded = verifyJWT(token, secret);
    if (typeof decoded === 'string') return 'INVALID_TOKEN';

    return decoded as IPayload;
  } catch (error) {
    return 'INVALID_TOKEN';
  }
};

export const JWTService = {
  make,
  verify,
};
