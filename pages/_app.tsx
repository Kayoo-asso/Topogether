import 'styles/globals.css';
import type { AppProps } from 'next/app';
import Head from 'next/head';
import { UserContext } from 'helpers';
import { useState } from 'react';
import { MobileLayout } from 'components';

const App = ({ Component, pageProps }: AppProps) => {
  const [session, setSession] = useState({ name: 'Flavien' });

  return (
    <>
      <Head>
        <meta charSet="utf-8" />
        <meta httpEquiv="X-UA-Compatible" content="IE=edge" />
        <meta
          name="viewport"
          content="width=device-width,initial-scale=1,minimum-scale=1,maximum-scale=1,user-scalable=no"
        />
        <meta name="description" content="Description" />
        <meta name="keywords" content="Keywords" />
        <title>Topogether</title>
        <link rel="manifest" href="/manifest.json" />
      </Head>

      <MobileLayout>
        <UserContext.Provider value={{ session, setSession }}>
          <Component {...pageProps} />
        </UserContext.Provider>
      </MobileLayout>
    </>
  );
};

export default App;
