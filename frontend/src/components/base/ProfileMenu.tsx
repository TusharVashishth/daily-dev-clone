"use client";
import React, { useState } from "react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import Image from "next/image";
import { Button } from "../ui/button";
import { DialogClose } from "@radix-ui/react-dialog";
import { signOut, useSession } from "next-auth/react";
import { Label } from "../ui/label";
import { Input } from "../ui/input";
import myAxios from "@/lib/axios.config";
import { LOGOUT_URL, UPDATE_PROFILE } from "@/lib/apiEndPoints";
import { CustomUser } from "@/app/api/auth/[...nextauth]/authOptions";
import { toast } from "react-toastify";
import { getImageUrl } from "@/lib/utils";

export default function ProfileMenu({ user }: { user: CustomUser }) {
  const [logoutOpen, setLogOutOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);
  const [image, setImage] = useState<File | null>(null);
  const [errors, setErrors] = useState({
    profile_image: [],
  });
  const [loading, setLoading] = useState(false);
  const { update } = useSession();

  const handleImageChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setImage(file);
    }
  };
  const logoutUser = async () => {
    myAxios
      .post(
        LOGOUT_URL,
        {},
        {
          headers: {
            Authorization: `Bearer ${user.token}`,
          },
        }
      )
      .then((res) => {
        signOut({
          callbackUrl: "/login",
          redirect: true,
        });
      })
      .catch((err) => {
        toast.error("Something went wrong.Please try again!");
      });
  };

  const updateProfile = (event: React.FormEvent) => {
    event.preventDefault();
    setLoading(true);
    const formData = new FormData();
    formData.append("profile_image", image ?? "");
    myAxios
      .post(UPDATE_PROFILE, formData, {
        headers: {
          Authorization: "Bearer " + user.token,
        },
      })
      .then((res) => {
        const response = res.data;
        setLoading(false);
        update({ profile_image: response.image });
        toast.success("Profile image updated successfully!");
        setProfileOpen(false);
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
    <>
      {/* Logout dialog */}
      <Dialog open={logoutOpen} onOpenChange={setLogOutOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Are you absolutely sure?</DialogTitle>
            <DialogDescription>
              This action expire your session and you have to login back to
              access your dashboard.
            </DialogDescription>
          </DialogHeader>
          <div className="flex justify-end space-x-4">
            <Button variant="destructive" onClick={logoutUser}>
              Yes Logout!
            </Button>
            <DialogClose>
              <Button>Cancel</Button>
            </DialogClose>
          </div>
        </DialogContent>
      </Dialog>

      {/* Profile Image update  */}
      <Dialog open={profileOpen} onOpenChange={setProfileOpen}>
        <DialogContent onInteractOutside={(e) => e.preventDefault()}>
          <DialogHeader>
            <DialogTitle>Change profile</DialogTitle>
          </DialogHeader>
          <form onSubmit={updateProfile}>
            <div className="mb-2">
              <Label htmlFor="profile">Profile Image</Label>
              <Input
                type="file"
                onChange={handleImageChange}
                className="file:text-white"
                accept="image/png,image/svg,image/jpeg,image/webp"
              />
              <span className="text-red-400">{errors.profile_image?.[0]}</span>
            </div>
            <div className="mb-2">
              <Button className="w-full" disabled={loading}>
                {" "}
                {loading ? "Processing.." : "Update Profile"}
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>

      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          {user.profile_image ? (
            <Image
              src={getImageUrl(user.profile_image)}
              width={40}
              height={40}
              alt="logo"
            />
          ) : (
            <Image
              src="/avatar.png"
              width={40}
              height={40}
              alt="logo"
              className="cursor-pointer"
            />
          )}
        </DropdownMenuTrigger>
        <DropdownMenuContent>
          <DropdownMenuLabel>My Account</DropdownMenuLabel>
          <DropdownMenuSeparator />
          <DropdownMenuItem onClick={() => setProfileOpen(true)}>
            Profile
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => setLogOutOpen(true)}>
            Logout
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </>
  );
}
