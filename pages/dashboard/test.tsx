export async function getServerSideProps() {
  return {
    props: {
      title: "Artsy Test Page"
    }
  };
}

const Test = () => {
  return <h1>Hello world</h1>;
};

export default Test;
