class CachePage {
  pages = [];

  set(filePath) {
    // console.log(filePath);
    this.pages.push(filePath);
  }

  get() {
    return this.pages;
  }
}

const cachePage = new CachePage();

export default cachePage;
