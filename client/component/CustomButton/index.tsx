import {
  StyleSheet,
  Text,
  TouchableOpacity,
  TouchableOpacityProps,
} from "react-native";

export interface ICustomButton extends TouchableOpacityProps {
  title: string;
  width?: number;
}

const CustomButton = ({
  title,
  width = 250,
  ...TouchableOpacityProps
}: ICustomButton) => {
  return (
    <TouchableOpacity
      {...TouchableOpacityProps}
      style={{ ...styles.button, width }}
    >
      <Text style={styles.text}>{title}</Text>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  button: {
    backgroundColor: "#713030",
    height: 56,
    justifyContent: "center",
    width: "100%",
    borderRadius: 9999,
    shadowColor: "#000000",
    shadowRadius: 3,
    shadowOpacity: 0.5,
    shadowOffset: { width: 0, height: 4 },
  },
  text: {
    fontFamily: "Inter",
    fontSize: 22,
    fontWeight: 600,
    lineHeight: 26.63,
    textAlign: "center",
    color: "white",
  },
});

export default CustomButton;
