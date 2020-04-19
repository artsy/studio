import { PropsWithChildren } from "react";

export default (frontMatter: any) => {
  return ({ children }: PropsWithChildren<unknown>) => {
    return (
      <article>
        {frontMatter.title && <h1>{frontMatter.title}</h1>}
        {children}
      </article>
    );
  };
};
