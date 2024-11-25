import { StyleSheet, TextInput, TextInputProps, View } from "react-native";
import Icon from "react-native-vector-icons/Feather";

interface ICustomTextInput extends TextInputProps {
  leftIconName?: String;
  onPressLeftIcon?: () => void;
  rightIconName?: String;
  onPressRightIcon?: () => void;
}

const CustomTextInput = ({
  leftIconName,
  onPressLeftIcon,
  rightIconName,
  onPressRightIcon,
  ...TextInputProps
}: ICustomTextInput) => {
  return (
    <View style={styles.container}>
      {leftIconName && (
        <Icon
          name={leftIconName as string}
          style={styles.icon}
          onPress={onPressLeftIcon}
        />
      )}
      <TextInput
        style={styles.textInput}
        {...TextInputProps}
        autoCapitalize="none"
      />
      {rightIconName && (
        <Icon
          name={rightIconName as string}
          style={styles.icon}
          onPress={onPressRightIcon}
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    width: "100%",
    backgroundColor: "#F2F2F2",
    borderWidth: 1,
    borderColor: "rgba(113, 48, 48, 0.5)",
    borderRadius: 10,
    paddingVertical: 12,
    paddingHorizontal: 18,
    flexDirection: "row",
    alignItems: "center",
  },
  textInput: {
    flex: 1,
    fontSize: 18,
  },
  icon: {
    fontSize: 24,
    color: "#888888",
  },
});

export default CustomTextInput;
