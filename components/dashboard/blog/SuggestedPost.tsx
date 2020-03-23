import { Sans, Flex, color } from "@artsy/palette";
import styled from "styled-components";

type FlexProps = React.ComponentProps<typeof Flex>;

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
