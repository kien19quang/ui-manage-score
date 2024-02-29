import NextAuth, { NextAuthOptions } from "next-auth"
import FacebookProvider from "next-auth/providers/facebook"
import { Provider } from "next-auth/providers/index"
import Credentials from 'next-auth/providers/credentials';
import dayjs from "dayjs";
import UserService from "@/services/UserService";
import { ERole } from "@/models/common";


const providers: Provider[] = [
  FacebookProvider({
    clientId: process.env.FACEBOOK_CLIENT_ID || "",
    clientSecret: process.env.FACEBOOK_CLIENT_SECRET || "",
    authorization: {
      params: {
        scope: 'public_profile read_insights',
      },
    },
    id: 'facebook',
  }),
  Credentials({
    id: 'credentials',
    name: 'Credentials',
    credentials: {
      email: {
        label: 'Email',
        type: 'text'
      },
      password: {
        label: 'Password',
        type: 'passord'
      }
    },
    authorize: async (credentials: Record<"email" | "password", string> | undefined, req) => {
      if (!credentials?.email || !credentials?.password) {
        throw new Error('Email and password required');
      }

      if ((credentials as any)?.role === ERole.admin) {
        const admin = await UserService.loginAdmin({ email: credentials.email, password: credentials.password }) 
        return admin
      }
      else if ((credentials as any)?.role === ERole.teacher) {
        const teacher = await UserService.loginTeacher({ email: credentials.email, password: credentials.password })
        return teacher
      }
      
      const user = await UserService.loginStudent({ email: credentials.email, password: credentials.password })

      return user
    },
  })
]

export const authOptions: NextAuthOptions = {
  providers,
  callbacks: {
    jwt: async({token, user}) => {
      if (user) {
        return {...token, ...user}
      }

      if (dayjs().valueOf() > token.expiresIn && token.refreshToken) {
        return await UserService.refreshTokenAdmin(token)
      }

      return token
    },
    session: async({session, token}) => {
      session.accessToken = token.accessToken
      session.user = token.role === ERole.student ? token.student : token.role === ERole.admin ? token.admin : token.teacher;
      session.expiresIn = token.expiresIn;
      session.role = token.role;
      return session;
    },
  },
  pages: {
    signIn: '/auth/signin',
    error: '/_error'
  },
  logger: {
    error(code, metadata) {
      console.log(code, metadata)
    },
    warn(code) {
      console.log(code)
    },
    debug(code, metadata) {
      console.log(code, metadata)
    },
  },
  debug: process.env.NODE_ENV === 'development',
  secret: process.env.JWT_SECRET_KEY
}

export default NextAuth(authOptions)