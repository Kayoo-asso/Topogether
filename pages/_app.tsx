import React, { useState } from 'react';
import 'styles/globals.css';
import type { AppProps } from 'next/app';
import Head from 'next/head';
import { DeviceContext, Device } from 'helpers';
import { ShellMobile } from 'components';
import useDimensions from 'react-cool-dimensions';
import ProtectedRoute from './protectedRoutes';
import { useRouter } from 'next/router';

const App = ({ Component, pageProps }: AppProps) => {
  const router = useRouter();
  const [device, setDevice] = useState<Device>('MOBILE');
  const { observe } = useDimensions({
    onResize: ({ observe, unobserve, width }) => {
      if (width > 768) { setDevice('DESKTOP'); } 
      else if (width > 640) { setDevice('TABLET'); } 
      else setDevice('MOBILE');
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
        <meta name="description" content="Des topos complets et collaboratifs" />
        <meta name="keywords" content="Escalade Climbing Topo Topographie Grimpe Cartographie" />
        <title>Topogether</title>
        <link rel="manifest" href="/manifest.json" />

        <link rel="apple-touch-icon" href="/assets/touch/icon-512x512.png"></link>
        <link rel="apple-touch-startup-image" href="/assets/splash/splashscreen640.png" media="(device-width: 320px) and (device-height: 568px) and (-webkit-device-pixel-ratio: 2) and (orientation: portrait)"></link>
        <link rel="apple-touch-startup-image" href="/assets/splash/splashscreen750.png" media="(device-width: 375px) and (device-height: 667px) and (-webkit-device-pixel-ratio: 2) and (orientation: portrait)"></link>
        <link rel="apple-touch-startup-image" href="/assets/splash/splashscreen1125.png" media="(device-width: 414px) and (device-height: 736px) and (-webkit-device-pixel-ratio: 3) and (orientation: portrait)"></link>
        <link rel="apple-touch-startup-image" href="/assets/splash/splashscreen1242.png" media="(device-width: 375px) and (device-height: 812px) and (-webkit-device-pixel-ratio: 3) and (orientation: portrait)"></link>
        <link rel="apple-touch-startup-image" href="/assets/splash/splashscreen1536.png" media="(min-device-width: 768px) and (max-device-width: 1024px) and (-webkit-min-device-pixel-ratio: 2) and (orientation: portrait)"></link>
        <link rel="apple-touch-startup-image" href="/assets/splash/splashscreen1668.png" media="(min-device-width: 834px) and (max-device-width: 834px) and (-webkit-min-device-pixel-ratio: 2) and (orientation: portrait)"></link>
        <link rel="apple-touch-startup-image" href="/assets/splash/splashscreen2048.png" media="(min-device-width: 1024px) and (max-device-width: 1024px) and (-webkit-min-device-pixel-ratio: 2) and (orientation: portrait)"></link>

      </Head>

        <DeviceContext.Provider value={device}>
          <div ref={observe} className="w-screen h-screen flex items-end flex-col">
            <div id="content" className="flex-1 w-screen absolute bg-grey-light flex flex-col h-full md:h-screen overflow-hidden">
              
              <ProtectedRoute router={router}>
                <Component {...pageProps} />
              </ProtectedRoute>

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
