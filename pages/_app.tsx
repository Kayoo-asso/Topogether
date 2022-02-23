import React, { useState } from 'react';
import 'styles/globals.css';
import type { AppProps } from 'next/app';
import Head from 'next/head';
import { DeviceContext, Device } from 'helpers';
import { ShellMobile } from 'components';
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
    </>
  );
};

export default App;
