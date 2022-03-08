import AppLayout from 'components/layout/AppLayout';
import MaintainerList from './maintainers';
import Posts from './posts';
import { Box } from "@mui/system";
const IndexPage = props => {
  
  return <AppLayout>
     <MaintainerList />
  <Posts />
    </AppLayout>;
};


export default IndexPage;