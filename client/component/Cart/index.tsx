import React, {useState} from "react";
import { StyleSheet, Text, View, FlatList, TouchableOpacity, ScrollView } from "react-native";
import { Image } from "react-native-elements";
import { Heading } from "react-native-sketchbook";
import { useSharedState } from "../../utility/sharedState";
import {useLazyQuery} from "@apollo/client";
import {GET_BOOK_BY_ISBN} from "../../queries/books";

const Cart = () => {
    const { addedBooks, setAddedBooks } = useSharedState();
    const [selectAll, setSelectAll] = useState(false);
    const removeFromCart = (isbn: string) => {
        setAddedBooks((prevBooks) => prevBooks.filter((book) => book.selectBook.isbn !== isbn));
    };
    const [selectBook, setSelectBook] = useState([])

    const totalPrice = () => {
        return addedBooks.reduce((total, book) => {
            if (book.isSelectedForCheckout) {
                // Add price * bookAmount for selected books
                return total + (book.selectBook.price * book.bookAmount);
            }
            return total;
        }, 0);
    };
    const toggleBookSelection = (isbn: string) => {
        setAddedBooks((prevBooks) =>
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
        setAddedBooks((prevBooks) =>
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
        setAddedBooks((prevBooks) =>
            prevBooks.map((book) => ({
                ...book,
                isSelectedForCheckout: newSelectAllState,
            }))
        );
    };

    const renderBook = ({ item }: any) => {
        const authors = Array.isArray(item.selectBook?.authors)
            ? item.selectBook.authors.map((author) => author.name).join(", ")
            : "Unknown Author";



        return (
            <View style={styles.container2}>
                <View style={styles.horizontalLine} />
                <View style={styles.bookContainer}>
                    <TouchableOpacity
                        style={styles.checkboxContainer}
                        onPress={() => toggleBookSelection(item.selectBook.isbn)}
                    >
                        <View style={[styles.checkbox, item.isSelectedForCheckout && styles.checked]}>
                        </View>
                    </TouchableOpacity>
                    <Image
                        source={{uri: item.selectBook.image || "https://via.placeholder.com/100"}} // Placeholder if no image
                        style={styles.bookImage}
                    />

                    <View style={styles.bookDetails}>

                        <Text style={styles.title}>{item.selectBook.title}</Text>
                        <Text style={styles.author}>{authors}</Text>
                        <Text> ${item.selectBook.price}</Text>
                        <Text style={styles.amount}> ({item.selectBook.amount} in stock)</Text>

                        <View style={styles.col_pop}>
                            <View style={styles.col_pop}>
                                <TouchableOpacity style={styles.adjustButton} onPress={() => updateBookAmount(item.selectBook.isbn, -1)}>
                                    <Text style={styles.closeButtonText}>-</Text>
                                </TouchableOpacity>
                                <Text>{item.bookAmount}</Text>
                                <TouchableOpacity style={styles.adjustButton} onPress={() => updateBookAmount(item.selectBook.isbn, 1)}>
                                    <Text style={styles.closeButtonText}>+</Text>
                                </TouchableOpacity>
                            </View>
                        </View>
                        <TouchableOpacity style={styles.closeButton} onPress={()=> removeFromCart(item.selectBook.isbn)}>
                            <Text style={styles.closeButtonText}>X</Text>
                        </TouchableOpacity>

                    </View>
                </View>
            </View>)
    };

    return (
        <View style={styles.container}>
            <Heading style={styles.heading}>My cart</Heading>
            <TouchableOpacity
                style={styles.checkboxContainer}
                onPress={toggleSelectAll}
            >
                <View style={[styles.checkbox_all, selectAll && styles.checked]}>
                    {selectAll && <Text style={styles.checkmark}>✔</Text>}
                </View>
                <Text style={styles.checkboxLabel}>Select All</Text>
            </TouchableOpacity>
            {addedBooks.length > 0 ? (
                <FlatList
                    data={addedBooks}
                    renderItem={renderBook}
                    keyExtractor={(item) => item.selectBook.isbn}
                />
            ) : (
                <Text style={styles.emptyText}>Your cart is empty</Text>
            )}
            <View style={styles.totalPriceContainer}>
                <Text style={styles.price}>Total Price: ${totalPrice().toFixed(2)}</Text>
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    totalPriceContainer: {
        marginTop: 20,
        padding: 10,
        borderTopWidth: 1,
        borderColor: "#DDD",
        alignItems: "flex-end",
    },
    horizontalLine: {
        width: '100%', // 80% of the screen width
        height: 2,    // Line thickness
        backgroundColor: '#E8E8E8', // Line color
    },
    checkboxContainer: {
        flexDirection: "row",
        alignItems: "center",
        marginTop: 10,
    },
    checkbox_all: {
        width: 23,
        height: 23,
        backgroundColor:'#D9D9D9',
        borderRadius: 5,
        justifyContent: "center",
        alignItems: "center",
        marginRight: 10,
        marginBottom: 10
    },
    checkbox: {
        width: 23,
        height: 23,
        backgroundColor:'#D9D9D9',
        borderRadius: 5,
        justifyContent: "center",
        alignItems: "center",
        marginRight: 10,
    },
    checkboxLabel: {
        fontSize: 15,
        fontWeight: '400',
        fontFamily: 'Inter',
        color: '#939393'
    },
    checked: {
        backgroundColor: "#713030", // Green background when checked
    },
    checkmark: {
        color: "#FFF",
        fontWeight: "bold",
    },
    closeButtonText: {
        color: "#FFF",
        fontWeight: "600",
    },
    col_pop:{
        left: 55,
        flex: 1,
        flexDirection: 'row',
        alignItems: 'center',
        gap: 10,
        marginTop: 5,
        width: '95%',
    },
    adjustButton: {
        width: 28,
        height: 29,
        backgroundColor: "#D9D9D9",
        borderRadius: 6,
        justifyContent: "center",
        alignItems: "center",

    },
    container: {
        flex: 1,
        padding: 20,
    },
    heading: {
        fontFamily:'Inter',
        color: '#713030',
        fontWeight: '400',
        fontSize: 18,
        marginBottom: 20,
    },
    closeButton: {
        position: "absolute", // Makes it float relative to modalContent
        top: 2, // Distance from the top of the modal
        left: 170,
        width: 22,
        height: 22,
        backgroundColor: "#D9D9D9",
        borderRadius: 30,
        justifyContent: "center",
        alignItems: "center",
        zIndex: 1
    },

    container2:{
        flexDirection:'column'
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
    amount:{
        fontFamily: 'Inter',
        fontSize: 15,
        fontStyle: 'italic',
        fontWeight: '300',
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
        fontSize: 16,
        textAlign: "center",
        marginTop: 50,
        color: "#999",
    },
    price:{
        fontSize: 16,
        fontWeight: '500',
        fontFamily: 'Inter',
    },

});

export default Cart;
