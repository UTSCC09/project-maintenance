/*
from https://mui.com/store/items/bazar-pro-react-ecommerce-template
*/

import { Box } from "@mui/system";

const FlexBox = ({
  children,
  ...props
}) => <Box display="flex" {...props}>
    {children}
  </Box>;

FlexBox.defaultProps = {
  display: "flex"
};
export default FlexBox;