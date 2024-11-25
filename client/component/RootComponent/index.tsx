import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";

import Welcome from "../../pages/Welcome";
import SignInSignUp from "../../pages/SignInSignUp";
import Main from "../../pages/Main";
import BookDetail from "../BookDetail";

const Stack = createNativeStackNavigator();

export type RootStackParamsList = {
  Welcome: undefined;
  SignInSignUp: undefined;
  Main: undefined;
  BookDetail: { isbn: string };
};

const RootComponent = () => {
  return (
    <NavigationContainer>
      <Stack.Navigator>
        <Stack.Screen
          name="Welcome"
          component={Welcome}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="SignInSignUp"
          component={SignInSignUp}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="Main"
          component={Main}
          options={{ headerShown: false }}
        />
        <Stack.Screen
            name="BookDetail"
            component={BookDetail}  // Add BookDetail screen here
            options={{ headerShown: false }}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default RootComponent;
