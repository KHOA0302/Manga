import { createContext } from "react";

export const Context = createContext();

function DataContext({ children, data }) {
  return <Context.Provider value={data}>{children}</Context.Provider>;
}

export default DataContext;
