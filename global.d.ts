import { ERole } from "@/models/common";
import NextAuth, { DefaultSession } from "next-auth"
import { JWT } from "next-auth/jwt"

declare global {
  namespace NodeJS {
    export interface ProcessEnv {
      BACKEND_URL: string;
      JWT_SECRET_KEY: string;
      JWT_REFRESH_TOKEN: string
    }
  }
}

declare module "next-auth" {
  /**
   * Returned by `useSession`, `getSession` and received as a prop on the `SessionProvider` React Context
   */
  interface Session {
    user: IUSer
    accessToken: string
    refreshToken: string;
    expiresIn: number;
    role: ERole
  }
}

declare module "next-auth/jwt" {
  /** Returned by the `jwt` callback and `getToken`, when using JWT sessions */
  interface JWT {
    /** OpenID ID Token */
    accessToken: string;
    refreshToken: string;
    student: IUSer;
    admin: IUSer,
    teacher: IUSer;
    expiresIn: number;
    role: ERole
  }
}

interface IUSer {
  _id: string;
  email: string;
  name: string;
  createdAt: Date,
  updatedAt: Date
}