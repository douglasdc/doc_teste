import nextMDX from "@next/mdx";
import prism from "remark-prism";
import emoji from "remark-emoji";
import codeTabs from "./plugins/code-tabs/index.js";
import mapPages from "./plugins/mapPages.js";
import remTeste from "./plugins/teste.js";
import path from "path";
import cachePage from "./plugins/cachepages.js";
import rehypeSlug from "rehype-slug";

/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  swcMinify: true,
  pageExtensions: ["tsx", "jsx", "mdx"],
  env: {
    ...mapPages()
  },
  async rewrites() {
    return [
      {
        source: "/level1",
        destination: "/level87"
      }
    ];
  },
  // async redirects() {
  //   return [
  //     {
  //       source: "/level1",
  //       destination: "/",
  //       permanent: false
  //     }
  //   ];
  // },
  webpack(config, options) {
    config.module.rules.push({
      test: /\.mdx?$/,
      use: [
        {
          loader: path.resolve("./loader/myloader.js"),
          options: {
            cachePage
          }
        }
      ]
    });

    return config;
  }
};

const withMDX = nextMDX({
  extension: /\.mdx?$/,
  options: {
    providerImportSource: "@mdx-js/react",
    // If you use remark-gfm, you'll need to use next.config.mjs
    // as the package is ESM only
    // https://github.com/remarkjs/remark-gfm#install
    remarkPlugins: [
      [
        codeTabs,
        {
          codeTabComponent: "CodeBlockTabs",
          codeBlockComponent: "CodeBlock"
        }
      ],
      emoji,
      [
        prism,
        {
          noInlineHighlight: true,
          aliases: { 200: "json", js: "javascript" },
          showLineNumbers: true
        }
      ]
    ],
    rehypePlugins: [remTeste, rehypeSlug]
    // If you use `MDXProvider`, uncomment the following line.
    // providerImportSource: "@mdx-js/react",
  }
});

export default withMDX(nextConfig);
