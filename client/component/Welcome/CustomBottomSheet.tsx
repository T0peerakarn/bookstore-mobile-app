import { useRef } from "react";
import { StyleSheet, Text, View } from "react-native";
import { Heading } from "react-native-sketchbook";

import BottomSheet, { BottomSheetView } from "@gorhom/bottom-sheet";
import CustomButton from "../CustomButton";

const CustomBottomSheet = () => {
  const bottomSheetRef = useRef<BottomSheet>(null);

  return (
    <BottomSheet
      ref={bottomSheetRef}
      index={1}
      snapPoints={["40%"]}
      enablePanDownToClose={false}
      enableHandlePanningGesture={false}
      enableContentPanningGesture={false}
      handleComponent={null}
      backgroundStyle={{ borderRadius: 50 }}
    >
      <BottomSheetView style={styles.bottomSheetContainer}>
        <Heading style={styles.heading}>Your next chapter start here.</Heading>
        <View>
          <Text style={styles.text}>
            Explore a world of books at your fingertips.
          </Text>
          <Text style={styles.text}>
            Find your next great read anytime, anywhere.
          </Text>
        </View>
        <CustomButton title="Get Started" onPress={() => console.log("Yay!")} />
      </BottomSheetView>
    </BottomSheet>
  );
};

const styles = StyleSheet.create({
  bottomSheetContainer: {
    padding: 48,
    alignItems: "center",
    gap: 60,
  },
  heading: {
    fontFamily: "Inter",
    fontSize: 24,
    fontWeight: 600,
    lineHeight: 26.63,
    textAlign: "center",
    color: "#713030",
  },
  text: {
    fontFamily: "Inter",
    fontSize: 15,
    fontWeight: 300,
    lineHeight: 18.15,
    textAlign: "center",
  },
});

export default CustomBottomSheet;
