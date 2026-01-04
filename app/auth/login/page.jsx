"use client";

import { z } from "zod";
import { useState } from "react";
import { useRouter } from "next/navigation";
import AuthForm from "@/components/AuthForm";
import { signIn } from "@/app/actions/auth";

const loginSchema = z.object({
  email: z.string().email("Enter a valid email"),
  password: z.string().min(6, "Password must be at least 6 characters"),
});

export default function LoginPage() {
  const [errorMessage, setErrorMessage] = useState(null);
  const router = useRouter();

  const onSubmit = async (values) => {
    setErrorMessage(null);

    const formData = new FormData();
    formData.append("email", values.email);
    formData.append("password", values.password);

    const result = await signIn(formData);

    if (result?.error) {
      setErrorMessage(result.error);
      return;
    }

    // ✅ THIS IS REQUIRED
    router.replace("/dashboard");
  };

  return (
    <>
      <AuthForm
        formSchema={loginSchema}
        defaultValues={{ email: "", password: "" }}
        onSubmit={onSubmit}
      />

      {errorMessage && (
        <p className="text-red-500 text-center mt-4">
          {errorMessage}
        </p>
      )}
    </>
  );
}
