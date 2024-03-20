"use client";
import React, { useEffect } from "react";
import PostCard from "./PostCard";
import { useImmer } from "use-immer";

import { CustomUser } from "@/app/api/auth/[...nextauth]/authOptions";
import { toast } from "react-toastify";
import ShowPost from "./ShowPost";
import { laraEcho } from "@/lib/echo.config";

export default function Posts({
  data,
  user,
}: {
  data: APIResponseType<PostApiType>;
  user: CustomUser;
}) {
  const [posts, setPosts] = useImmer<APIResponseType<PostApiType>>(data);

  useEffect(() => {
    console.log("the user is ", user);

    laraEcho
      .channel("post-broadcast")
      .listen("PostBroadCastEvent", (event: any) => {
        console.log("The event is", event?.post);
        const post: PostApiType = event.post;
        // Without immer
        // setPosts((prevPosts) => {
        //   return {
        //     ...prevPosts,
        //     data: [post, ...prevPosts.data],
        //   };
        // });
        setPosts((posts) => {
          posts.data = [post, ...posts.data];
        });
        toast.success("New Post added!!");
      })
      .listen("CommentIncrement", (event: any) => {
        setPosts((posts) => {
          const index = posts.data.findIndex(
            (item) => item.id === event.post_id
          );
          if (index !== -1) {
            posts.data[index].comment_count += 1;
          }
        });
      });

    // * Comment channel

    return () => {
      laraEcho.leave("post-broadcast");
    };
  }, []);
  return (
    <div className="pt-4 pl-2 grid grid-cols-1  md:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4 gap-4 max-h-screen">
      {posts.data.length > 0 &&
        posts.data.map((item, index) => (
          <ShowPost post={item} key={index}>
            <PostCard post={item} key={index} />
          </ShowPost>
        ))}
    </div>
  );
}
