import { Flex, Sans, color, Tabs, Tab, space } from "@artsy/palette";
import styled from "styled-components";
import { BlogSuggestionInput } from "../../components/dashboard/blog/BlogSuggestionInput";
import { SuggestedPost } from "../../components/dashboard/blog/SuggestedPost";

export async function getServerSideProps() {
  return {
    props: {
      title: "Artsy Engineering Blog",
      message: "Writing office hours are on Tuesday at 2:30"
    }
  };
}

const OutlinedSection = styled(Flex)`
  flex-direction: column;
  height: 100%;
  width: 100%;
  /* padding: ${space(2)}px; */
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
      <OutlinedSection border="1px solid black10" mr={2}>
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
