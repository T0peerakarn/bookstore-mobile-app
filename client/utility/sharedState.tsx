import React, { createContext, useContext, useState } from "react";
import { IBook } from "../component/Bookshelf/Book";

const SharedStateContext = createContext<any>(null);

export interface IAddedBook {
  bookAmount: number;
  selectBook: IBook;
  isSelectedForCheckout?: boolean;
}

export const SharedStateProvider = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const [addedBooks, setAddedBooks] = useState<IAddedBook[]>([]);
  return (
    <SharedStateContext.Provider value={{ addedBooks, setAddedBooks }}>
      {children}
    </SharedStateContext.Provider>
  );
};

export const useSharedState = () => useContext(SharedStateContext);
