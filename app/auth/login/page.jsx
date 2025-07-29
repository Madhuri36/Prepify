// app/auth/login/page.js
"use client";
import { z } from "zod";
import AuthForm from "@/components/AuthForm";
import { signIn } from '@/app/actions/auth';
import { useState } from 'react';

const loginSchema = z.object({
  email: z.string().email({ message: "Enter a valid email." }),
  password: z.string().min(6, { message: "Password must be at least 6 characters." }),
});

export default function LoginPage() {
  const [errorMessage, setErrorMessage] = useState(null);

  const onSubmit = async (values) => {
    try {
      setErrorMessage(null);
      const formData = new FormData();
      formData.append('email', values.email);
      formData.append('password', values.password);

      const result = await signIn(formData);

      if (result?.error) {
        setErrorMessage(result.error);
      }
    } catch (error) {
      console.error('Login submission error:', error);
      setErrorMessage('An unexpected error occurred. Please try again.');
    }
  };

  return (
    <>
      <AuthForm
        formSchema={loginSchema}
        defaultValues={{ email: "", password: "" }}
        onSubmit={onSubmit}
      />
      {errorMessage && (
        <div className="text-red-500 text-center mt-4">
          {errorMessage}
        </div>
      )}
    </>
  );
}