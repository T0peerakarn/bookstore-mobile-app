import { useEffect, useState } from "react";
import { ActivityIndicator, StyleSheet, Text } from "react-native";

import { useQuery } from "@apollo/client";

import CustomSearchBar from "../CustomSearchBar";
import HorizontalLine from "../HorizontalLine";
import Bookshelf from "../Bookshelf";

import { ALL_BOOKS } from "../../queries/books";
import { IBook } from "../Bookshelf/Book";

const Store = () => {
  const [search, setSearch] = useState<string>("");
  const [books, setBooks] = useState<IBook[]>([]);

  const { data, loading } = useQuery(ALL_BOOKS);

  useEffect(() => {
    if (data) {
      interface IBookResponse {
        isbn: string;
        title: string;
        authors: { name: string }[];
        yearOfPublication: number;
      }

      const json = JSON.parse(JSON.stringify(data)).getAllBooks;
      setBooks(
        json.map((book: IBookResponse) => {
          const { authors, ...rest } = book;
          return {
            ...rest,
            author: authors.map((author) => author.name).join(", "),
          };
        })
      );
    }
  }, [data]);

  return (
    <>
      <CustomSearchBar
        value={search}
        onChangeText={(newText) => setSearch(newText)}
        placeholder="Search"
        leftIconName="search"
      />
      <HorizontalLine />
      {loading ? (
        <ActivityIndicator />
      ) : (
        <Bookshelf
          title="New in Book Vendor"
          books={books
            .sort((a, b) => b.yearOfPublication - a.yearOfPublication)
            .filter((_, i) => i < 5)}
        />
      )}
      {loading ? (
        <ActivityIndicator />
      ) : (
        <Bookshelf
          title="For You"
          books={books
            .sort((a, b) => b.yearOfPublication - a.yearOfPublication)
            .filter((_, i) => i >= 5)
            .sort((_a, _b) => 0.5 - Math.random())
            .filter((_, i) => i < 5)}
        />
      )}
    </>
  );
};

const styles = StyleSheet.create({});

export default Store;
