import { StyleSheet } from "react-native";
import { SafeAreaProvider, SafeAreaView } from "react-native-safe-area-context";

import NavigationBar from "../../component/NavigationBar";

const Store = () => {
  return (
    <SafeAreaProvider>
      <SafeAreaView style={styles.container} edges={[]}>
        <NavigationBar />
      </SafeAreaView>
    </SafeAreaProvider>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});

export default Store;
