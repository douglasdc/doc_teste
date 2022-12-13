import React, { useState } from "react";
import { Nav, Tabs, Tab } from "react-bootstrap";

const CodeBlockTabs = ({ children, ...props }) => {
  if (children && !Array.isArray(children)) {
    children = [children];
  }

  return (
    <Tabs id="controlled-tab-example">
      {children?.map((item, index) => {
        return (
          <Tab
            key={index}
            eventKey={item?.props?.language}
            title={item?.props?.language}
          >
            {item}
          </Tab>
        );
      })}
    </Tabs>
  );
};

export default CodeBlockTabs;
