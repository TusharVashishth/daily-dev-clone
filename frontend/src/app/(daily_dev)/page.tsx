import React from "react";
import { getServerSession } from "next-auth";
import {
  CustomSession,
  authOptions,
} from "../api/auth/[...nextauth]/authOptions";
import { getPosts } from "@/dataFetch/postFetch";
import Posts from "@/components/post/Posts";

export default async function App() {
  const session = (await getServerSession(authOptions)) as CustomSession;
  const posts: APIResponseType<PostApiType> = await getPosts(
    session.user?.token!
  );
  return (
    <div>
      <Posts data={posts} user={session.user!} />
    </div>
  );
}
