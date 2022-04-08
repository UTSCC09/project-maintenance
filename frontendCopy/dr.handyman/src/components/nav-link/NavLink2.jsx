/*
from https://mui.com/store/items/bazar-pro-react-ecommerce-template
*/

import { Small } from 'components/Typography';
import Link from 'next/link';
import React from 'react'; 

const NavLink2 = ({
  url,
  title = 'SHOP NOW'
}) => {
  return url ? <Link href={url}>
      <a>
        <Small fontWeight="900" borderBottom={2} borderColor="primary.600">
          {title}
        </Small>
      </a>
    </Link> : <Small fontWeight="900" borderBottom={2} borderColor="primary.600">
      {title}
    </Small>;
};

export default NavLink2;