"use client";

import { z } from "zod";
import { useState } from "react";
import { useRouter } from "next/navigation";
import AuthForm from "@/components/AuthForm";
import { signUp } from "@/app/actions/auth";

const signupSchema = z.object({
  username: z.string().min(2),
  email: z.string().email(),
  password: z.string().min(6),
});

export default function SignupPage() {
  const [errorMessage, setErrorMessage] = useState(null);
  const router = useRouter();

  const onSubmit = async (values) => {
    setErrorMessage(null);

    const formData = new FormData();
    formData.append("username", values.username);
    formData.append("email", values.email);
    formData.append("password", values.password);

    const result = await signUp(formData);

    if (result?.error) {
      setErrorMessage(result.error);
      return;
    }

    // ✅ SAME AS LOGIN
    router.replace("/dashboard");
  };

  return (
    <>
      <AuthForm
        formSchema={signupSchema}
        defaultValues={{ username: "", email: "", password: "" }}
        onSubmit={onSubmit}
        isSignup
      />

      {errorMessage && (
        <p className="text-red-500 text-center mt-4">
          {errorMessage}
        </p>
      )}
    </>
  );
}
