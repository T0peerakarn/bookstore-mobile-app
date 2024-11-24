import { useEffect, useState } from "react";
import { StyleSheet, Text, View } from "react-native";
import { Heading } from "react-native-sketchbook";
import AsyncStorage from "@react-native-async-storage/async-storage";

import { useApolloClient } from "@apollo/client";

import { ALL_LIKED } from "../../queries/books";
import Book, { IBook } from "../Bookshelf/Book";

const Liked = () => {
  const [books, setBooks] = useState<IBook[]>([]);

  const client = useApolloClient();

  useEffect(() => {
    const fetchData = async () => {
      const token = await AsyncStorage.getItem("token");
      const { data } = await client.query({
        query: ALL_LIKED,
        fetchPolicy: "network-only",
        context: { headers: { authorization: token } },
      });

      interface IBookResponse {
        isbn: string;
        title: string;
        authors: { name: string }[];
        publishers: { name: string }[];
        yearOfPublication: number;
      }

      setBooks(
        data.getAllLikedBooks.map((book: IBookResponse) => {
          const { authors, publishers, ...rest } = book;
          return {
            ...rest,
            author: authors.map((author) => author.name).join(", "),
            publisher: publishers.map((publisher) => publisher.name).join(", "),
          };
        })
      );
    };

    fetchData();
  }, []);

  return (
    <>
      <Heading style={styles.heading}>Your Favorites</Heading>
      {books.length == 0 ? (
        <Text style={styles.notFoundText}>
          You don't have any favorites yet.
        </Text>
      ) : (
        <View style={styles.searchesContainer}>
          {books.map((book) => (
            <Book key={book.isbn} {...book} />
          ))}
        </View>
      )}
    </>
  );
};

const styles = StyleSheet.create({
  heading: {
    fontFamily: "Inter",
    fontSize: 18,
    fontWeight: "500",
    color: "#713030",
  },
  notFoundText: {
    fontFamily: "Inter",
    fontSize: 14,
    fontWeight: "400",
    color: "#888888",
    textAlign: "center",
    marginVertical: 36,
  },
  searchesContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "center",
    columnGap: 60,
    rowGap: 24,
  },
});
export default Liked;
