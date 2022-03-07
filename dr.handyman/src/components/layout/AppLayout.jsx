import React, {
  Fragment,
  useCallback,
  useState,
} from 'react';

import Footer from 'components/footer/Footer';
import Header from 'components/header/Header';
import Head from 'next/head';

const AppLayout = ({
  children,
  navbar,
  title = "Dr.Handyman"
}) => {
  
 
  return <Fragment>
      <Head>
        <title>{title}</title>
        <meta charSet="utf-8" />
        <meta name="viewport" content="initial-scale=1.0, width=device-width" />
      </Head>

      <Header />

    

      {navbar && <div className="section-after-sticky">{navbar}</div>}
      {!navbar ? <div className="section-after-sticky">{children}</div> : children}

     
      <Footer />
    </Fragment>;
};

export default AppLayout;