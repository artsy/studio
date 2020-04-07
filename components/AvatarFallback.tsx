import { Flex, color, UserSingleIcon } from "@artsy/palette";

export const AvatarFallback = ({ diameter }) => (
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
      height={parseInt(diameter) - 20}
      width={parseInt(diameter) - 20}
    />
  </Flex>
);
