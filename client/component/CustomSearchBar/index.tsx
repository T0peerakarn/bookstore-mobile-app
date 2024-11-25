import { useEffect, useRef } from "react";
import { Animated, StyleSheet, Text, TextInput, View } from "react-native";
import { SubHeading } from "react-native-sketchbook";

import CustomTextInput, { ICustomTextInput } from "../CustomTextInput";
import CustomChip from "../CustomChip";

import { SearchKeyType } from "../Store";

interface ICustomSearchBar extends ICustomTextInput {
  isSearching: boolean;
  setIsSearching: (newBoolean: boolean) => void;
  searchBy: { key: string; display: string }[];
  searchKey: SearchKeyType;
  setSearchKey: (newSearchKey: SearchKeyType) => void;
  maxHeight?: number;
}

const CustomSearchBar = ({
  isSearching,
  setIsSearching,
  searchBy,
  searchKey,
  setSearchKey,
  maxHeight = 200,
  ...CustomTextInputProps
}: ICustomSearchBar) => {
  const animatedHeight = useRef(new Animated.Value(0)).current;
  const inputRef = useRef<TextInput>(null);

  useEffect(() => {
    Animated.timing(animatedHeight, {
      toValue: isSearching ? maxHeight : 0,
      duration: 300,
      useNativeDriver: false,
    }).start();

    if (!isSearching) {
      inputRef.current?.blur();
    } else {
      inputRef.current?.focus();
    }
  }, [isSearching]);

  return (
    <View>
      <CustomTextInput
        {...CustomTextInputProps}
        ref={inputRef}
        onFocus={() => setIsSearching(true)}
        onBlur={() => setIsSearching(false)}
      />
      <Animated.View
        style={{
          height: animatedHeight,
        }}
      >
        {isSearching && (
          <View style={styles.container}>
            <SubHeading style={styles.heading}>Search by</SubHeading>
            <View style={styles.chipsContainer}>
              {searchBy.map((item) => (
                <CustomChip
                  key={item.key}
                  display={item.display}
                  selected={item.key === searchKey}
                  onPress={() => setSearchKey(item.key as SearchKeyType)}
                />
              ))}
            </View>
          </View>
        )}
      </Animated.View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginTop: 12,
    gap: 12,
  },
  heading: {
    fontFamily: "Inter",
    fontSize: 18,
    fontWeight: 500,
    color: "#713030",
  },
  chipsContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8,
  },
});

export default CustomSearchBar;
