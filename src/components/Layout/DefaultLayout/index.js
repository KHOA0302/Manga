import Footer from "./Footer";
import Header from "./Header";
import {useContext } from "react";
import { Context } from "~/components/DataContext";

function DefaultLayout({ children }) {
  const pathName = window.location.pathname;

  const context = useContext(Context);

  return (
    <div>
      {context.isLoading || <Header pathName={pathName} />}
      <div className="container">{children}</div>
      {context.isLoading || <Footer />}
    </div>
  );
}

export default DefaultLayout;
