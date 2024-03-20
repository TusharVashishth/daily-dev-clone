"use client";
import React, { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import Image from "next/image";
import AddComment from "../comment/AddComment";

export default function ShowPost({
  children,
  post,
}: {
  children: React.ReactNode;
  post: PostApiType;
}) {
  const [open, setOpen] = useState(false);
  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <div>{children}</div>
      </DialogTrigger>
      <DialogContent className="min-w-[700px] max-h-screen overflow-y-scroll">
        <DialogHeader>
          <DialogTitle>Show Post</DialogTitle>
        </DialogHeader>
        <div>
          <h1 className="text-3xl font-bold">{post.title}</h1>
          <Image
            src={post.image_url}
            width={400}
            height={400}
            alt="post_ing"
            className="w-full rounded-lg my-2"
          />
          <p>{post.description ?? ""}</p>

          <AddComment post_id={post.id} />
        </div>
      </DialogContent>
    </Dialog>
  );
}
