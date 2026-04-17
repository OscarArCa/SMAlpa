import { SignOptions } from "jsonwebtoken";

if (!process.env.JWT_SECRET) {
  throw new Error("JWT_SECRET is not defined in environment variables");
}

export const JWT_CONFIG: {
  secret: string;
  expiresIn: SignOptions["expiresIn"];
} = {
  secret: process.env.JWT_SECRET,
  expiresIn: "1d"
};

