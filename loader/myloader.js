const matter = require("gray-matter");

module.exports = function (source) {
  const t = matter(source);
  // console.log(t.content);
  return t.content;
};
