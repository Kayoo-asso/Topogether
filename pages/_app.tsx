import React, { useState, useMemo } from 'react';
import 'styles/globals.css';
import type { AppProps } from 'next/app';
import Head from 'next/head';
import { UserContext } from 'helpers';
import { LayoutMobile, LayoutDesktop, Device } from 'components';
import { User, UUID } from 'types';
import { isDesktop, isMobile } from 'react-device-detect';

const App = ({ Component, pageProps }: AppProps) => {
  const [session, setSession] = useState<User>(
    {
      id: '34ff6fb9-8912-4086-818c-19afbe0576c4' as UUID,
      pseudo: 'Flavien',
      email: 'flavien@kayoo-asso.fr',
      role: 'ADMIN',
    },
  );

  const sessionContextDefaultValues = useMemo(() => ({ session, setSession }), [session]);

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

      <UserContext.Provider value={sessionContextDefaultValues}>
        <Device>
          {({ isMobile }: { isMobile: boolean }) => {
            if (isMobile) {
              return (
                <LayoutMobile>
                  <Component {...pageProps} />
                </LayoutMobile>
);
          }

          return (
            <LayoutDesktop>
              <Component {...pageProps} />
            </LayoutDesktop>
);
          }}
        </Device>
      </UserContext.Provider>
    </>
  );
};

export default App;
