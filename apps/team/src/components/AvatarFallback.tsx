import { Flex, color, UserSingleIcon } from "@artsy/palette";
import React, { FC } from "react";

interface AvatarFallbackProps {
  diameter: number | string;
}
export const AvatarFallback: FC<AvatarFallbackProps> = ({ diameter }) => {
  return (
    <Flex
      width={diameter}
      height={diameter}
      borderRadius={diameter}
      background={color("black10")}
      alignItems="center"
      justifyContent="center"
    >
      <UserSingleIcon
        fill="black30"
        height={parseInt(diameter as string) - 20}
        width={parseInt(diameter as string) - 20}
      />
    </Flex>
  );
};
