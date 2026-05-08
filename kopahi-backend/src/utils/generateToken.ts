import jwt, { SignOptions } from "jsonwebtoken";

type TokenSubject = { id: string | { toString(): string }; role: string };

const generateToken = (user: TokenSubject, expiresIn?: string): string => {
  const secret = process.env.JWT_SECRET;
  if (!secret) throw new Error("JWT_SECRET is not configured");

  const options: SignOptions = {
    expiresIn: (expiresIn ?? process.env.JWT_EXPIRES_IN ?? "30d") as SignOptions["expiresIn"],
  };

  return jwt.sign({ id: String(user.id), role: user.role }, secret, options);
};

export default generateToken;
