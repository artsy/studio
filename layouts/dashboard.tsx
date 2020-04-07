import { Box, Flex } from "@artsy/palette";
import { BareHeader } from "../components/BareHeader";
import { Sidebar } from "../components/dashboard/Sidebar";

const DashboardLayout = ({ children, ...props }) => {
  return (
    <Box my={2} mx={2} height="100%">
      <BareHeader label={props.title} message={props.message} />
      <Flex pt={2}>
        <Sidebar />
        <Box width="100%" height="100%">
          {children}
        </Box>
      </Flex>
    </Box>
  );
};

export default DashboardLayout;
