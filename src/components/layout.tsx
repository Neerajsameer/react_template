import { Divider, Text } from "@mantine/core";
import { useLocalStorage, useViewportSize } from "@mantine/hooks";
import { IconArrowLeft, IconMenu2 } from "@tabler/icons";
import { useEffect } from "react";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "../components/navbar";

export default function NLayout({ children, title, backLink }: { children: React.ReactNode, title: string, backLink?: string }) {
    const [showNav, setShowNav] = useLocalStorage({ key: "show_nav", defaultValue: true });
    const navigate = useNavigate();

    const { width } = useViewportSize();

    useEffect(() => {
        if (width > 600) setShowNav(true);
        else setShowNav(false);
    }, [width]);

    return <>
        <div style={{ display: "flex", width: "100vw", height: "100vh", overflow: "none" }}>
            {showNav ? <Navbar /> : null}
            <div style={{ display: "flex", flexDirection: "column", width: "100%", overflowX: "scroll" }}>
                <div style={{ gap: "10px", height: "60px", display: 'flex', alignItems: 'center', padding: "15px" }}>
                    {!backLink ? null : <IconArrowLeft style={{ cursor: "pointer" }} onClick={() => navigate(backLink)} />}
                    <IconMenu2 style={{ cursor: "pointer" }} onClick={() => setShowNav(!showNav)} />
                    <Text size={20} weight={"bold"}>{title}</Text>
                </div>
                <Divider h={10} mx={20} />
                <div style={{ padding: "10px 30px", height: "100%", overflowY: "scroll" }}>
                    {children}

                </div>
            </div>
        </div>
    </>
}
