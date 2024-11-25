import React, { forwardRef } from "react";
import { StyleSheet, TextInput, TextInputProps, View } from "react-native";
import Icon from "react-native-vector-icons/Feather";

export interface ICustomTextInput extends TextInputProps {
  leftIconName?: string;
  onPressLeftIcon?: () => void;
  rightIconName?: string;
  onPressRightIcon?: () => void;
}

const CustomTextInput = forwardRef<TextInput, ICustomTextInput>(
  (
    {
      leftIconName,
      onPressLeftIcon,
      rightIconName,
      onPressRightIcon,
      ...TextInputProps
    },
    ref
  ) => {
    return (
      <View style={styles.container}>
        {leftIconName && (
          <Icon
            name={leftIconName}
            style={{ ...styles.icon, marginRight: 6 }}
            onPress={onPressLeftIcon}
          />
        )}
        <TextInput
          ref={ref} // Pass the ref to the underlying TextInput
          style={styles.textInput}
          {...TextInputProps}
          autoCapitalize="none"
        />
        {rightIconName && (
          <Icon
            name={rightIconName}
            style={styles.icon}
            onPress={onPressRightIcon}
          />
        )}
      </View>
    );
  }
);

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
