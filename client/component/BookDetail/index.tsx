    import { useLazyQuery } from '@apollo/client';
    import Book, { IBook } from "../Bookshelf/Book";
    import {Button, Image} from "react-native-elements";
    import { GET_BOOK_BY_ISBN } from '../../queries/books';
    import HorizontalLine from "../HorizontalLine";
    import {ActivityIndicator, Modal, TouchableOpacity} from "react-native"; // Adjust the path as needed
    import { Ionicons } from '@expo/vector-icons';

    import React, {useState} from 'react';
    import { StyleSheet, Text, View, ScrollView } from 'react-native';
    import {useNavigation} from "@react-navigation/native";
    import {NativeStackNavigationProp} from "@react-navigation/native-stack";
    import {RootStackParamsList} from "../RootComponent";
    import {useSharedState} from "../../utility/sharedState";
    // import Swal from 'sweetalert2';

    const BookDetail = ({route}: any) => {
        const param = route.params;
        const isbn = param.isbn
        const {addedBooks, setAddedBooks} = useSharedState()

        const [fetchBook, {loading, error, data}] = useLazyQuery(GET_BOOK_BY_ISBN, {
            variables: {isbn},
        })
        const navigation = useNavigation<NativeStackNavigationProp<RootStackParamsList, "BookDetail">>();
        const handlePress = () =>{
            navigation.goBack();
        }

        const handleFetch = async () => {
            try {
                await fetchBook({ variables: { isbn } }); // Use the latest isbn

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
                const bookInCartIndex = addedBooks.findIndex((book) => book.isbn === isbn);

                const shopAvailableAmount = data.getBookByISBN.amount;
                if (bookInCartIndex !== -1){

                    const currentBookAmount = addedBooks[bookInCartIndex].bookAmount;
                    if (currentBookAmount + bookAmount > shopAvailableAmount) {
                        console.log("Exceeds available stock");
                        console.log(addedBooks)
                    } else {

                        const updatedBooks = [...addedBooks];
                        updatedBooks[bookInCartIndex].bookAmount += bookAmount;

                        setAddedBooks(updatedBooks); // Update the state
                        // Swal.fire("Updated cart")
                        console.log("Updated cart:", updatedBooks);
                    }
                }
                else {
                    // Swal.fire("Added books to cart")
                    setAddedBooks((prevBooks) => [...prevBooks, {isbn, bookAmount}]);
                }
            } catch (error) {
                console.error("Error adding book to cart:", error);
            }
        };

        React.useEffect(() => {
            handleFetch(); // This will fetch data when the component mounts
        }, [isbn]);

        if (data) {
            const book = data.getBookByISBN;

            const increaseBook = () => {
                if (bookAmount < book.amount){
                    setBookAmount(bookAmount+1);
                }
            }
            const decreaseBook = () => {
                if (bookAmount > 1){
                    setBookAmount(bookAmount-1)
                }
            }
            return (
                <View style={{ flex: 1 }}>
                    <TouchableOpacity
                        style={styles.back}
                        onPress={() => handlePress()}
                    >
                        <Ionicons name="arrow-back" style={styles.arrow}></Ionicons>
                        <Text style={styles.back_text}>  Previous Page</Text>
                    </TouchableOpacity>
                    <ScrollView contentContainerStyle={styles.container}>

                        <View style={styles.header}>
                            <Image
                            style={styles.big_image}
                            source={{uri: book.image}}
                            PlaceholderContent={<ActivityIndicator/>}
                            />
                            <View style={styles.column1}>
                                <View style={styles.box}>
                                    <Text style={styles.wrappedText}>{book.title}</Text>
                                    <Text style={styles.author}>{book.authors[0]?.name}</Text>
                                </View>
                                <View style={styles.column1}>
                                    <Text style={styles.currency}>$</Text>
                                    <Text style={styles.small_price}>{book.price}</Text>
                                </View>

                            </View>
                            <TouchableOpacity style={styles.button} onPress={handleAddToCart}>
                                <Text style={styles.button_text}> Add to Cart</Text>
                            </TouchableOpacity>
                        </View>


                        <View style={styles.column2}>
                            <View style={styles.box}>
                                <Text style={styles.title}>Year</Text>
                                <Text style={styles.text}>{book.yearOfPublication}</Text>
                            </View>

                            <View style={styles.box}>
                                <Text style={styles.title}>Availability </Text>
                                <Text style={styles.text}>{book.amount}</Text>
                            </View>
                            <View style={styles.box}>
                                <Text style={styles.title}>Publisher </Text>
                                <Text style={styles.text}>{book.publishers[0]?.name}</Text>
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
                                    <TouchableOpacity style={styles.closeButton} onPress={closeModal}>
                                        <Text style={styles.closeButtonText}>X</Text>
                                    </TouchableOpacity>
                                    <View style={styles.col_pop}>
                                        <Image
                                            style={styles.small_image}
                                            source={{uri: book.image}}
                                            PlaceholderContent={<ActivityIndicator/>}
                                        />
                                        <View style={styles.paragraph}>
                                            <Text style={styles.wrappedText}>{book.title}</Text>
                                            <Text style={styles.author}>{book.authors[0]?.name}</Text>
                                            <View style={styles.col_pop}>
                                                <Text style={styles.currency}>$</Text>
                                                <Text style={styles.price}>{book.price}</Text>
                                            </View>
                                            <Text style={styles.amount}>({book.amount} in stock)</Text>
                                        </View>

                                    </View>
                                    <View style={styles.col_pop}>
                                        <Text> Amount</Text>
                                        <View style={styles.col_pop}>
                                            <TouchableOpacity style={styles.adjustButton} onPress={() => decreaseBook()}>
                                                <Text style={styles.closeButtonText}>-</Text>
                                            </TouchableOpacity>
                                            <Text>{bookAmount}</Text>
                                            <TouchableOpacity style={styles.adjustButton} onPress={() => increaseBook()}>
                                                <Text style={styles.closeButtonText}>+</Text>
                                            </TouchableOpacity>
                                        </View>

                                    </View>
                                    <TouchableOpacity style={styles.button} onPress={handleAddedToCart}>
                                        <Text style={styles.button_text}> Add to Cart</Text>
                                    </TouchableOpacity>

                                </View>
                            </View>
                        </Modal>
                    </ScrollView>

                </View>
            );
        };
        return null;
    };

    const styles = StyleSheet.create(
        {
            container:{
                padding: 20,
                fontFamily: 'Inter',
                width: '100%'
            },
            currency: {
                fontSize: 20,
                fontWeight: '500',
            },
            arrow:{
                marginLeft: 50
            },
            header: {
                marginTop: 150,
                marginBottom: 20,
                alignItems: 'center',
            },
            title: {
                fontSize: 15,
                fontWeight: '600',
                color: '#9A9A9A',
                marginBottom: 30,
            },
            back:{
                width: 188,
                height: 40,
                backgroundColor: '#FFD16F',
                left: -50,
                top: 59,
                borderRadius: 30,
                flexDirection:'row',
                alignItems: "center",
                justifyContent: 'center',
                zIndex:1,
                position: "absolute",
            },
            back_text:{
                fontWeight: '400',
                fontSize: 14,
                color: '#713030',
                textAlign: "right",
            },
            column1:{
                flex: 1,
                flexDirection: 'row',
                textAlign: "left",
                alignItems: "center",
                flexWrap: "wrap",
                marginLeft: 2,
                marginBottom: 20,
                marginTop: 20,
                justifyContent: 'center'
            },
            column2:{
                flex: 1,
                flexDirection: 'row',
                alignItems: 'center',
                padding: 16,
            },
            paragraph:{
                flex: 1,
                flexDirection: 'column',
                alignItems: 'flex-start',
                marginLeft: 10,
                width: '100%',
                zIndex: 1
            },
            box1:{
                flexWrap: "wrap",
                padding:20
            },
            box:{
                flex: 1,
                flexDirection:'column',
                justifyContent: 'center',
                alignItems: 'center',
                padding:10,
            },
            col_pop:{
                flex: 1,
                flexDirection: 'row',
                marginTop: 5,
                width: '95%',
            },
            amount:{
                fontFamily: 'Inter',
                fontSize: 15,
                fontStyle: 'italic',
                fontWeight: '300',
            },
            big_image:{
                width: 254,
                height: 410,
            },
            small_image:{
                width: 100.91,
                height: 161,
                top:0,
                left: 0,
                borderRadius: 5.14
            },
            heading: {
                fontSize: 18,
                fontWeight: 'bold',
                color: '#333',
            },
            price:{
                fontSize: 50,
                fontWeight: '500',
            },
            small_price:{
                fontSize: 40,
                fontWeight: '500',
                fontFamily: 'Inter'
            },
            author:{
                fontSize: 18,
                fontWeight: '300',
                flexWrap: 'wrap',
            },
            button:{
                width: 250,
                height: 56,
                backgroundColor: '#713030',
                borderRadius: 30,
                alignItems: "center"
            },
            button_text:{
                marginTop: 12,
                fontWeight: '600',
                fontSize: 22,
                color: '#FFF'
            },
            text: {
                fontSize: 16,
                color: '#713030',
                lineHeight: 22,
            },
            wrappedText: {
                fontSize: 24,
                fontWeight: '500',
                lineHeight: 29.05,
                marginBottom: 10,
                fontFamily: "Inter",
                flexWrap: 'wrap',
                width: '100%'
            },
            modalContainer: {
                flex: 1,
                flexDirection: 'column',
                justifyContent: "center",
                alignItems: "center",
                backgroundColor: "rgba(0, 0, 0, 0.5)", // Semi-transparent background
            },
            modalContent: {
                width: 342,
                height: 408,
                padding: 20,
                backgroundColor: "#FFF",
                borderRadius: 20,
                alignItems: "center",
                shadowColor: "#000",
                shadowOffset: { width: 0, height: 2 },
                shadowOpacity: 0.25,
                shadowRadius: 3.84,
                elevation: 5, // For Android shadow
            },
            modalText: {
                fontSize: 18,
                marginBottom: 20,
                textAlign: "center",
            },
            closeButton: {
                position: "absolute", // Makes it float relative to modalContent
                top: 20, // Distance from the top of the modal
                left: 303,
                width: 22,
                height: 22,
                backgroundColor: "#D9D9D9",
                borderRadius: 30,
                justifyContent: "center",
                alignItems: "center",
                zIndex: 1
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
            }
        }
    );

    export default BookDetail;
