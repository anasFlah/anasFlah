import Document, { Html, Head, Main, NextScript } from 'next/document';

class MyDocument extends Document {
  render() {
    return (
      <Html>
        <Head>
          {/* Umami Analytics Tracking Script */}
          <script
            async
            defer
            data-website-id={process.env.NEXT_PUBLIC_UMAMI_WEBSITE_ID || "1"}
            src={process.env.NEXT_PUBLIC_UMAMI_TRACKING_SCRIPT_URL || "http://localhost:3001/umami.js"}
          />
        </Head>
        <body>
          <Main />
          <NextScript />
        </body>
      </Html>
    );
  }
}

export default MyDocument;