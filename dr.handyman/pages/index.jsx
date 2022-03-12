import AppLayout from 'components/layout/AppLayout';

import MaintainerList from './maintainers';
import Posts from './posts';
import { Box } from "@mui/system";

import { ApolloClient, gql } from "@apollo/client";
import { cache } from "./cache";

const client = new ApolloClient({
  cache,
  uri: "http://localhost:4000/graphql"
});

const IndexPage = props => {
  
  return <AppLayout>
     <MaintainerList />   
  <Posts />
    </AppLayout>;


};

client.query({query: gql`query TestQuery {users}`})



export default IndexPage;