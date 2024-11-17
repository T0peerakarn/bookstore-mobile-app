import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";

import Welcome from "../../pages/Welcome";
import SignInSignUp from "../../pages/SignInSignUp";

const Stack = createNativeStackNavigator();

export type RootStackParamsList = {
  Welcome: undefined;
  SignInSignUp: undefined;
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
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default RootComponent;
