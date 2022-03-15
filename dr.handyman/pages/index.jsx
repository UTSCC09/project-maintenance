import AppLayout from 'components/layout/AppLayout';

import MaintainerList from 'components/homepage/maintainers';
import Posts from 'components/homepage/posts';
import { Box } from "@mui/system";
import { H3, Span,H5 } from 'components/Typography';
//import { ApolloClient, gql } from "@apollo/client";
// import { cache } from "./cache";

// const client = new ApolloClient({
//   cache,
//   uri: "http://localhost:4000/graphql"
// });

const IndexPage = props => {
  
  return <AppLayout>
     <MaintainerList /> 
     <H3 color="#2C2C2C" mb={2} ml={17}>See Recent Posts</H3>  
  <Posts />
    </AppLayout>;


};

//client.query({query: gql`query TestQuery {users}`})



export default IndexPage;