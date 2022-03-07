import AppLayout from 'components/layout/AppLayout';
import MaintainerList from './maintainers';
import { Box } from "@mui/system";
const IndexPage = props => {
  
  return <AppLayout>
     <MaintainerList />
  
    </AppLayout>;
};


export default IndexPage;