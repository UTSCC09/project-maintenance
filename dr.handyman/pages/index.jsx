import AppLayout from 'components/layout/AppLayout';

import MaintainerList from 'components/homepage/maintainers';
import Posts from 'components/homepage/posts';
import { useSelector, useDispatch } from 'react-redux';
import { useEffect } from 'react';
import { GET_USER_DATA } from '../src/GraphQL/Queries';
import { useLazyQuery } from '@apollo/client';
import { UPDATE_USER_DATA } from '../src/store/constants'

const IndexPage = props => {
  const userData = useSelector(state => state.userData);
  const dispatch = useDispatch();
  const [fetchUserData] = useLazyQuery(GET_USER_DATA);
  useEffect(() => {
    if (!userData.isLogin) {
      fetchUserData().then(res => {
        if (res.data && res.data.currentUser) {
          dispatch({
            type: UPDATE_USER_DATA,
            payload: {
              userData: {
                ...res.data.currentUser,
                isLogin: true
              }
            }
          })
        }
      })
    }
  }, [])

  return (
    <AppLayout>
      <MaintainerList />
      <Posts />
    </AppLayout>
  );
};

//client.query({query: gql`query TestQuery {users}`})

export default IndexPage;