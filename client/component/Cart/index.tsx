import {Heading} from "react-native-sketchbook";
import {useSharedState} from "../../utility/sharedState";

const Cart = () => {
    const {addedBooks, setAddedBooks} = useSharedState();
    console.log('you?',addedBooks)
    return <Heading>Cart</Heading>;
};

export default Cart;
