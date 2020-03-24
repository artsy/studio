import {
  ArtsyMarkIcon,
  Sans,
  Flex,
  FlexProps,
  Message,
  space
} from "@artsy/palette";
import styled from "styled-components";

const LOGO_SIZE = 36;

const HeaderMessage = styled(Message)`
  margin-top: -${space(2)}px;
  margin-right: -${space(2)}px;
  margin-bottom: -${space(1)}px;
`;

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
        <ArtsyMarkIcon width={LOGO_SIZE} height={LOGO_SIZE} />
        {label && (
          <Sans size={6} weight="medium" ml={2}>
            {label}
          </Sans>
        )}
      </Flex>
      {message && <HeaderMessage>{message}</HeaderMessage>}
    </Flex>
  );
};
