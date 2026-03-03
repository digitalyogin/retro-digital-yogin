import React from "react";
import { useShuffleOnView } from "@/hooks/useShuffleOnView";
import type { ShuffleEffect6Options } from "@/lib/typeShuffle/types";
import { useUserPreferences } from "@/hooks/useUserPreferences";

export type ShuffleTextProps = {
  as?: keyof HTMLElementTagNameMap;
  text: string;
  once?: boolean;
  threshold?: number;
  className?: string;
  effectOptions?: ShuffleEffect6Options;
  disabled?: boolean;
};

export const ShuffleText = ({
  as = "span",
  text,
  once = true,
  threshold = 0.2,
  className,
  effectOptions,
  disabled = false,
}: ShuffleTextProps) => {
  const { preferences } = useUserPreferences();
  const shouldDisable = disabled || !preferences.motionEnabled;
  const { elementRef } = useShuffleOnView(text, {
    once,
    threshold,
    disabled: shouldDisable,
    effectOptions,
  });
  const Component = as as React.ElementType;

  return (
    <Component ref={elementRef} className={className}>
      {text}
    </Component>
  );
};
