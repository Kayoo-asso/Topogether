import React, { useEffect } from 'react';
import 'styles/globals.css';
import App, { AppInitialProps } from 'next/app';
import type { AppProps, AppContext } from 'next/app';
import Head from 'next/head';
import { DeviceContext, Device } from 'helpers';
import { ShellMobile } from 'components/layouts';
import useDimensions from 'react-cool-dimensions';
import { getServerUser } from 'helpers/getServerUser';
import { User } from 'types';
import isMobile from 'ismobilejs';
import { useFirstRender } from 'helpers/hooks/useFirstRender';
import { resetServerContext } from 'react-beautiful-dnd';
import { AuthProvider } from 'components/AuthProvider';
import { parse } from 'cookie';

type CustomProps = {
  session: User | null,
  initialDevice: Device,
};

type InitialProps = AppInitialProps & CustomProps;
type Props = AppProps & CustomProps;

const breakpoints: Record<Device, number> = {
  mobile: 0,
  desktop: 640
};

const CustomApp = ({ Component, pageProps, session, initialDevice }: Props) => {
  const { observe, currentBreakpoint } = useDimensions({
    breakpoints,
    updateOnBreakpointChange: true
  });

  const firstRender = useFirstRender();
  const device = firstRender ? initialDevice : currentBreakpoint as Device;


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

      <AuthProvider initial={session}>
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
      </AuthProvider>
    </>
  );
};

CustomApp.getInitialProps = async (context: AppContext): Promise<InitialProps> => {
  const req = context.ctx.req;

  let device: Device = "mobile";
  if (req && req.headers['user-agent']) {
    const ua = req.headers['user-agent'];
    const mobile = isMobile(ua).any;
    if (!mobile) {
      device = "desktop";
    }
  }

  const [appProps, session] = await Promise.all([
    App.getInitialProps(context),
    req && req.headers['cookie']
      ? getServerUser(parse(req.headers['cookie']))
      : Promise.resolve(null)
  ]);

  // Make React DnD happy
  resetServerContext();

  return { ...appProps, session, initialDevice: device };
}

export default CustomApp;

