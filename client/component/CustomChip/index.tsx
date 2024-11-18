import {
  StyleSheet,
  Text,
  TouchableOpacity,
  TouchableOpacityProps,
} from "react-native";

interface ICustomChip extends TouchableOpacityProps {
  display: string;
  selected: boolean;
}

const CustomChip = ({
  display,
  selected,
  ...TouchableOpacityProps
}: ICustomChip) => {
  return (
    <TouchableOpacity
      style={{ ...style.chip, backgroundColor: selected ? "#FFC584" : "white" }}
      {...TouchableOpacityProps}
    >
      <Text style={style.chipText}>{display}</Text>
    </TouchableOpacity>
  );
};

const style = StyleSheet.create({
  chip: {
    alignSelf: "flex-start",
    borderRadius: 9999,
    paddingVertical: 6,
    paddingHorizontal: 18,
  },
  chipText: {
    fontFamily: "Inter",
    fontSize: 18,
    fontWeight: "light",
    textAlign: "center",
    color: "black",
  },
});
export default CustomChip;
