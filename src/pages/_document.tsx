import Document, { Html, Head, Main, NextScript } from 'next/document';

export default class extends Document {
  static async getInitialProps(ctx: any) {
    return await Document.getInitialProps(ctx);
  }

  render() {
    return (
      <html lang="en" dir="ltr">
        <Head>
          <meta name="application-name" content="Magic Bet" />
          <meta name="apple-mobile-web-app-capable" content="yes" />
          <meta
            name="apple-mobile-web-app-status-bar-style"
            content="default"
          />
          <meta name="apple-mobile-web-app-title" content="Magic Bet" />
          <meta name="description" content="The lossless, betting platform" />
          <meta name="format-detection" content="telephone=no" />
          <meta name="mobile-web-app-capable" content="yes" />
          <meta name="theme-color" content="#f1404b" />
          <meta
            name="viewport"
            content="minimum-scale=1, initial-scale=1, width=device-width, shrink-to-fit=no, viewport-fit=cover"
          />

          <link rel="manifest" href="/manifest.json" />
          <link rel="shortcut icon" href="/favicon.ico" />
          <link
            rel="apple-touch-icon"
            sizes="180x180"
            href="/icons/icon-96x96.png"
          />
        </Head>
        <body>
          <Main />
          <NextScript />
        </body>
      </html>
    );
  }
}
