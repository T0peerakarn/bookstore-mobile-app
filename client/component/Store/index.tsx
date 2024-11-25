import { useEffect, useState } from "react";
import { ActivityIndicator, StyleSheet, View, Text } from "react-native";
import { Heading } from "react-native-sketchbook";

import { useQuery } from "@apollo/client";

import CustomSearchBar from "../CustomSearchBar";
import HorizontalLine from "../HorizontalLine";
import Bookshelf from "../Bookshelf";
import Book, { IBook } from "../Bookshelf/Book";

import { ALL_BOOKS } from "../../queries/books";

export type SearchKeyType = "title" | "author" | "publisher" | "isbn";

const Store = () => {
  const [search, setSearch] = useState<string>("");
  const [isSearching, setisSearching] = useState<boolean>(false);
  const [books, setBooks] = useState<IBook[]>([]);
  const [searchedBooks, setSearchedBooks] = useState<IBook[]>([]);
  const [searchKey, setSearchKey] = useState<SearchKeyType>("title");

  const { data, loading } = useQuery(ALL_BOOKS);

  const searchBy = [
    {
      key: "title",
      display: "Title",
    },
    {
      key: "author",
      display: "Author",
    },
    {
      key: "publisher",
      display: "Publisher",
    },
    {
      key: "isbn",
      display: "ISBN",
    },
  ];

  useEffect(() => {
    if (data) {
      interface IBookResponse {
        isbn: string;
        title: string;
        authors: { name: string }[];
        publishers: { name: string }[];
        yearOfPublication: number;
      }

      const json = JSON.parse(JSON.stringify(data)).getAllBooks;
      setBooks(
        json.map((book: IBookResponse) => {
          const { authors, publishers, ...rest } = book;
          return {
            ...rest,
            author: authors.map((author) => author.name).join(", "),
            publisher: publishers.map((publisher) => publisher.name).join(", "),
          };
        })
      );
    }
  }, [data]);

  useEffect(() => {
    setSearchedBooks(
      books
        .filter((book) =>
          book[searchKey].toLowerCase().includes(search.toLowerCase())
        )
        .filter((_, i) => i < 8)
    );
  }, [search, searchKey]);

  return (
    <>
      <CustomSearchBar
        isSearching={isSearching}
        setIsSearching={(newBoolean) => setisSearching(newBoolean)}
        searchBy={searchBy}
        searchKey={searchKey}
        setSearchKey={(newSearchKey) => setSearchKey(newSearchKey)}
        maxHeight={120}
        value={search}
        onChangeText={(newText) => setSearch(newText)}
        placeholder="Search"
        leftIconName={isSearching ? "x" : "search"}
        onPressLeftIcon={() => setisSearching(!isSearching)}
        autoCorrect={false}
      />
      {isSearching && search != "" && (
        <View style={{ gap: 12 }}>
          <Heading style={styles.heading}>Results</Heading>
          {searchedBooks.length == 0 ? (
            <Text style={styles.notFoundText}>
              Not found. Please try another search.
            </Text>
          ) : (
            <View style={styles.searchesContainer}>
              {searchedBooks.map((book) => (
                <Book key={book.isbn} {...book} />
              ))}
            </View>
          )}
        </View>
      )}
      <View style={styles.container}>
        <HorizontalLine />
        {loading ? (
          <ActivityIndicator />
        ) : (
          <Bookshelf
            title="New in Book Vendor"
            books={[...books]
              .sort((a, b) => b.yearOfPublication - a.yearOfPublication)
              .filter((_, i) => i < 5)}
          />
        )}
        {loading ? (
          <ActivityIndicator />
        ) : (
          <Bookshelf title="For You" books={books.filter((_, i) => i < 5)} />
        )}
      </View>
    </>
  );
};

const styles = StyleSheet.create({
  container: {
    gap: 12,
  },
  searchesContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "center",
    columnGap: 60,
    rowGap: 24,
  },
  heading: {
    fontFamily: "Inter",
    fontSize: 18,
    fontWeight: 500,
    color: "#713030",
  },
  notFoundText: {
    fontFamily: "Inter",
    fontSize: 14,
    fontWeight: 400,
    color: "#888888",
    textAlign: "center",
    marginVertical: 36,
  },
});

export default Store;
