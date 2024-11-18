import { ScrollView, StyleSheet, View } from "react-native";
import { Heading } from "react-native-sketchbook";

import Book, { IBook } from "./Book";

interface IBookshelf {
  title: string;
  books: IBook[];
}

const Bookshelf = ({ title, books }: IBookshelf) => {
  return (
    <View style={styles.container}>
      <Heading style={styles.heading}>{title}</Heading>
      <ScrollView
        style={styles.booksContainer}
        horizontal
        contentContainerStyle={{
          columnGap: 16,
        }}
        showsHorizontalScrollIndicator={false}
      >
        {books.map((book) => (
          <Book key={book.isbn} {...book} />
        ))}
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    gap: 12,
  },
  heading: {
    fontFamily: "Inter",
    fontSize: 18,
    fontWeight: 500,
    color: "#713030",
  },
  booksContainer: {
    flexDirection: "row",
  },
});
export default Bookshelf;
