import { Suspense } from "react";
import LoginForm from "./LoginForm";

export const metadata = { title: "Sign in | Import with Goody", robots: { index: false } };

export default function LoginPage() {
  return (
    <main className="flex min-h-screen items-center justify-center bg-cream px-5 py-12">
      <Suspense>
        <LoginForm />
      </Suspense>
    </main>
  );
}