import { forwardRef } from "react";
import type { ReactElement, Ref, RefAttributes } from "react";

/**
 * Retypes React.forwardRef so it preserves generic type parameters.
 * React's built-in forwardRef signature isn't generic-aware, which breaks
 * polymorphic (`as` prop) components — this restores proper inference.
 */
export const fixedForwardRef = forwardRef as <T, P = {}>(
  render: (props: P, ref: Ref<T>) => ReactElement | null
) => (props: P & RefAttributes<T>) => ReactElement | null;
