"use client";
import { z } from "zod";
import AuthForm from "@/components/AuthForm";
import { signUp } from '@/app/actions/auth';
import { useState } from 'react';

const signupSchema = z.object({
  username: z.string().min(2, { message: "Username must be at least 2 characters." }),
  email: z.string().email({ message: "Enter a valid email." }),
  password: z.string().min(6, { message: "Password must be at least 6 characters." }),
});

export default function SignupPage() {
  const [errorMessage, setErrorMessage] = useState(null);

  const onSubmit = async (values) => {
    try {
      setErrorMessage(null);
      const formData = new FormData();
      formData.append('username', values.username);
      formData.append('email', values.email);
      formData.append('password', values.password);

      const result = await signUp(formData);

      if (result?.error) {
        setErrorMessage(result.error);
      }
      // If no error, the server action will handle the redirect
    } catch (error) {
      console.error('Signup submission error:', error);
      setErrorMessage('An unexpected error occurred. Please try again.');
    }
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
        <div className="text-red-500 text-center mt-4 max-w-md mx-auto">
          {errorMessage}
        </div>
      )}
    </>
  );
}
