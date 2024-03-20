import Image from "next/image";
import React from "react";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import Login from "@/components/auth/Login";
import Register from "@/components/auth/Register";

export default function login() {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-2">
      <div className="hidden lg:flex justify-center items-center h-screen">
        <Image
          src="/auth_img.svg"
          width={500}
          height={500}
          alt="auth_img"
          className="w-full object-contain"
        />
      </div>
      <div className="h-screen flex justify-center items-center flex-col">
        <div className="flex flex-col justify-start items-start mb-6 w-full md:w-[500px] px-4">
          <Image src="/logo.svg" width={150} height={150} alt="logo" />
          <h1 className="text-cabbage font-bold text-2xl md:text-3xl mt-2 ">
            Where developers suffer together
          </h1>
        </div>
        <Tabs defaultValue="login" className="w-full px-4 md:w-[500px]">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="login">Login</TabsTrigger>
            <TabsTrigger value="register">Register</TabsTrigger>
          </TabsList>
          <Login />
          <Register />
        </Tabs>
      </div>
    </div>
  );
}
