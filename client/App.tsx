import { ApolloClient, ApolloProvider, InMemoryCache } from "@apollo/client";
import { SharedStateProvider } from "./utility/sharedState";
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
      <SharedStateProvider>
        <RootComponent />
      </SharedStateProvider>
    </ApolloProvider>
  );
};

export default App;
