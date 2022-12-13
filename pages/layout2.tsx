import { ReactElement } from "react";
import { NextPageWithLayout } from "./_app";

const Layout2: NextPageWithLayout = () => {
  return <div>Page 2 aqui</div>;
};

Layout2.getLayout = function getLayout(page: ReactElement) {
  return <div className="w-96 bg-red-300">{page}</div>;
};

export default Layout2;
