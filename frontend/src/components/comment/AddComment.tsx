"use client";
import React, { useState, useEffect } from "react";
import { Textarea } from "../ui/textarea";
import myAxios from "@/lib/axios.config";
import { COMMENT_URL } from "@/lib/apiEndPoints";
import { toast } from "react-toastify";
import { Button } from "../ui/button";
import { useSession } from "next-auth/react";
import { CustomSession } from "@/app/api/auth/[...nextauth]/authOptions";

import UserAvatar from "../common/UserAvatar";
import CommentCard from "./CommentCard";
export default function AddComment({ post_id }: { post_id: number }) {
  const [comment, setComment] = useState("");
  const [loading, setLoading] = useState(false);
  const [showBox, setShowBox] = useState(false);
  const { data } = useSession();
  const [comments, setComments] = useState<APIResponseType<CommentType>>();
  const customSession = data as CustomSession;
  const [errors, setErrors] = useState({
    comment: [],
  });
  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    setLoading(true);
    const payload = {
      comment,
      post_id: post_id,
    };
    myAxios
      .post(COMMENT_URL, payload, {
        headers: {
          Authorization: `Bearer ${customSession.user?.token}`,
        },
      })
      .then((res) => {
        setLoading(false);
        const response = res.data;
        setComment("");
        toast.success("Commented successfully!");
        setComments((prevState) => {
          if (prevState) {
            if (prevState?.data.length === 0) {
              return {
                ...prevState,
                data: [response.comment],
              };
            } else
              return {
                ...prevState,
                data: [response.comment, ...prevState!.data],
              };
          }
        });
      })
      .catch((err) => {
        setLoading(false);
        if (err.response?.status == 422) {
          setErrors(err.response?.data?.errors);
        } else {
          toast.error("Something went wrong.please try again!");
        }
      });
  };

  useEffect(() => {
    fetchComments();
  }, []);

  const fetchComments = () => {
    myAxios
      .get(`${COMMENT_URL}?post_id=${post_id}`, {
        headers: {
          Authorization: `Bearer ${customSession.user?.token}`,
        },
      })
      .then((res) => {
        setComments(res.data);
      })
      .catch((err) => {
        toast.error("Something went wrong.while fetching comments");
      });
  };
  return (
    <div>
      <div className="my-4">
        {showBox ? (
          <form onSubmit={handleSubmit}>
            <div className="mb-2">
              <Textarea
                placeholder="Type your thoughts"
                value={comment}
                onChange={(e) => setComment(e.target.value)}
              />
              <span className="text-red-400">{errors.comment?.[0]}</span>
            </div>
            <div className="mb-2 flex justify-end">
              <Button disabled={loading}>
                {" "}
                {loading ? "Processing.." : "Submit"}{" "}
              </Button>
            </div>
          </form>
        ) : (
          <div
            className="border rounded-md flex justify-between items-center p-4 cursor-pointer"
            onClick={() => setShowBox(true)}
          >
            <div className="flex space-x-4 items-center">
              <UserAvatar
                image={customSession.user?.profile_image ?? undefined}
              />
              <p className="text-muted-foreground text-sm">
                Share your thoughts
              </p>
            </div>
            <Button variant="outline">Post</Button>
          </div>
        )}
      </div>

      <div className="my-4">
        {comments?.data &&
          comments.data.length > 0 &&
          comments.data.map((item, index) => (
            <CommentCard comment={item} key={index} />
          ))}
      </div>
    </div>
  );
}
