import { Box, Flex } from "@artsy/palette";
import { BareHeader } from "../components/BareHeader";
import { Sidebar } from "../components/dashboard/Sidebar";

const DashboardLayout = (page: JSX.Element, pageProps) => {
  return (
    <Box my={2} mx={2} height="100%">
      <BareHeader label={pageProps.title} message={pageProps.message} />
      <Flex pt={2}>
        <Sidebar />
        <Box width="100%" height="100%">
          {page}
        </Box>
      </Flex>
    </Box>
  );
};

export default DashboardLayout;
