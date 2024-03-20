"use client";
import React, { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Link as LinkIcon } from "lucide-react";
import { Label } from "../ui/label";
import { Input } from "../ui/input";
import { isValidUrl } from "@/lib/utils";
import axios from "axios";
import { Textarea } from "../ui/textarea";
import Image from "next/image";
import { toast } from "react-toastify";
import { Button } from "../ui/button";
import { POST_URL } from "@/lib/apiEndPoints";
import myAxios from "@/lib/axios.config";
import { useSession } from "next-auth/react";
import { CustomSession } from "@/app/api/auth/[...nextauth]/authOptions";

export default function AddPost() {
  const { data } = useSession();
  const userSession = data as CustomSession;
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [postState, setPostState] = useState<PostStateType>({
    title: "",
    url: "",
    description: "",
    image_url: "",
  });
  const [errors, setErrors] = useState({
    title: [],
    url: [],
    description: [],
  });

  const loadPreview = async () => {
    if (isValidUrl(postState.url!)) {
      setLoading(true);
      axios
        .post("/api/image-preview", { url: postState.url })
        .then(async (res) => {
          setLoading(false);
          const response: ImagePreviewResType = res.data?.data;
          const img = response.images.length
            ? response.images[0]
            : "https://images.unsplash.com/photo-1707343848655-a196bfe88861?q=80&w=3540&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDF8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D";

          setPostState({
            ...postState,
            image_url: img,
            title: response.title,
            description: response.description ?? "",
          });
        })
        .catch((err) => {
          setLoading(false);
          toast.error("Something went wrong while fetching data from url!");
        });
    }
  };

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    setLoading(true);
    myAxios
      .post(POST_URL, postState, {
        headers: {
          Authorization: `Bearer ${userSession.user?.token}`,
        },
      })
      .then((res) => {
        setLoading(false);
        setPostState({});
        setOpen(false);
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

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <div
          className="flex space-x-3 items-center mb-4 cursor-pointer"
          onClick={() => setOpen(true)}
        >
          <LinkIcon className="w-5 h-5" />
          <p>Submit article</p>
        </div>
      </DialogTrigger>
      <DialogContent
        onInteractOutside={(e) => e.preventDefault()}
        className="overflow-y-scroll max-h-screen"
      >
        <DialogHeader>
          <DialogTitle>Add Post</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit}>
          {postState.image_url && (
            <Image
              src={postState?.image_url}
              width={400}
              height={300}
              className="object-contain w-full rounded-xl my-2"
              alt="preview_img"
            />
          )}
          <div className="mb-2">
            <Label htmlFor="link">Link</Label>
            <Input
              id="link"
              type="url"
              placeholder="Enter your link"
              value={postState.url}
              onChange={(e) =>
                setPostState({ ...postState, url: e.target.value })
              }
              onBlur={() => loadPreview()}
            />
            <span className="text-xs text-yellow-400">
              Make sure you put correct URL
            </span>
            <div>
              <span className="text-red-400">{errors.url?.[0]}</span>
            </div>
          </div>
          <div className="mb-2">
            <Label htmlFor="title">Title</Label>
            <Input
              id="title"
              placeholder="Enter your title.."
              value={postState.title}
              onChange={(e) =>
                setPostState({ ...postState, title: e.target.value })
              }
            />
            <span className="text-red-400">{errors.title?.[0]}</span>
          </div>
          <div className="mb-2">
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              placeholder="Enter your description.."
              value={postState.description}
              rows={10}
              onChange={(e) =>
                setPostState({ ...postState, description: e.target.value })
              }
            />
            <span className="text-red-400">{errors.description?.[0]}</span>
          </div>
          <div className="mb-2">
            <Button className="w-full" disabled={loading}>
              {loading ? "Processing.." : "Submit"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
