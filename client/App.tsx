import { ApolloClient, ApolloProvider, InMemoryCache } from "@apollo/client";

import RootComponent from "./component/RootComponent";

const client = new ApolloClient({
  uri: "http://localhost:4000",
  cache: new InMemoryCache({
    addTypename: false,
  }),
});

const App = () => {
  return (
    <ApolloProvider client={client}>
      <RootComponent />
    </ApolloProvider>
  );
};

export default App;
