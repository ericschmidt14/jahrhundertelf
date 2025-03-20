"use client";
import { Button } from "@mantine/core";
import { IconBrandWindows } from "@tabler/icons-react";
import { signIn } from "next-auth/react";
import CoMo from "./como";
import Logo from "./logo";

export default function Login() {
  return (
    <div className="min-w-screen min-h-screen flex justify-center items-center bg-[length:300%_300%] bg-gradient-to-r from-[#b3193e] via-[#aa1124] via-30% to-[#220407] bg-right">
      <div className="relative z-50 px-16 py-8 flex flex-col items-center gap-8 bg-black/50 backdrop-blur-md shadow-2xl shadow-black/60">
        <Logo />
        <Button
          color="red"
          onClick={() => signIn("azure-ad")}
          leftSection={<IconBrandWindows size={16} />}
          fullWidth
        >
          Mit Azure AD anmelden
        </Button>
        <CoMo />
      </div>
    </div>
  );
}
