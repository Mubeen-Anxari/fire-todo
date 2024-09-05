"use client";
import { GoogleAuthProvider, signInWithPopup } from "firebase/auth";
import React from "react";
import { auth } from "../firebaseConfig";
import { useRouter } from "next/navigation";
import { useUser } from "@/app/context/userContext";

export default function SignUp() {
  const useContext = useUser();
  console.log(useContext, "useContext");
  const router = useRouter();
  const onclick = async () => {
    try {
      const provider = new GoogleAuthProvider();
      const result = await signInWithPopup(auth, provider);
      const user = result.user;
      console.log(user, "User login with google");
      if (user) {
        router.push("/addData");
      }
    } catch (error) {
      console.log(error);
    }
  };
  return (
    <div>
      <button onClick={onclick} className="bg-white shadow-xl font-bold">
        Sign up with google
      </button>
    </div>
  );
}
