import { cva, type VariantProps } from "class-variance-authority";

export const buttonStyles = cva("btn-base", {
  variants: {
    variant: {
      primary: "btn-primary",
      secondary: "btn-secondary",
      tertiary: "btn-tertiary",
      outline: "btn-outline",
      ghost: "btn-ghost",
    },
    size: {
      sm: "btn-sm",
      md: "btn-md",
      lg: "btn-lg",
      "icon-sm": "btn-icon-sm",
      "icon-md": "btn-icon-md",
    },
    fullWidth: {
      true: "w-full",
    },
  },
  defaultVariants: {
    variant: "primary",
    size: "md",
  },
});

export type ButtonVariantProps = VariantProps<typeof buttonStyles>;
