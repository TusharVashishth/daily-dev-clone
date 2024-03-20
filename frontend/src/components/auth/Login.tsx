"use client";
import React, { useState } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { TabsContent } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { CHECK_CREDENTIALS } from "@/lib/apiEndPoints";
import { signIn } from "next-auth/react";
import { toast } from "react-toastify";
import myAxios from "@/lib/axios.config";

export default function Login() {
  const [authState, setAuthState] = useState({
    email: "",
    password: "",
  });
  const [errors, setErrors] = useState({
    email: [],
    password: [],
  });
  const [loading, setLoading] = useState(false);

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    setLoading(true);
    myAxios
      .post(CHECK_CREDENTIALS, authState)
      .then((res) => {
        const response = res.data;
        setLoading(false);
        if (response?.status == 200) {
          signIn("credentials", {
            email: authState.email,
            password: authState.password,
            redirect: true,
            callbackUrl: "/",
          });
        } else if (response?.status == 401) {
          toast.error(response?.message);
        }
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
    <TabsContent value="login">
      <Card>
        <CardHeader>
          <CardTitle>Login</CardTitle>
          <CardDescription>Welcome back to Daily Dev.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-2">
          <form onSubmit={handleSubmit}>
            <div className="space-y-1">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                name="email"
                type="email"
                placeholder="Type here.."
                value={authState.email}
                onChange={(e) =>
                  setAuthState({ ...authState, email: e.target.value })
                }
              />
              <span className="text-red-500">{errors?.email?.[0]}</span>
            </div>
            <div className="space-y-1">
              <Label htmlFor="password">Password</Label>
              <Input
                id="password"
                type="password"
                name="password"
                placeholder="Type here.."
                value={authState.password}
                onChange={(e) =>
                  setAuthState({ ...authState, password: e.target.value })
                }
              />
              <span className="text-red-500">{errors?.password?.[0]}</span>
            </div>
            <div className="mt-4">
              <Button className="w-full" disabled={loading}>
                {loading ? "Processing.." : "Login"}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </TabsContent>
  );
}
