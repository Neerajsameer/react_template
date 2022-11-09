import { Tag } from "antd";
import { CSSProperties } from "react";

type LoanStatusProps = {
    title: string;
    styles?: CSSProperties | undefined;
    canStrikeThrough?: boolean;
};

export default function NBadge({ title, styles, canStrikeThrough }: LoanStatusProps) {
    return (
        <Tag
            style={{
                fontStyle: "normal",
                fontWeight: "500",
                fontSize: "12px",
                lineHeight: "20px",
                padding: "1px 8px",
                textDecoration: canStrikeThrough ? "line-through" : "none",
                borderRadius: "4px",
                border: "none",
                color: getBadgeTextColor(title).color,
                background: getBadgeTextColor(title).background,
                ...styles,
            }}
        >
            {title}
        </Tag>
    );
}

export function getBadgeTextColor(status: string) {
    let color;
    let background;
    switch (status) {
        case "Appreciation":
            color = "#00a651";
            background = "#e6f6ee";
            break;
        case "Complaint":
            color = "#F5222D";
            background = "#FFF1F0";
            break;

    }
    return { color, background };
}
