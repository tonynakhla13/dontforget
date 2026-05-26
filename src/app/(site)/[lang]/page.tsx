import { cookies } from "next/headers";
import { redirect, notFound } from "next/navigation";
import { THEME_COOKIE, isLocale, isTheme } from "@/i18n/config";
import { getDictionary } from "@/i18n/get-dictionary";
import { themeHome } from "@/lib/site-routing";
import ThemePicker from "@/components/site/ThemePicker";

export default async function LocaleLanding({ params }: { params: Promise<{ lang: string }> }) {
  const { lang } = await params;
  if (!isLocale(lang)) notFound();
  const stored = (await cookies()).get(THEME_COOKIE)?.value;
  if (stored && isTheme(stored)) redirect(themeHome(lang, stored));
  const dictionary = await getDictionary(lang);
  return <ThemePicker locale={lang} copy={dictionary.onboarding} />;
}
