import type { Metadata } from "next";
import { Suspense } from "react";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { Container } from "@/components/ui/Container";
import { SignInForm } from "@/components/auth/SignInForm";
import { getAuthUser } from "@/lib/auth/user";
import { isSupabaseAuthConfigured } from "@/lib/supabase/config";
import { redirect } from "next/navigation";

export const metadata: Metadata = {
  title: "Sign In",
  description: "Sign in to BetClear before subscribing or installing protection.",
};

type PageProps = {
  searchParams: Promise<{ next?: string }>;
};

function safeNextPath(value: string | undefined): string {
  if (!value || !value.startsWith("/") || value.startsWith("//")) {
    return "/pricing";
  }
  return value;
}

export default async function LoginPage({ searchParams }: PageProps) {
  if (!isSupabaseAuthConfigured()) {
    redirect("/pricing");
  }

  const { next } = await searchParams;
  const nextPath = safeNextPath(next);
  const user = await getAuthUser();

  if (user) {
    redirect(nextPath);
  }

  return (
    <>
      <Header />
      <main className="py-16 sm:py-24">
        <Container className="max-w-md">
          <p className="text-sm font-medium text-primary">Account</p>
          <h1 className="mt-2 text-4xl font-semibold tracking-[-0.04em] text-foreground">
            Sign in first
          </h1>
          <p className="mt-4 text-base leading-relaxed text-muted-foreground">
            Sign in with Google or email before checkout. Use the same account
            on install — on iPhone, complete sign-in in Safari to download your
            protection profile.
          </p>

          <Suspense fallback={null}>
            <SignInForm nextPath={nextPath} />
          </Suspense>
        </Container>
      </main>
      <Footer />
    </>
  );
}
