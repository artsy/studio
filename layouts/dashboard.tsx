import { Box } from "@artsy/palette";
import { BareHeader } from "../components/BareHeader";

const DashboardLayout = (page: JSX.Element, pageProps) => {
  return (
    <Box my={2} mx={2} height="100%">
      <BareHeader label={pageProps.title} message={pageProps.message} mb={3} />
      {page}
    </Box>
  );
};

export default DashboardLayout;
