import React from "react";
import UserAvatar from "../common/UserAvatar";
import { formatDate } from "@/lib/utils";

export default function CommentCard({ comment }: { comment: CommentType }) {
  return (
    <div className="p-2 border rounded-2xl mb-4">
      <div className="flex space-x-4 items-center">
        <UserAvatar image={comment.user.profile_image} />
        <div>
          <p>{comment.user.name}</p>
          <p className="text-muted-foreground text-sm">
            @{comment.user.username} . {formatDate(comment.created_at)}
          </p>
        </div>
      </div>
      <p className="pl-2 pt-2">{comment.comment}</p>
    </div>
  );
}
