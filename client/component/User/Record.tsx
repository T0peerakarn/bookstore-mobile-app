import React from "react";
import { StyleSheet, Text, View } from "react-native";

import HorizontalLine from "../HorizontalLine";

import { IBook } from "../Bookshelf/Book";
import { Image } from "react-native-elements";

export interface IRecord {
  id: string;
  books: (IBook & { authors: { name: string }[] })[];
  totalPrice: number;
  createdAt: string;
}

const Record = ({ id, books, totalPrice, createdAt }: IRecord) => {
  return (
    <View style={styles.container}>
      <Text style={{ ...styles.text, fontSize: 15, fontWeight: 500 }}>
        Purchase ID: {id.toUpperCase().substring(0, 8)}
      </Text>
      <HorizontalLine />
      {books.map((book) => (
        <React.Fragment key={`${id}_${book.isbn}`}>
          <View style={styles.bookContainer}>
            <Image
              source={{ uri: book.image }}
              style={{ ...styles.image, ...styles.bookItem }}
            />
            <View style={{ flex: 2 }}>
              <View style={{ ...styles.bookItem }}>
                <Text style={{ ...styles.text, fontSize: 17, fontWeight: 500 }}>
                  {book.title}
                </Text>
                <Text style={{ ...styles.text, fontSize: 13, fontWeight: 300 }}>
                  {book.authors.map((author) => author.name).join(", ")}
                </Text>
              </View>
              <View
                style={{
                  ...styles.bookItem,
                  alignSelf: "flex-end",
                  justifyContent: "flex-end",
                }}
              >
                <Text
                  style={{
                    ...styles.text,
                    fontSize: 15,
                    fontWeight: 500,
                    textAlign: "right",
                  }}
                >
                  $ {book.price}
                </Text>
                <Text
                  style={{
                    ...styles.text,
                    fontSize: 13,
                    fontWeight: 300,
                    textAlign: "right",
                  }}
                >
                  Quantity: {book.amount}
                </Text>
              </View>
            </View>
          </View>
          <HorizontalLine />
        </React.Fragment>
      ))}
      <Text style={{ ...styles.text, fontSize: 13, textAlign: "right" }}>
        Date of Purchase: {createdAt.split(",")[0]}
      </Text>
      <Text style={{ ...styles.text, fontSize: 13, textAlign: "right" }}>
        Total: <Text style={styles.price}>${totalPrice}</Text>
      </Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    width: "100%",
    backgroundColor: "white",
    padding: 12,
    gap: 8,
    shadowColor: "#000000",
    shadowRadius: 2,
    shadowOpacity: 0.1,
    shadowOffset: { width: 0, height: 4 },
  },
  text: {
    fontFamily: "Inter",
    color: "#4B4B4B",
  },
  price: {
    fontFamily: "Inter",
    color: "#713030",
    fontSize: 24,
    fontWeight: 500,
  },
  image: {
    width: 110,
    height: 165,
    borderRadius: 5,
  },
  bookContainer: {
    flexDirection: "row",
  },
  bookItem: {
    flex: 1,
    padding: 6,
    gap: 6,
  },
});

export default Record;
