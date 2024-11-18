import { ActivityIndicator, StyleSheet, Text, View } from "react-native";
import { Image } from "react-native-elements";
import { SubHeading } from "react-native-sketchbook";

export interface IBook {
  isbn: string;
  title: string;
  author: string;
  publisher: string;
  image: string;
  yearOfPublication: number;
}

const Book = ({ isbn, title, author, image }: IBook) => {
  return (
    <View style={styles.container}>
      <Image
        style={styles.image}
        source={{ uri: image }}
        resizeMode="cover"
        PlaceholderContent={<ActivityIndicator />}
      />
      <SubHeading style={styles.title} numberOfLines={1}>
        {title}
      </SubHeading>
      <Text style={styles.author} numberOfLines={1}>
        {author}
      </Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    gap: 8,
    maxWidth: 125,
    minWidth: 125,
  },
  image: {
    width: 125,
    height: 190,
    borderRadius: 10,
  },
  title: {
    fontFamily: "Inter",
    fontSize: 16,
    fontWeight: 400,
    color: "#4B4B4B",
  },
  author: {
    fontFamily: "Inter",
    fontSize: 10,
    fontWeight: 300,
    color: "#4B4B4B",
  },
});
export default Book;
