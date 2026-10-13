"use client";
import { useContext } from "react";
import { Box } from "@mui/material";
import { usePathname, useRouter } from "next/navigation";
import { ManagerContext } from "@/components/contexts/ManagerContext";
import { DeviceContext } from "@/components/contexts/DeviceContext";
import TitleTextNavSimpleStyle from "@/components/navs/ManagerNav";
import MainNav from "@/components/navs/MainNav";
import ManagerAuthGate from "@/components/layouts/components/ManagerAuthGate";
import BackButton from "@/components/buttons/BackButton";
import {
  MAIN_PT_MOBILE,
  MAIN_PT_DESKTOP,
} from "@/components/layouts/constants/layout_constants";

/**
 * Core page shell: nav, back button, and page content.
 * Uses MainNav for public pages, TitleTextNavSimpleStyle for manager.
 *
 * A back button is shown on every DETAIL page (any path with ≥ 2 segments,
 * e.g. /artworks/xyz, /exhibitions/abc, /news/foo, /artworks/archive) and it
 * navigates to the PARENT page (上一级): /artworks/xyz → /artworks, etc.
 */
export default function LayoutMainContent({ children, showBackButton, isMobile, backgroundColor }) {
  const { isManager } = useContext(ManagerContext);
  // MainNav uses the drawer (and hides the desktop nav row) on mobile + tablet.
  const { isTablet } = useContext(DeviceContext);

  const pathname = usePathname() || "";
  const router = useRouter();

  // MainNav includes its own spacer — only add extra pt for manager nav
  const pt = isManager ? (isMobile ? MAIN_PT_MOBILE : MAIN_PT_DESKTOP) : 0;

  const navSlot = isManager ? (
    <Box sx={{ position: "relative", zIndex: 1100 }} style={{ background: "transparent" }}>
      <TitleTextNavSimpleStyle />
    </Box>
  ) : (
    <Box sx={{ position: "relative", zIndex: 1100 }} style={{ background: "transparent" }}>
      <MainNav />
    </Box>
  );

  // A detail page = anything below the first segment (≥ 2 segments).
  // The archive page renders its OWN back button inline in its header, so the
  // generic one is suppressed there.
  const segments = pathname.split("/").filter(Boolean);
  const isDetailPage = segments.length >= 2 && pathname !== "/artworks/archive";

  const goToParent = () => {
    const parent = "/" + segments.slice(0, -1).join("/");
    router.push(parent === "/" ? "/" : parent);
  };

  const backRow =
    showBackButton && isDetailPage ? (
      <div
        style={{
          display: "flex",
          justifyContent: "flex-start",
          padding: isMobile ? "0 16px" : "0 40px",
          marginTop: 8,
          marginBottom: 18,
        }}
      >
        <BackButton onClick={goToParent} />
      </div>
    ) : null;

  const content = (
    <>
      {navSlot}

      {backRow}

      <Box
        component="main"
        sx={{
          flexGrow: 1,
          width: "100%",
          overflowY: "auto",
          // The footer now sits in normal flow at the end of the page (it
          // reveals on scroll), so no bottom reserve is needed here.
          pb: 0,
          pt,
          minWidth: 0,
          position: "relative",
        }}
        style={{ backgroundColor, background: backgroundColor }}
      >
        {children}
      </Box>
    </>
  );

  if (isManager) {
    return <ManagerAuthGate>{content}</ManagerAuthGate>;
  }

  return content;
}
