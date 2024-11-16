import { ImageBackground, StyleSheet, Text } from "react-native";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { SafeAreaProvider, SafeAreaView } from "react-native-safe-area-context";

import CustomBottomSheet from "./CustomBottomSheet";

const Welcome = () => {
  return (
    <SafeAreaProvider>
      <SafeAreaView style={styles.container} edges={[]}>
        <GestureHandlerRootView>
          <ImageBackground
            source={require("../../assets/bg_landing.jpeg")}
            style={styles.image}
            resizeMode="cover"
          >
            <CustomBottomSheet />
          </ImageBackground>
        </GestureHandlerRootView>
      </SafeAreaView>
    </SafeAreaProvider>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1 },
  image: { flex: 1, justifyContent: "center" },
});

export default Welcome;
