import jwt from 'jsonwebtoken';
import { Request } from 'express';

const secret = process.env.JWT_SECRET || 'mysecretsshhhhh';
const expiration = '2h';

interface AuthPayload {
  _id: string;
  email: string;
  username: string;
}

export function signToken({ username, email, _id }: AuthPayload) {
  const payload = { username, email, _id };

  return jwt.sign({ data: payload }, secret, { expiresIn: expiration });
}

export function authMiddleware({ req }: { req: Request & { user?: AuthPayload } }) {
  let token = req.body.token || req.query.token || req.headers.authorization;

  if (req.headers.authorization) {
    token = token.split(' ').pop()?.trim();
  }

  if (!token) {
    return req;
  }

  try {
    const { data } = jwt.verify(token, secret) as { data: AuthPayload };
    req.user = data;
  } catch {
    console.log('Invalid token');
  }

  return req;
}

export function contextMiddleware({ req }: { req: any }) {
  const request = authMiddleware({ req });
  return { user: request.user };
}

