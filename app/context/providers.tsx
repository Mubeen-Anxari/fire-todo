"use client";
import React from "react";
import { UserContextProvider } from "./userContext";
export default function Providers({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return <UserContextProvider>{children}</UserContextProvider>;
}
