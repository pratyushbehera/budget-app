import React, { forwardRef, type ElementType, type Ref } from "react";
import { typographyStyles, defaultElementMap } from "./typography.styles";
import type { TypographyProps } from "./typography.types";
import { fixedForwardRef } from "../utils/fixed-forward-ref";

type TypographyComponent = <E extends ElementType = "p">(
  props: TypographyProps<E> & { ref?: Ref<Element> }
) => React.ReactElement | null;

export const Typography = fixedForwardRef(function Typography<
  E extends ElementType = "p"
>(
  {
    as,
    variant = "body1",
    align,
    truncate,
    className = "",
    children,
    ...rest
  }: TypographyProps<E>,
  ref: Ref<Element>
) {
  const Component = as || defaultElementMap[variant ?? "body1"] || "p";

  return (
    <Component
      ref={ref}
      className={`${typographyStyles({
        variant,
        align,
        truncate,
      })} ${className}`}
      {...rest}
    >
      {children}
    </Component>
  );
}) as TypographyComponent;
