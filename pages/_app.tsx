import 'styles/globals.css'
import type { AppProps } from 'next/app'
import Head from 'next/head'

function MyApp({ Component, pageProps }: AppProps) {
    return <>
        <Head>
            <meta charSet="utf-8" />
            <meta httpEquiv="X-UA-Compatible" content="IE=edge" />
            <meta
                name="viewport"
                content="width=device-width,initial-scale=1,minimum-scale=1,maximum-scale=1,user-scalable=no"
            />
            <meta name="description" content="Description" />
            <meta name="keywords" content="Keywords" />
            <title>Next.js PWA Example</title>
            <link rel="manifest" href="/manifest.json" />
        </Head>
        <Component {...pageProps} />
    </>
}

export default MyApp
