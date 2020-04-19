import { Layout } from "../pages/_layout";
import { PropsWithChildren } from "react";

const DashboardMDXLayout = (frontMatter: any) => {
  return ({ children }: PropsWithChildren<unknown>) => (
    <Layout {...frontMatter}>{children}</Layout>
  );
};

export default DashboardMDXLayout;
