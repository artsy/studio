import { Serif, Sans } from "@artsy/palette";

export const H1 = ({ children, ...props }) => (
  <Serif size="10" element="h1" my={3} {...props}>
    {children}
  </Serif>
);

export const H2 = ({ children, ...props }) => (
  <Sans size="8" element="h2" mt={2} {...props}>
    {children}
  </Sans>
);

export const P = ({ children, ...props }) => (
  <Sans size="3" element="p" {...props}>
    {children}
  </Sans>
);
