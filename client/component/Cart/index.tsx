import React, { useEffect, useState } from "react";
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  ActivityIndicator,
} from "react-native";
import { Image } from "react-native-elements";
import { Heading } from "react-native-sketchbook";
import { IAddedBook, useSharedState } from "../../utility/sharedState";
import HorizontalLine from "../HorizontalLine";
import Icon from "react-native-vector-icons/Feather";
import CustomButton from "../CustomButton";
import { ALL_BOOKS, CHECKOUT_BOOKS } from "../../queries/books";
import { useApolloClient } from "@apollo/client";
import AsyncStorage from "@react-native-async-storage/async-storage";
import SweetAlert, { showSweetAlert } from "../SweetAlert";

interface ICart {
  setIndex: (newIndex: number) => void;
}

const Cart = ({ setIndex }: ICart) => {
  const { addedBooks, setAddedBooks } = useSharedState();
  const [selectAll, setSelectAll] = useState(false);

  const client = useApolloClient();

  const checkoutHandler = async () => {
    try {
      const checkedOutBooks = addedBooks
        .filter((item: IAddedBook) => item.isSelectedForCheckout)
        .map((item: IAddedBook) => ({
          isbn: item.selectBook.isbn,
          amount: item.bookAmount,
        }));
      const token = await AsyncStorage.getItem("token");
      await client.mutate({
        mutation: CHECKOUT_BOOKS,
        variables: { checkedOutBooks },
        context: { headers: { authorization: token } },
      });

      setAddedBooks((prevBooks: IAddedBook[]) =>
        prevBooks.filter((book) => !book.isSelectedForCheckout)
      );

      showSweetAlert({
        title: "Success!",
        text: "Your purchase has been confirmed",
        showCancelButton: true,
        cancelButtonText: "Close",
        confirmButtonText: "My Purchase",
        onConfirm: () => setIndex(2),
        onClose: () => null,
        type: "success",
      });
    } catch (err) {
      showSweetAlert({
        title: "Error!",
        text: "Please try again",
        showCancelButton: false,
        cancelButtonText: "",
        confirmButtonText: "Close",
        onConfirm: () => null,
        onClose: () => null,
        type: "danger",
      });
    }
  };

  const removeFromCart = (isbn: string) => {
    setAddedBooks((prevBooks: IAddedBook[]) =>
      prevBooks.filter((book) => book.selectBook.isbn !== isbn)
    );
  };

  const totalPrice = () => {
    return addedBooks.reduce((total: number, book: IAddedBook) => {
      if (book.isSelectedForCheckout) {
        // Add price * bookAmount for selected books
        return total + book.selectBook.price * book.bookAmount;
      }
      return total;
    }, 0);
  };

  const totalAmount = () =>
    addedBooks.reduce(
      (acc: number, cur: IAddedBook) =>
        cur.isSelectedForCheckout ? acc + cur.bookAmount : acc,
      0
    );

  const toggleBookSelection = (isbn: string) => {
    setAddedBooks((prevBooks: IAddedBook[]) =>
      prevBooks.map((book) =>
        book.selectBook.isbn === isbn
          ? {
              ...book,
              isSelectedForCheckout: !book.isSelectedForCheckout, // Toggle checkbox state
            }
          : book
      )
    );
  };

  const updateBookAmount = (isbn: string, delta: number) => {
    setAddedBooks((prevBooks: IAddedBook[]) =>
      prevBooks.map((book) =>
        book.selectBook.isbn === isbn
          ? {
              ...book,
              bookAmount: Math.min(
                Math.max(book.bookAmount + delta, 1), // Ensure at least 1
                book.selectBook.amount // Ensure no more than in stock
              ),
            }
          : book
      )
    );
  };

  const toggleSelectAll = () => {
    const newSelectAllState = !selectAll;
    setSelectAll(newSelectAllState);

    // Update all books to selected or unselected based on the select all state
    setAddedBooks((prevBooks: IAddedBook[]) =>
      prevBooks.map((book) => ({
        ...book,
        isSelectedForCheckout: newSelectAllState,
      }))
    );
  };

  const RenderBook = ({ item }: { item: IAddedBook }) => {
    const formattedNameList = (list: { name: string }[]) =>
      list.map((l) => l.name).join(",\n");

    return (
      <>
        <HorizontalLine />
        <View style={{ flexDirection: "row", alignItems: "flex-start" }}>
          <TouchableOpacity
            style={styles.checkboxContainer}
            onPress={() => toggleBookSelection(item.selectBook.isbn)}
          >
            <View
              style={[
                styles.checkbox,
                item.isSelectedForCheckout && styles.checked,
              ]}
            >
              {item.isSelectedForCheckout && (
                <Icon name="check" style={styles.icon} />
              )}
            </View>
          </TouchableOpacity>

          <View style={{ flexDirection: "row", gap: 20 }}>
            <Image
              style={{
                width: 100,
                height: 160,
                borderRadius: 8,
              }}
              source={{ uri: item.selectBook.image }}
              PlaceholderContent={<ActivityIndicator />}
            />

            <View style={{ justifyContent: "space-evenly" }}>
              <Text
                style={{
                  ...styles.bookTitle,
                  textAlign: "left",
                  fontSize: 20,
                  maxWidth: 200,
                }}
              >
                {item.selectBook.title}
              </Text>
              <Text
                style={{
                  ...styles.bookAuthor,
                  fontSize: 16,
                  marginBottom: 0,
                }}
              >
                {formattedNameList(item.selectBook.authors!)}
              </Text>
              <View
                style={{
                  flexDirection: "row",
                  alignItems: "flex-end",
                }}
              >
                <Text
                  style={{
                    ...styles.currency,
                    fontSize: 14,
                    marginBottom: 5,
                  }}
                >
                  $
                </Text>
                <Text style={{ ...styles.bookPrice, fontSize: 32 }}>
                  {item.selectBook.price}
                </Text>
              </View>
              <Text style={styles.amount}>
                ({item.selectBook.amount} in stock)
              </Text>
            </View>
          </View>

          <TouchableOpacity
            style={styles.closeButton}
            onPress={() => removeFromCart(item.selectBook.isbn)}
          >
            <Icon name="trash-2" style={styles.closeButtonText} />
          </TouchableOpacity>

          <View
            style={{
              position: "absolute",
              flex: 1,
              flexDirection: "row",
              alignItems: "center",
              justifyContent: "center",
              gap: 20,
              right: 0,
              bottom: 0,
            }}
          >
            <TouchableOpacity
              style={styles.adjustButton}
              onPress={() => updateBookAmount(item.selectBook.isbn, -1)}
            >
              <Text style={{ color: "#FFF", fontWeight: "600", fontSize: 24 }}>
                -
              </Text>
            </TouchableOpacity>
            <Text style={{ fontSize: 18 }}>{item.bookAmount}</Text>
            <TouchableOpacity
              style={styles.adjustButton}
              onPress={() => updateBookAmount(item.selectBook.isbn, 1)}
            >
              <Text style={{ color: "#FFF", fontWeight: "600", fontSize: 24 }}>
                +
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </>
    );
  };

  useEffect(() => {
    setSelectAll(
      addedBooks.reduce(
        (acc: boolean, cur: IAddedBook) => acc && cur.isSelectedForCheckout,
        true
      )
    );
  }, [addedBooks]);

  return (
    <>
      <Heading style={styles.heading}>My cart</Heading>

      {addedBooks.length > 0 ? (
        <>
          <TouchableOpacity
            style={styles.checkboxContainer}
            onPress={toggleSelectAll}
          >
            <View style={[styles.checkbox_all, selectAll && styles.checked]}>
              {selectAll && <Icon name="check" style={styles.icon} />}
            </View>
            <Text style={styles.checkboxLabel}>Select All</Text>
          </TouchableOpacity>

          <View style={{ gap: 20 }}>
            {addedBooks.map((item: IAddedBook) => (
              <RenderBook key={item.selectBook.isbn} item={item} />
            ))}
            <HorizontalLine />
          </View>

          <View style={styles.totalPriceContainer}>
            <Text style={{ ...styles.totalPriceText }}>Total:</Text>
            <Text style={{ ...styles.totalPriceText, marginLeft: "auto" }}>
              ${totalPrice().toFixed(2)}
            </Text>
          </View>

          <View style={{ alignItems: "center" }}>
            <CustomButton
              title={`Checkout (${totalAmount()})`}
              disabled={totalAmount() === 0}
              onPress={() => checkoutHandler()}
            />
          </View>
        </>
      ) : (
        <Text style={styles.emptyText}>Your cart is empty</Text>
      )}
      <SweetAlert />
    </>
  );
};

const styles = StyleSheet.create({
  totalPriceContainer: {
    flexDirection: "row",
    borderWidth: 2,
    borderColor: "#713030",
    borderRadius: 15,
    padding: 20,
  },
  totalPriceText: {
    fontSize: 18,
    fontFamily: "Inter",
    fontWeight: "500",
    color: "#4B4B4B",
  },
  horizontalLine: {
    width: "100%", // 80% of the screen width
    height: 2, // Line thickness
    backgroundColor: "#E8E8E8", // Line color
  },
  checkboxContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  checkbox_all: {
    width: 23,
    height: 23,
    backgroundColor: "#D9D9D9",
    borderRadius: 5,
    justifyContent: "center",
    alignItems: "center",
    marginRight: 10,
  },
  checkbox: {
    width: 23,
    height: 23,
    backgroundColor: "#D9D9D9",
    borderRadius: 5,
    justifyContent: "center",
    alignItems: "center",
    marginRight: 10,
  },
  checkboxLabel: {
    fontSize: 15,
    fontWeight: "400",
    fontFamily: "Inter",
    color: "#939393",
    textAlignVertical: "center",
  },
  checked: {
    backgroundColor: "#713030", // Green background when checked
  },
  checkmark: {
    color: "white",
    fontWeight: "bold",
    zIndex: 9999,
  },
  closeButtonText: {
    color: "#FFBDBD",
    fontSize: 16,
  },
  col_pop: {
    left: 55,
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    marginTop: 5,
    width: "95%",
  },
  adjustButton: {
    width: 28,
    height: 29,
    backgroundColor: "#D9D9D9",
    borderRadius: 6,
    justifyContent: "center",
    alignItems: "center",
  },
  heading: {
    fontFamily: "Inter",
    fontSize: 18,
    fontWeight: 500,
    color: "#713030",
  },
  closeButton: {
    position: "absolute", // Makes it float relative to modalContent
    right: 10,
    width: 26,
    height: 26,
    backgroundColor: "#713030",
    borderRadius: 9999,
    justifyContent: "center",
    alignItems: "center",
    zIndex: 1,
  },
  container2: {
    flexDirection: "column",
  },
  bookContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 20,
    padding: 10,
    borderColor: "#DDD",
  },
  bookImage: {
    width: 60,
    height: 90,
    borderRadius: 5,
    marginRight: 10,
  },
  bookDetails: {
    flex: 1,
  },
  title: {
    fontSize: 16,
    fontWeight: "bold",
  },
  author: {
    fontSize: 14,
    color: "#555",
  },
  amount: {
    fontFamily: "Inter",
    fontSize: 15,
    fontStyle: "italic",
    fontWeight: "300",
  },
  removeButton: {
    marginTop: 10,
    backgroundColor: "#FF5C5C",
    paddingVertical: 5,
    paddingHorizontal: 10,
    borderRadius: 5,
  },
  removeText: {
    color: "#FFF",
    fontWeight: "bold",
    textAlign: "center",
  },
  emptyText: {
    fontFamily: "Inter",
    fontSize: 14,
    fontWeight: "400",
    color: "#888888",
    textAlign: "center",
    marginVertical: 36,
  },
  bookTitle: {
    fontSize: 24,
    fontWeight: "500",
    textAlign: "center",
    color: "#4B4B4B",
  },
  bookAuthor: {
    fontSize: 18,
    fontWeight: "300",
    textAlignVertical: "bottom",
    marginBottom: 10,
  },
  currency: {
    fontSize: 20,
    fontWeight: "500",
    textAlignVertical: "bottom",
    marginBottom: 10,
  },
  bookPrice: {
    fontSize: 50,
    fontWeight: "500",
    textAlignVertical: "bottom",
  },
  icon: {
    color: "#FFFFFF",
    fontSize: 20,
  },
});

export default Cart;
