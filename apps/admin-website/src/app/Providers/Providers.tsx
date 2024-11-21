"use client";
import React, { ReactNode } from "react";
import { SessionProvider } from "next-auth/react";
import { Toaster } from "sonner";

export const Providers = ({ children }: { children: ReactNode }) => {
  return (
    <>
      <Toaster closeButton position="top-center" richColors duration={800} />
      <SessionProvider>{children}</SessionProvider>
    </>
  );
};
