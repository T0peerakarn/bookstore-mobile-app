import { useState, useEffect } from "react";
import {
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  Animated,
} from "react-native";
import Icon from "react-native-vector-icons/Feather";

import { LinearGradient } from "expo-linear-gradient";

interface INavigationBar {
  index: number;
  setIndex: (newIndex: number) => void;
}

const NavigationBar = ({ index, setIndex }: INavigationBar) => {
  const translateX = useState(new Animated.Value(0))[0];

  const NavItems = [
    { title: "Store", iconName: "book-open" },
    { title: "Cart", iconName: "shopping-cart" },
    { title: "User", iconName: "user" },
    { title: "Liked", iconName: "heart" },
  ];

  useEffect(() => {
    Animated.timing(translateX, {
      toValue: 85 * index,
      duration: 150,
      useNativeDriver: true,
    }).start();
  }, [index]);

  return (
    <>
      <View style={styles.container}>
        {NavItems.map((item, i) => (
          <TouchableOpacity
            key={item.title}
            style={styles.iconContainer}
            onPress={() => setIndex(i)}
          >
            <Icon
              name={item.iconName}
              style={{
                ...styles.iconImage,
                color: index === i ? "white" : "#575757",
              }}
            />
            <Text
              style={{
                ...styles.iconTitle,
                color: index === i ? "white" : "#575757",
              }}
            >
              {item.title}
            </Text>
          </TouchableOpacity>
        ))}
        <Animated.View
          style={[
            styles.selector,
            {
              transform: [{ translateX }],
            },
          ]}
        />
      </View>
      <LinearGradient
        colors={["transparent", "rgba(113, 48, 48, 0.7)"]}
        style={styles.background}
      />
    </>
  );
};

const styles = StyleSheet.create({
  container: {
    position: "absolute",
    bottom: 70,
    width: "90%",
    height: 75,
    backgroundColor: "white",
    left: "5%",
    borderRadius: 9999,
    zIndex: 9999,
    shadowColor: "#000000",
    shadowRadius: 3,
    shadowOpacity: 0.5,
    shadowOffset: { width: 0, height: 4 },
    alignItems: "center",
    justifyContent: "center",
    flexDirection: "row",
    padding: 24,
  },
  background: {
    width: "100%",
    height: 150,
    position: "absolute",
    bottom: 0,
    zIndex: 9998,
  },
  iconContainer: {
    flex: 1,
    alignItems: "center",
    minWidth: 85,
  },
  iconImage: {
    fontSize: 25,
  },
  iconTitle: {
    fontFamily: "Inter",
    fontSize: 12,
    fontWeight: 500,
  },
  selector: {
    position: "absolute",
    width: 85,
    height: 60,
    backgroundColor: "#713030",
    left: 24,
    zIndex: -1,
    borderRadius: 9999,
  },
});

export default NavigationBar;
