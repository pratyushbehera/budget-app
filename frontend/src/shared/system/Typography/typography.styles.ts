import { cva, type VariantProps } from "class-variance-authority";

export const typographyStyles = cva("", {
  variants: {
    variant: {
      h1: "text-h1",
      h2: "text-h2",
      h3: "text-h3",
      h4: "text-h4",
      h5: "text-h5",
      h6: "text-h6",
      subtitle1: "text-subtitle1",
      subtitle2: "text-subtitle2",
      body1: "text-body1",
      body2: "text-body2",
      caption: "text-caption",
      overline: "text-overline",
      label: "text-label",
    },
    align: {
      left: "text-left",
      center: "text-center",
      right: "text-right",
    },
    truncate: {
      true: "truncate",
    },
  },
  defaultVariants: {
    variant: "body1",
    align: "left",
  },
});

export type TypographyVariantProps = VariantProps<typeof typographyStyles>;

/** Default HTML tag rendered per variant, when no `as` prop is passed */
export const defaultElementMap: Record<
  NonNullable<TypographyVariantProps["variant"]>,
  keyof JSX.IntrinsicElements
> = {
  h1: "h1",
  h2: "h2",
  h3: "h3",
  h4: "h4",
  h5: "h5",
  h6: "h6",
  subtitle1: "p",
  subtitle2: "p",
  body1: "p",
  body2: "p",
  caption: "span",
  overline: "span",
  label: "label",
};
