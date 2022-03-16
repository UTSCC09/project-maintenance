import AppLayout from 'components/layout/AppLayout';

import MaintainerList from 'components/homepage/maintainers';
import Posts from 'components/homepage/posts';
import { Box } from "@mui/system";

import {
  ApolloClient,
  InMemoryCache,
  ApolloProvider,
  HttpLink,
  from,
} from "@apollo/client";

const link = from([
  new HttpLink({ uri: "https://localhost:3000/graphql" }),
]);

const client = new ApolloClient({
  cache: new InMemoryCache(),
  link: link,
});

const IndexPage = props => {
  
  return (
  <ApolloProvider client={client}>
    <AppLayout>
      <MaintainerList />   
      <Posts />
    </AppLayout>
  </ApolloProvider>);


};

//client.query({query: gql`query TestQuery {users}`})



export default IndexPage;