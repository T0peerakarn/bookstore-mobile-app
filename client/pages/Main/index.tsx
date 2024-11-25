import { useState } from "react";
import { ScrollView, StyleSheet } from "react-native";
import { SafeAreaProvider, SafeAreaView } from "react-native-safe-area-context";

import Store from "../../component/Store";
import Cart from "../../component/Cart";
import User from "../../component/User";
import Liked from "../../component/Liked";
import NavigationBar from "../../component/NavigationBar";

const Main = () => {
  const [index, setIndex] = useState<number>(0);

  const render = () => {
    switch (index) {
      case 0:
        return <Store />;
      case 1:
        return <Cart />;
      case 2:
        return <User />;
      case 3:
        return <Liked />;
    }
  };

  return (
    <>
      <SafeAreaProvider>
        <SafeAreaView style={styles.container} edges={["top"]}>
          <ScrollView contentContainerStyle={{ rowGap: 18 }}>
            {render()}
          </ScrollView>
        </SafeAreaView>
      </SafeAreaProvider>
      <NavigationBar
        index={index}
        setIndex={(newIndex: number) => setIndex(newIndex)}
      />
    </>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 36,
  },
});

export default Main;
