import type { ElementType, ComponentPropsWithoutRef, ReactNode } from "react";
import type { TypographyVariantProps } from "./typography.styles";

export type TypographyProps<E extends ElementType = "p"> = {
  as?: E;
  children: ReactNode;
  className?: string;
} & TypographyVariantProps &
  Omit<ComponentPropsWithoutRef<E>, "as" | "color">;
