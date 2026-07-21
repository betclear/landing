import { Suspense } from "react";
import { notFound, redirect } from "next/navigation";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { Container } from "@/components/ui/Container";
import { SignInForm } from "@/components/auth/SignInForm";
import { getAuthUser } from "@/lib/auth/user";
import { isSupabaseAuthConfigured } from "@/lib/supabase/config";
import { isAppLocale, type AppLocale } from "@/lib/i18n/config";
import { getDictionary } from "@/lib/i18n/dictionaries";
import { buildPageMetadata } from "@/lib/i18n/metadata";
import { hasLocalePrefix, localizePath } from "@/lib/i18n/routing";

type PageProps = {
  params: Promise<{ locale: string }>;
  searchParams: Promise<{ next?: string }>;
};

export async function generateMetadata({ params }: PageProps) {
  const { locale: raw } = await params;
  if (!isAppLocale(raw)) return {};
  const locale = raw as AppLocale;
  const dict = getDictionary(locale);

  return buildPageMetadata(locale, {
    path: "/login",
    title: dict.meta.loginTitle,
    description: dict.meta.loginDescription,
  });
}

function safeNextPath(value: string | undefined, locale: AppLocale): string {
  if (!value || !value.startsWith("/") || value.startsWith("//")) {
    return localizePath(locale, "/pricing");
  }
  if (hasLocalePrefix(value)) {
    return value;
  }
  return localizePath(locale, value);
}

export default async function LoginPage({ params, searchParams }: PageProps) {
  const { locale: raw } = await params;
  if (!isAppLocale(raw)) notFound();
  const locale = raw as AppLocale;
  const dict = getDictionary(locale);

  if (!isSupabaseAuthConfigured()) {
    redirect(localizePath(locale, "/pricing"));
  }

  const { next } = await searchParams;
  const nextPath = safeNextPath(next, locale);
  const user = await getAuthUser();

  if (user) {
    redirect(nextPath);
  }

  return (
    <>
      <Header />
      <main className="py-16 sm:py-24">
        <Container className="max-w-md">
          <p className="text-sm font-medium text-primary">{dict.login.eyebrow}</p>
          <h1 className="mt-2 text-4xl font-semibold tracking-[-0.04em] text-foreground">
            {dict.login.title}
          </h1>
          <p className="mt-4 text-base leading-relaxed text-muted-foreground">
            {dict.login.description}
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
