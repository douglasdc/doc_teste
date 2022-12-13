import path from "node:path";
import fs from "node:fs";
import matter from "gray-matter";

const filesToAvoid = ["_app.tsx", "index.mdx", "index.tsx", "index.mdh"];

const routesMap = {};

function getDataHeaderContent(folder, file) {
  const indexHeader = path.join(folder, `${file}.mdh`);
  const indexFile = path.join(folder, `${file}.mdx`);

  if (fs.existsSync(indexHeader)) {
    return matter(fs.readFileSync(indexHeader, "utf-8")).data;
  } else if (fs.existsSync(indexFile)) {
    return matter(fs.readFileSync(indexFile, "utf-8")).data;
  } else {
    return null;
  }
}

function readFolderContent(folder, level) {
  let tree = [];
  let files = fs.readdirSync(folder);

  files.forEach(f => {
    const cPath = path.join(folder, f);

    const stat = fs.lstatSync(cPath);
    let route = cPath.replace("pages/", "/");
    route = route.replace(/\.mdx|\.tsx$/, "");

    if (stat.isDirectory()) {
      tree.push(readFolder(cPath, level));
    } else if (!filesToAvoid.includes(f) && f.match(/\.mdx|\.tsx$/)) {
      const dataHeaderContent = getDataHeaderContent(
        folder,
        path.parse(f).name
      );

      if (!dataHeaderContent?.hide) {
        routesMap[route] = {
          level: level,
          subPages: [],
          path: cPath,
          route,
          type: "file",
          data: dataHeaderContent
        };

        const folderFile = {
          level: level,
          subPages: [],
          path: cPath,
          route,
          type: "file",
          data: dataHeaderContent
        };

        tree.push(folderFile);
      }
    }
  });

  return tree;
}

function readFolder(folder, level) {
  let hasIndex = false;
  const dataHeaderContent = getDataHeaderContent(folder, "index");

  let route = folder.replace("pages/", "/");

  const files = fs.readdirSync(folder);
  if (files.some(c => ["index.mdx", "index.tsx"].includes(c))) {
    hasIndex = true;
  }

  console.log("l", level, route);
  if (hasIndex) {
    routesMap[route] = {
      level: level,
      subPages: [],
      path: folder,
      type: "folder",
      route: hasIndex ? route : undefined
    };
  }

  const folderPage = {
    level: level,
    subPages: readFolderContent(folder, level + 1),
    path: folder,
    type: "folder",
    route: hasIndex ? route : undefined
  };

  if (dataHeaderContent !== null) {
    folderPage["data"] = dataHeaderContent;
  }

  return folderPage;
}

export default function mapPages() {
  const rootPage = "pages/";

  const tree = [...readFolder(rootPage, 0).subPages];
  const result = {
    pagesTree: tree,
    routes: routesMap
  };

  global.__nextra_pageContext__ = result;

  global.palgo = () => console.log("palgo");

  return result;
}
