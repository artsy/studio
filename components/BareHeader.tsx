import { ArtsyMarkIcon, Sans, Flex } from "@artsy/palette";

type FlexProps = React.ComponentProps<typeof Flex>;

const size = 36;

interface BareHeaderProps {
  label?: string;
}

export const BareHeader: React.FC<BareHeaderProps & FlexProps> = ({
  label,
  ...flexProps
}) => {
  return (
    <Flex alignItems="center" {...flexProps}>
      <ArtsyMarkIcon width={size} height={size} />
      {label && (
        <Sans size={6} weight="medium" ml={1}>
          {label}
        </Sans>
      )}
    </Flex>
  );
};
