import React from "react";
import { Tab } from "react-bootstrap";

const CodeBlock = props => {
  // console.log('cb',globalThis.__nextra_pageContext__)
  return <div>{props.children}</div>;
};

export default CodeBlock;
