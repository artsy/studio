import { Layout } from "pages/team/_layout";
import { H1 } from "components/Typography";

const TeamMDXLayout = (frontMatter) => {
  return ({ children }) => (
    <Layout {...frontMatter} mdx={true}>
      <>
        <H1>{frontMatter.title}</H1>
        {children}
      </>
    </Layout>
  );
};

export default TeamMDXLayout;
