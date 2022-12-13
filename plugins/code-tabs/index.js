import * as visit from "unist-util-visit";
import cachePage from "../cachepages.js";

export default function retextSentenceSpacing(options) {
  const { codeBlockComponent, codeTabComponent, language, tabTitle, filename } =
    options;

  // console.log("ctb", cachePage.get().length);
  // console.log("ctb");
  return (tree, file) => {
    let lastParent = null;
    let pendingCode = [];
    let toRemove = [];

    function getFullMeta(node) {
      if (node.lang && node.meta) {
        return node.lang + node.meta;
      }
      return node.lang || node.meta;
    }

    function getFilename(node) {
      if (filename) {
        return filename(node);
      }

      const meta = getFullMeta(node);
      const match = (meta || "").match(/\{filename:\s*([^}]+)\}/);
      return (match && match[1]) || "";
    }

    function getTabTitle(node) {
      if (tabTitle) {
        return tabTitle;
      }

      const meta = getFullMeta(node);
      const match = (meta || "").match(/\{tabTitle:\s*([^}]+)\}/);
      return (match && match[1]) || "";
    }

    function getLanguage(node) {
      if (language) {
        return language(node);
      }

      return node.lang || "";
    }

    function flushPendingCode() {
      if (pendingCode.length === 0) {
        return;
      }

      const rootNode = pendingCode[0][0];
      const children = pendingCode.reduce(
        (arr, [node]) =>
          arr.concat([
            {
              type: "mdxJsxFlowElement",
              name: codeBlockComponent,
              attributes: [
                {
                  type: "mdxJsxAttribute",
                  name: "language",
                  value: getLanguage(node),
                  title: getTabTitle(node),
                  filename: getFilename(node)
                },
                {
                  type: "mdxJsxAttribute",
                  name: "title",
                  value: getTabTitle(node)
                },
                {
                  type: "mdxJsxAttribute",
                  name: "filename",
                  value: getFilename(node)
                }
              ],
              children: [Object.assign({}, node)]
            }
          ]),
        []
      );

      rootNode.type = "element";
      rootNode.data = {
        hName: "div"
      };
      rootNode.children = [
        {
          type: "mdxJsxFlowElement",
          name: codeTabComponent,
          children: [...children]
        }
      ];

      toRemove = toRemove.concat(pendingCode.splice(1));
    }

    visit.visit(
      tree,
      () => true,
      (node, _index, parent) => {
        if (node.type !== "code" || parent !== lastParent) {
          flushPendingCode();
          pendingCode = [];
          lastParent = parent;
        }
        if (node.type === "code") {
          pendingCode.push([node, parent]);
        }
      }
    );

    flushPendingCode();

    toRemove.forEach(([node, parent]) => {
      parent.children = parent.children.filter(n => n !== node);
    });

    return tree;
  };
}
