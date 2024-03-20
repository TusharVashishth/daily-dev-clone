import { LOGIN_URL } from "@/lib/apiEndPoints";
import myAxios from "@/lib/axios.config";
import axios, { AxiosResponse } from "axios";
import { AuthOptions, ISODateString, User } from "next-auth";
import { JWT } from "next-auth/jwt";
import CredentialsProvider from "next-auth/providers/credentials";

export interface CustomSession {
  user?: CustomUser;
  expires: ISODateString;
}
export interface CustomUser {
  id?: string | null;
  name?: string | null;
  email?: string | null;
  profile_image?: string | null;
  token?: string | null;
  created_at?: string | null;
  updated_at?: string | null;
}
export const authOptions: AuthOptions = {
  pages: {
    signIn: "/login",
  },
  callbacks: {
    async jwt({ token, user, trigger, session }) {
      // * When we update the session
      if (trigger === "update" && session?.profile_image) {
        const user: CustomUser = token.user as CustomUser;
        user.profile_image = session?.profile_image;
        console.log("The token is", token);
      }
      if (user) {
        token.user = user;
      }
      return token;
    },

    async session({
      session,
      token,
      user,
    }: {
      session: CustomSession;
      token: JWT;
      user: User;
    }) {
      session.user = token.user as CustomUser;
      return session;
    },
  },

  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: {},
        password: {},
      },
      async authorize(credentials, req) {
        const res = await myAxios.post(LOGIN_URL, credentials);
        const response = res.data;
        const user = response?.user;
        if (user) {
          return user;
        } else {
          return null;
        }
      },
    }),
  ],
};
