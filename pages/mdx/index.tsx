import { MDXRemote, MDXRemoteSerializeResult } from "next-mdx-remote";
import { serialize } from "next-mdx-remote/serialize";
import fs from "fs";
import path from "path";
import type { GetStaticProps, NextPage } from "next";
import { MDXProvider } from "@mdx-js/react";
import matter from "gray-matter";
import { DetailedHTMLProps, HTMLAttributes } from "react";
// @ts-ignore
import Test from "./test.mdx";

const components = {
  em: (props: DetailedHTMLProps<HTMLAttributes<HTMLElement>, HTMLElement>) => (
    <i {...props} />
  ),
};

interface Props {
  source?: MDXRemoteSerializeResult;
}

const Home: NextPage<Props> = ({ source }) => {
  return (
    <div>{source && <MDXRemote {...source} components={components} />}</div>
  );
};

export const getStaticProps: GetStaticProps = async ({ params }) => {
  const filePath = path.join(process.cwd(), `docs/index.mdx`);
  console.log(filePath);
  const rawFileSource = fs.readFileSync(filePath);
  const { content, data } = matter(rawFileSource);
  const doc = content.toString();
  const meta = data;

  const mdxSource = await serialize(doc, {
    mdxOptions: {
      remarkPlugins: [
        // require("remark-autolink-headings"),
        // require("remark-slug"),
      ],
    //   rehypePlugins: [require("@mapbox/rehype-prism")],
    },
  });

  return {
    props: {
      source: mdxSource,
      meta,
    },
  };
};

export default Home;
