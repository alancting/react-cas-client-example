import React, { useState, createContext } from "react";

// Create Context Object
export const CasUserContext = createContext();

// Create a provider for components to consume and subscribe to changes
export const CasUserContextProvider = (props) => {
  const [user, setUser] = useState(false);
  const [pgtIou, setPgtIou] = useState(false);

  return (
    <CasUserContext.Provider value={{ user, setUser, pgtIou, setPgtIou }}>
      {props.children}
    </CasUserContext.Provider>
  );
};
