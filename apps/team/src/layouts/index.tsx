import { Layout } from "../pages/_layout";
import { H1 } from "@artsy-studio/components";
import { PropsWithChildren } from "react";

const TeamMDXLayout = (frontMatter: any) => {
  return ({ children }: PropsWithChildren<unknown>) => (
    <Layout {...frontMatter} mdx={true}>
      <>
        <H1>{frontMatter.title}</H1>
        {children}
      </>
    </Layout>
  );
};

export default TeamMDXLayout;
