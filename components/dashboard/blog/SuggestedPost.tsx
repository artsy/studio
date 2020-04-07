import { Sans, Flex, FlexProps, color } from "@artsy/palette";
import styled from "styled-components";

interface SuggestedPostCardProps extends FlexProps {
  title: string;
  suggestedBy: string;
}

const Card = styled(Flex)`
  transition: all 250ms;
  &:hover {
    background-color: ${color("black5")};
  }
`;

export const SuggestedPost: React.FC<SuggestedPostCardProps> = ({
  title,
  suggestedBy,
  ...flexProps
}) => {
  return (
    <Card flexDirection="column" {...flexProps} p={1} ml={-1}>
      <Sans size="3t">{title}</Sans>
      <Sans size="1" color="black60">
        1 day ago by {suggestedBy}
      </Sans>
    </Card>
  );
};
