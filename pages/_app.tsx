import React, { useState, useMemo } from 'react';
import 'styles/globals.css';
import type { AppProps } from 'next/app';
import Head from 'next/head';
import { UserContext, DeviceContext, Device } from 'helpers';
import { ShellMobile } from 'components';
import { User, UUID } from 'types';
import useDimensions from 'react-cool-dimensions';

const App = ({ Component, pageProps }: AppProps) => {
  const [device, setDevice] = useState<Device>('MOBILE');
  const {
 observe, unobserve, width, height, entry,
} = useDimensions({
    onResize: ({
 observe, unobserve, width, height, entry,
}) => {
      if (width > 768) { setDevice('DESKTOP'); } else if (width > 640) { setDevice('TABLET'); } else setDevice('MOBILE');
    },
  });

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
      <body onContextMenu={(e) => e.preventDefault()}>
        <UserContext.Provider value={sessionContextDefaultValues}>
          <DeviceContext.Provider value={device}>
            <div ref={observe} className="w-screen h-screen flex items-end flex-col">
              <div id="content" className="flex-1 w-screen absolute bg-grey-light flex flex-col h-full md:h-screen overflow-hidden">
                <Component {...pageProps} />
              </div>

              <div id="footer" className="bg-dark z-500 absolute bottom-0 h-shell md:hidden">
                <ShellMobile />
              </div>
            </div>
          </DeviceContext.Provider>
        </UserContext.Provider>
      </body>
    </>
  );
};

export default App;
