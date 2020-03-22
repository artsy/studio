import { ArtsyMarkIcon, Sans, Flex, Message } from "@artsy/palette";

type FlexProps = React.ComponentProps<typeof Flex>;

const size = 36;

interface BareHeaderProps extends FlexProps {
  label?: string;
  message?: string;
}

export const BareHeader: React.FC<BareHeaderProps> = ({
  label,
  message,
  ...flexProps
}) => {
  return (
    <Flex {...flexProps} justifyContent="space-between">
      <Flex alignItems="center">
        <ArtsyMarkIcon width={size} height={size} />
        {label && (
          <Sans size={6} weight="medium" ml={1}>
            {label}
          </Sans>
        )}
      </Flex>
      {message && <Message>{message}</Message>}
    </Flex>
  );
};
