import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { publicRoutes } from "~/routes";
import { DefaultLayout } from "~/components/Layout";
import {useState } from "react";
import DataContext from "./components/DataContext";

function App() {
  const [isLoading, setIsLoading] = useState(true);
  const [data, setData] = useState(undefined);

  const routes = publicRoutes.map((route, index) => {
    const Page = route.component;
    const Layout = route.layout || DefaultLayout;

    return (
      <Route
        key={index}
        path={route.path}
        element={
          <Layout>
            <Page setIsLoading={setIsLoading} isLoading={isLoading} />
          </Layout>
        }
      />
    );
  });

  const customData = {
    data: data,
    setData: setData,
    isLoading: isLoading,
  };

  return (
    <DataContext data={customData}>
      <Router>
        <div className="App">
          <Routes>{routes}</Routes>
        </div>
      </Router>
    </DataContext>
  );
}

export default App;
