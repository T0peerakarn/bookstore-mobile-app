import React, { createContext, useContext, useState } from "react";

const SharedStateContext = createContext<any>(null);

export const SharedStateProvider = ({ children }: { children: React.ReactNode }) => {
    const [addedBooks, setAddedBooks] = useState([]);
    return (
        <SharedStateContext.Provider value={{ addedBooks, setAddedBooks }}>
            {children}
        </SharedStateContext.Provider>
    );
};

export const useSharedState = () => useContext(SharedStateContext);