import { useApolloClient, useLazyQuery } from "@apollo/client";
import { Image } from "react-native-elements";
import { GET_BOOK_BY_ISBN, TOGGLE_LIKE } from "../../queries/books";
import { ActivityIndicator, Modal, TouchableOpacity } from "react-native"; // Adjust the path as needed
import { Ionicons } from "@expo/vector-icons";

import React, { useState } from "react";
import { StyleSheet, Text, View, ScrollView } from "react-native";
import { useNavigation } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { RootStackParamsList } from "../RootComponent";
import { IAddedBook, useSharedState } from "../../utility/sharedState";
import CustomButton from "../CustomButton";
import SweetAlert, { showSweetAlert } from "../SweetAlert";
import AsyncStorage from "@react-native-async-storage/async-storage";

const BookDetail = ({ route }: any) => {
  const param = route.params;
  const isbn = param.isbn;
  const { addedBooks, setAddedBooks } = useSharedState();

  const [fetchBook, { data }] = useLazyQuery(GET_BOOK_BY_ISBN, {
    variables: { isbn },
    fetchPolicy: "network-only",
  });

  const client = useApolloClient();

  const toggleLike = async () => {
    const token = await AsyncStorage.getItem("token");
    await client.mutate({
      mutation: TOGGLE_LIKE,
      variables: { isbn },
      context: { headers: { authorization: token } },
    });
    await fetchBook({
      variables: { isbn },
      context: { headers: { authorization: token } },
    });
  };

  console.log(data);

  const navigation =
    useNavigation<
      NativeStackNavigationProp<RootStackParamsList, "BookDetail">
    >();

  const handlePress = () => {
    navigation.goBack();
  };

  const handleFetch = async () => {
    try {
      const token = await AsyncStorage.getItem("token");
      await fetchBook({
        variables: { isbn },
        context: { headers: { authorization: token } },
      }); // Use the latest isbn
    } catch (err) {
      console.error("Error fetching book:", err); // Handle errors
    }
  };

  const [isModalVisible, setModalVisible] = useState(false); // Modal state

  const handleAddToCart = () => {
    setModalVisible(true); // Show the modal when button is pressed
  };
  const closeModal = () => {
    setModalVisible(false); // Hide the modal
  };

  const [bookAmount, setBookAmount] = useState(1);

  const handleAddedToCart = () => {
    try {
      const bookInCartIndex = addedBooks.findIndex(
        (book: IAddedBook) => book.selectBook.isbn === isbn
      );
      const selectBook = data.getBookByISBN;
      const shopAvailableAmount = data.getBookByISBN.amount;
      if (bookInCartIndex !== -1) {
        const currentBookAmount = addedBooks[bookInCartIndex].bookAmount;
        if (currentBookAmount + bookAmount > shopAvailableAmount) {
          showSweetAlert({
            title: "Error!",
            text: "Exceeds available stock",
            showCancelButton: false,
            cancelButtonText: "",
            confirmButtonText: "Close",
            onConfirm: () => null,
            onClose: () => null,
            type: "danger",
          });
          console.log(addedBooks);
        } else {
          const updatedBooks = [...addedBooks];
          updatedBooks[bookInCartIndex].bookAmount += bookAmount;
          setAddedBooks(updatedBooks); // Update the state
          showSweetAlert({
            title: "Success!",
            text: "Book added to cart successfully",
            showCancelButton: false,
            cancelButtonText: "",
            confirmButtonText: "Close",
            onConfirm: () => null,
            onClose: () => null,
            type: "success",
          });
          console.log("Updated cart:", updatedBooks);
        }
      } else {
        showSweetAlert({
          title: "Success!",
          text: "Book added to cart successfully",
          showCancelButton: false,
          cancelButtonText: "",
          confirmButtonText: "Close",
          onConfirm: () => null,
          onClose: () => null,
          type: "success",
        });
        setAddedBooks((prevBooks: IAddedBook[]) => [
          ...prevBooks,
          { selectBook, bookAmount },
        ]);
      }
    } catch (error) {
      console.error("Error adding book to cart:", error);
    }
  };

  const formattedNameList = (list: { name: string }[]) =>
    list.map((list) => list.name).join(",\n");

  React.useEffect(() => {
    handleFetch(); // This will fetch data when the component mounts
  }, [isbn]);

  if (data) {
    const book = data.getBookByISBN;

    const increaseBook = () => {
      if (bookAmount < book.amount) {
        setBookAmount(bookAmount + 1);
      }
    };
    const decreaseBook = () => {
      if (bookAmount > 1) {
        setBookAmount(bookAmount - 1);
      }
    };
    return (
      <View style={{ flex: 1 }}>
        <TouchableOpacity style={styles.back} onPress={() => handlePress()}>
          <Ionicons name="arrow-back" style={styles.arrow}></Ionicons>
          <Text style={styles.back_text}> Previous Page</Text>
        </TouchableOpacity>
        <ScrollView contentContainerStyle={styles.container}>
          <View style={styles.main}>
            <Image
              style={styles.big_image}
              source={{ uri: book.image }}
              PlaceholderContent={<ActivityIndicator />}
            />
            <View style={{ width: "100%" }}>
              <View
                style={{
                  flexDirection: "row",
                  alignItems: "center",
                }}
              >
                <Text style={styles.bookTitle}>{book.title}</Text>
                <Ionicons
                  name="heart"
                  style={{
                    fontSize: 40,
                    color: data.getBookByISBN.liked ? "red" : "#D9D9D9",
                    marginLeft: "auto",
                  }}
                  onPress={toggleLike}
                />
              </View>
              <View
                style={{
                  flexDirection: "row",
                  alignItems: "flex-end",
                }}
              >
                <Text style={styles.bookAuthor}>
                  {formattedNameList(book.authors)}
                </Text>
                <View
                  style={{
                    flexDirection: "row",
                    alignItems: "flex-end",
                    marginLeft: "auto",
                  }}
                >
                  <Text style={styles.currency}>$</Text>
                  <Text style={styles.bookPrice}>{book.price}</Text>
                </View>
              </View>
            </View>
            <CustomButton
              title={book.amount === 0 ? "Out of Stock" : "Add to Cart"}
              onPress={handleAddToCart}
              disabled={book.amount === 0}
            />

            <View style={{ flexDirection: "row" }}>
              <View style={styles.box}>
                <Text style={styles.title}>Year</Text>
                <View style={{ flex: 1, justifyContent: "center" }}>
                  <Text style={styles.text}>{book.yearOfPublication}</Text>
                </View>
              </View>

              <View style={styles.box}>
                <Text style={styles.title}>Availability</Text>
                <View style={{ flex: 1, justifyContent: "center" }}>
                  <Text style={styles.text}>{book.amount}</Text>
                </View>
              </View>

              <View style={styles.box}>
                <Text style={styles.title}>Publisher</Text>
                <View style={{ flex: 1, justifyContent: "center" }}>
                  <Text style={styles.text}>
                    {formattedNameList(book.publishers)}
                  </Text>
                </View>
              </View>
            </View>
          </View>

          <Modal
            visible={isModalVisible}
            animationType="slide"
            transparent={true}
            onRequestClose={closeModal}
          >
            <View style={styles.modalContainer}>
              <View style={styles.modalContent}>
                <TouchableOpacity
                  style={styles.closeButton}
                  onPress={closeModal}
                >
                  <Text style={styles.closeButtonText}>X</Text>
                </TouchableOpacity>

                <View style={{ flexDirection: "row", gap: 20 }}>
                  <Image
                    style={{
                      width: 100,
                      height: 160,
                      borderRadius: 8,
                    }}
                    source={{ uri: book.image }}
                    PlaceholderContent={<ActivityIndicator />}
                  />

                  <View style={{ justifyContent: "space-evenly" }}>
                    <Text
                      style={{
                        ...styles.bookTitle,
                        fontSize: 20,
                        maxWidth: 250,
                      }}
                    >
                      {book.title}
                    </Text>
                    <Text
                      style={{
                        ...styles.bookAuthor,
                        fontSize: 16,
                        marginBottom: 0,
                      }}
                    >
                      {formattedNameList(book.authors)}
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
                        {book.price}
                      </Text>
                    </View>
                    <Text style={styles.amount}>({book.amount} in stock)</Text>
                  </View>
                </View>

                <View style={{ alignItems: "center" }}>
                  <View style={{ flexDirection: "row", marginVertical: 40 }}>
                    <View
                      style={{
                        flex: 1,
                        flexDirection: "row",
                        alignItems: "center",
                        justifyContent: "center",
                        gap: 20,
                      }}
                    >
                      <Text
                        style={{
                          textAlign: "center",
                          fontSize: 18,
                        }}
                      >
                        Amount
                      </Text>
                    </View>
                    <View
                      style={{
                        flex: 1,
                        flexDirection: "row",
                        alignItems: "center",
                        justifyContent: "center",
                        gap: 20,
                      }}
                    >
                      <TouchableOpacity
                        style={styles.adjustButton}
                        onPress={() => decreaseBook()}
                      >
                        <Text
                          style={{ ...styles.closeButtonText, fontSize: 24 }}
                        >
                          -
                        </Text>
                      </TouchableOpacity>
                      <Text style={{ fontSize: 18 }}>{bookAmount}</Text>
                      <TouchableOpacity
                        style={styles.adjustButton}
                        onPress={() => increaseBook()}
                      >
                        <Text
                          style={{ ...styles.closeButtonText, fontSize: 24 }}
                        >
                          +
                        </Text>
                      </TouchableOpacity>
                    </View>
                  </View>
                  <CustomButton
                    title="Add to Cart"
                    onPress={handleAddedToCart}
                  />
                </View>
              </View>
            </View>
          </Modal>

          <SweetAlert />
        </ScrollView>
      </View>
    );
  }
  return null;
};

const styles = StyleSheet.create({
  notiContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
  },
  notification: {
    padding: 20,
    borderRadius: 10,
    alignItems: "center",
  },
  success: {
    backgroundColor: "green",
  },
  error: {
    backgroundColor: "red",
  },
  notificationText: {
    color: "white",
    fontSize: 16,
  },
  container: {
    padding: 20,
    fontFamily: "Inter",
    width: "100%",
  },
  arrow: {
    marginLeft: 50,
  },
  title: {
    fontSize: 15,
    fontWeight: "600",
    color: "#9A9A9A",
  },
  back: {
    width: 188,
    height: 40,
    backgroundColor: "#FFD16F",
    left: -50,
    top: 59,
    borderRadius: 30,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    zIndex: 1,
    position: "absolute",
  },
  back_text: {
    fontWeight: "400",
    fontSize: 14,
    color: "#713030",
    textAlign: "right",
  },
  box: {
    flex: 1,
    flexDirection: "column",
    alignItems: "center",
    padding: 10,
  },
  amount: {
    fontFamily: "Inter",
    fontSize: 15,
    fontStyle: "italic",
    fontWeight: "300",
  },
  big_image: {
    width: 254,
    height: 410,
    borderRadius: 15,
    shadowColor: "#000000",
    shadowRadius: 3,
    shadowOpacity: 0.5,
    shadowOffset: { width: 0, height: 4 },
  },
  text: {
    fontSize: 16,
    color: "#713030",
    textAlign: "center",
  },
  modalContainer: {
    flex: 1,
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0.5)", // Semi-transparent background
  },
  modalContent: {
    width: "90%",
    padding: 20,
    backgroundColor: "#FFF",
    borderRadius: 20,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5, // For Android shadow
  },
  closeButton: {
    position: "absolute", // Makes it float relative to modalContent
    top: 12, // Distance from the top of the modal
    right: 12,
    width: 22,
    height: 22,
    backgroundColor: "#D9D9D9",
    borderRadius: 30,
    justifyContent: "center",
    alignItems: "center",
    zIndex: 1,
  },
  closeButtonText: {
    color: "#FFF",
    fontWeight: "600",
  },
  adjustButton: {
    width: 28,
    height: 29,
    backgroundColor: "#D9D9D9",
    borderRadius: 6,
    justifyContent: "center",
    alignItems: "center",
    zIndex: 1,
  },
  main: {
    marginTop: 150,
    alignItems: "center",
    gap: 30,
    padding: 10,
  },
  bookTitle: {
    fontSize: 24,
    fontWeight: "500",
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
});

export default BookDetail;
