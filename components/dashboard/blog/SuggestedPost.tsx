import { Sans, Flex } from "@artsy/palette";

type FlexProps = React.ComponentProps<typeof Flex>;

interface SuggestedPostCardProps extends FlexProps {
  title: string;
  suggestedBy: string;
}

export const SuggestedPost: React.FC<SuggestedPostCardProps> = ({
  title,
  suggestedBy,
  ...flexProps
}) => {
  return (
    <Flex flexDirection="column" {...flexProps}>
      <Sans size="3t">{title}</Sans>
      <Sans size="1" color="black60">
        by {suggestedBy}
      </Sans>
    </Flex>
  );
};
