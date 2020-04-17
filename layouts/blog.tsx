import React from "react";

export default frontMatter => {
  return ({ children }) => {
    return (
      <article>
        <h1>{frontMatter.title}</h1>
        {children}
      </article>
    );
  };
};
