import { Flex, Sans, color, Tabs, Tab, space } from "@artsy/palette";
import styled from "styled-components";
import { BlogSuggestionInput } from "../../components/dashboard/blog/BlogSuggestionInput";
import { SuggestedPost } from "../../components/dashboard/blog/SuggestedPost";

export async function getServerSideProps() {
  return { props: { title: "Artsy Engineering Blog" } };
}

const OutlinedSection = styled(Flex)`
  border: 1px solid ${color("black10")};
  flex-direction: column;
  height: 100%;
  width: 100%;
  margin-right: ${space(1)}px;
  padding: ${space(2)}px;
`;

const suggestedPosts = [
  {
    title: "Introducing Studio, Artsy's developer portal",
    suggestedBy: "Justin"
  }
];

const Blog = () => {
  return (
    <Flex justifyContent="stretch" height="100%">
      <OutlinedSection>
        <BlogSuggestionInput />
        <Sans size="5" mt={2} mb={1}>
          Suggested Posts
        </Sans>
        {suggestedPosts.map((post, index) => {
          return (
            <SuggestedPost
              key={index}
              title={post.title}
              suggestedBy={post.suggestedBy}
              mb={1}
            />
          );
        })}
      </OutlinedSection>
      <OutlinedSection>
        <Tabs>
          <Tab name="Drafts" />
          <Tab name="Published" />
        </Tabs>
      </OutlinedSection>
    </Flex>
  );
};

export default Blog;
