import type { AppProps } from "next/app";
import "prismjs/themes/prism-tomorrow.css";
// import "bootstrap/dist/css/bootstrap.min.css";
import "../styles/globals.css";
import "../styles/unreset.css";
import { MDXProvider } from "@mdx-js/react";
import CodeBlock from "../components/CodeBlock";
import CodeBlockTabs from "../components/CodeBlockTabs";
import Layout from "../components/Layout";
import Button from "../components/Button";
import { NextPage } from "next";
import { ReactElement, ReactNode } from "react";

const components = {
  CodeBlock,
  CodeBlockTabs,
  Button
};

type AppPropsWithLayout = AppProps & {
  Component: NextPageWithLayout;
};

export default function App({ Component, pageProps }: AppPropsWithLayout) {
  const getLayout = Component.getLayout;

  if (getLayout) {
    return getLayout(<Component {...pageProps} />);
  } else {
    return (
      <MDXProvider components={components}>
        <Layout>
          <Component {...pageProps} />
        </Layout>
      </MDXProvider>
    );
  }
}

export type NextPageWithLayout<P = {}, IP = P> = NextPage<P, IP> & {
  getLayout?: (page: ReactElement) => ReactNode;
};
