import { Serif, Sans, SerifProps, SansProps } from "@artsy/palette";
import React, { FC } from "react";

type SerifPreset = Omit<SerifProps, "size" | "element">;
type SansPreset = Omit<SansProps, "size" | "element">;

export const H1: FC<SerifPreset> = ({ children, ...props }) => (
  <Serif size="10" element="h1" my={3} {...props}>
    {children}
  </Serif>
);

export const H2: FC<SansPreset> = ({ children, ...props }) => (
  <Sans size="8" element="h2" mt={2} {...props}>
    {children}
  </Sans>
);

export const P: FC<SansPreset> = ({ children, ...props }) => (
  <Sans size="3" element="p" {...props}>
    {children}
  </Sans>
);
