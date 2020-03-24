import TeamLayout from "./team";
import { H1 } from "../components/Typography";

export default frontMatter => {
  return ({ children }) =>
    TeamLayout(
      <>
        <H1>{frontMatter.title}</H1>
        {children}
      </>,
      { ...frontMatter, mdx: true }
    );
};
