import { Button } from "@mantine/core";
import { MouseEventHandler } from "react";

type RButtonProps = {
  label: string;
  onClick: MouseEventHandler<HTMLButtonElement | undefined>;
  loading?: boolean;
  fullWidth?: boolean;
  disabled?: boolean;
};

export default function NButton({
  label,
  onClick,
  loading,
  disabled,
  fullWidth = false,
}: RButtonProps) {

  return (
    <>
      {
        <Button
          onClick={onClick}
          loading={loading}
          fullWidth={fullWidth}
          className="n-button"
          disabled={disabled}
        >
          {label}
        </Button>
      }
    </>
  );
}
