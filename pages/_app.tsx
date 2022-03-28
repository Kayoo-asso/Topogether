import React, { useState } from 'react';
import 'styles/globals.css';
import App, { AppInitialProps } from 'next/app';
import type { AppProps, AppContext } from 'next/app';
import Head from 'next/head';
import { DeviceContext, Device } from 'helpers';
import { ShellMobile } from 'components';
import useDimensions from 'react-cool-dimensions';
import { getServerSession } from 'helpers/getServerSession';
import { Session } from 'types';
import { SessionContext } from 'components/SessionProvider';
import { VariantWidth } from 'helpers/variants';
import DeviceDetector from "device-detector-js";

type CustomProps = {
  session: Session | null,
  device: Device,
  viewportWidth: number
};

type InitialProps = AppInitialProps & CustomProps;

type Props = AppProps & CustomProps;

const CustomApp = ({ Component, pageProps, session, device }: Props) => {
  // const [device, setDevice] = useState<Device>('MOBILE');
  // const { observe, width, height } = useDimensions({
  //   onResize: ({ observe, unobserve, width }) => {
  //     if (width > 768) { setDevice('DESKTOP'); }
  //     else if (width > 640) { setDevice('TABLET'); }
  //     else setDevice('MOBILE');
  //   },
  // });
  console.log(`Loading App`);

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

      <SessionContext.Provider value={session}>
        <DeviceContext.Provider value={device}>
          <div className="w-screen h-screen flex items-end flex-col">
            <div id="content" className="flex-1 w-screen absolute bg-grey-light flex flex-col h-full md:h-screen overflow-hidden">
              {/* TODO */}
              {/* <ProtectedRoute router={router}> */}
              {/* <Component {...pageProps} /> */}
              {/* </ProtectedRoute> */}

            </div>

            <div id="footer" className="bg-dark z-500 absolute bottom-0 h-shell md:hidden">
              <ShellMobile />
            </div>
          </div>
        </DeviceContext.Provider>
      </SessionContext.Provider>
    </>
  );
};

let firstRun = false;

CustomApp.getInitialProps = async (context: AppContext): Promise<InitialProps> => {
  const req = context.ctx.req;
  if (!req) {
    throw new Error()
  }
  console.log(`Component.displayName: ${context.Component.displayName}`)
  console.log("firstRun:", firstRun);
  console.log("Headers:", req.headers);
  firstRun = true;

  let viewportWidth: number | undefined = undefined;
  if (req) {
    if (req.headers['viewport-width']) {
      viewportWidth = Number(req.headers['viewport-width']);
    } else if(req.headers['user-agent']) {
      console.log("No viewport-width header, using user-agent");
      const detector = new DeviceDetector();
      const device = detector.parse(req.headers['user-agent']).device?.type;
      switch (device) {
        case "smartphone":
        case "portable media player":
        case "wearable":
        case "feature phone":
        case "peripheral":
        case "smart speaker":
          viewportWidth = 640;
        default:
          // TODO: change
          viewportWidth = 1024;
      }
    }
  }
  if (viewportWidth === undefined) {
    viewportWidth = 1920;
  }
  const device: Device = viewportWidth < 768
    ? "MOBILE"
    :"DESKTOP";

  if (context.ctx.res) {
    context.ctx.res.setHeader('Accept-CH', "Viewport-Width");
  }

  console.log(`Detected device ${device} with vw ${viewportWidth}`);

  const [appProps, session] = await Promise.all([
    App.getInitialProps(context),
    req ? getServerSession(req) : Promise.resolve(null)
  ]);
  return { ...appProps, session, device, viewportWidth };
}

export default CustomApp;
