import { LocaleProvider } from "@/components/i18n/LocaleProvider";
import { getDictionary } from "@/lib/i18n/dictionaries";

/**
 * The blog is a single, English-language section served at the top-level
 * `/blog` path (outside the `[locale]` tree) so URLs stay clean and there is a
 * single canonical version per post. It still renders the shared Header/Footer,
 * which depend on LocaleProvider, so we provide the English locale here.
 */
export default function BlogLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <LocaleProvider locale="en" dictionary={getDictionary("en")}>
      {children}
    </LocaleProvider>
  );
}
