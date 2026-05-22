"use client";

import { useEffect, useState } from "react";
import { useThemeStore } from "@/lib/themeStore";
import HomeFocused from "./HomeFocused";
import HomeCreative from "./HomeCreative";
import HomeImmersive from "./HomeImmersive";
import ThemeOnboarding from "@/components/ui/ThemeOnboarding";
import ThemeSwitcher from "@/components/ui/ThemeSwitcher";

export default function HomeThemeClient() {
  const { theme, hasChosen, initializeTheme } = useThemeStore();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    initializeTheme();
    setMounted(true);
  }, [initializeTheme]);

  if (!mounted) {
    return null;
  }

  const renderHomepage = () => {
    switch (theme) {
      case "focused":
        return <HomeFocused />;
      case "creative":
        return <HomeCreative />;
      case "immersive":
        return <HomeImmersive />;
      default:
        return <HomeCreative />;
    }
  };

  return (
    <>
      {!hasChosen && <ThemeOnboarding />}
      {renderHomepage()}
      <ThemeSwitcher />
    </>
  );
}
