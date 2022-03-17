import AppLayout from 'components/layout/AppLayout';

import MaintainerList from 'components/homepage/maintainers';
import Posts from 'components/homepage/posts';

const IndexPage = props => {
  return (
    <AppLayout>
      <MaintainerList />
      <Posts />
    </AppLayout>
  );
};

//client.query({query: gql`query TestQuery {users}`})

export default IndexPage;