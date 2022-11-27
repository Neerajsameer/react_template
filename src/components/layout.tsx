import { Divider, Text } from "@mantine/core";
import { useLocalStorage, useViewportSize } from "@mantine/hooks";
import { IconArrowLeft, IconMenu2 } from "@tabler/icons";
import { useEffect } from "react";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "../components/navbar";

export default function NLayout({
  children,
  title,
  backLink,
  noPadding = false,
}: {
  children: React.ReactNode;
  title: string;
  backLink?: string;
  noPadding?: boolean;
}) {
  const [showNav, setShowNav] = useLocalStorage({ key: "show_nav", defaultValue: true });
  const navigate = useNavigate();

  const { width } = useViewportSize();

  useEffect(() => {
    if (width === 0) return;

    if (window.location.pathname.includes("map_view")) setShowNav(false);
    else {
      if (width > 600) setShowNav(true);
      else setShowNav(false);
    }
  }, [width]);

  return (
    <>
      <div style={{ display: "flex", width: "100vw", height: "100vh", overflow: "none", background: "#f9f9f9" }}>
        {showNav ? <Navbar onClose={() => setShowNav(false)} /> : null}
        <div
          style={{
            marginLeft: width > 600 && showNav ? "250px" : "0px",
            display: "flex",
            flexDirection: "column",
            width: "100%",
            overflowX: "scroll",
          }}
        >
          <div style={{ gap: "10px", height: "60px", display: "flex", alignItems: "center", padding: "15px" }}>
            {!backLink ? null : <IconArrowLeft style={{ cursor: "pointer" }} onClick={() => navigate(backLink)} />}
            {!showNav && <IconMenu2 style={{ cursor: "pointer" }} onClick={() => setShowNav(!showNav)} />}
            <Text size={20} weight={"bold"}>
              {title}
            </Text>
          </div>
          <Divider h={10} mx={20} />
          <div style={{ padding: noPadding ? "0px" : "10px 30px", height: "100%", overflowY: "scroll" }}>
            {children}
          </div>
        </div>
      </div>
    </>
  );
}
