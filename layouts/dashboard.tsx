import { Layout } from "pages/dashboard/_layout";

const DashboardMDXLayout = (frontMatter) => {
  return ({ children }) => <Layout {...frontMatter}>{children}</Layout>;
};

export default DashboardMDXLayout;
