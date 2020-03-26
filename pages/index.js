import Head from "next/head";
import { ArtsyLogoBlackIcon, Flex, Spacer, Sans } from "@artsy/palette";
import { H1 } from "../components/Typography";

const Home = () => (
  <div className="container">
    <Head>
      <title>Artsy Studio</title>
      <link rel="icon" href="/favicon.ico" />
    </Head>

    <Flex flexDirection="column" alignItems="center">
      <Flex alignItems="center" justifyContent="center" mt={12}>
        <ArtsyLogoBlackIcon scale={1.75} mr={1} />
        <H1 mb={1}>Studio</H1>
      </Flex>
      <Flex justifyContent="center" alignItems="center">
        <Sans size={3}>Every artist needs a studio.&nbsp;</Sans>
        <Sans size={3}>This is ours.</Sans>
      </Flex>
    </Flex>
  </div>
);

export default Home;
