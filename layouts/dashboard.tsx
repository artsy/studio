import { Layout } from "pages/dashboard/_layout";

export default (frontMatter) => {
  return ({ children }) => <Layout {...frontMatter}>{children}</Layout>;
};
