import * as React from "react";
import type { LucideIcon } from "../../lib/icons";

import { Button, type ButtonProps } from "./button";

type IconButtonProps = ButtonProps & {
  icon: LucideIcon;
  label: string;
};

export function IconButton({ icon: Icon, label, ...props }: IconButtonProps) {
  return (
    <Button aria-label={label} {...props}>
      <Icon className="h-4 w-4" />
      <span className="sr-only">{label}</span>
    </Button>
  );
}
