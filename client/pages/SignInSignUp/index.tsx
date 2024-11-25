import { useState } from "react";
import { StyleSheet, Text, View } from "react-native";
import { SafeAreaProvider, SafeAreaView } from "react-native-safe-area-context";
import { Heading } from "react-native-sketchbook";
import { useNavigation } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import AsyncStorage from "@react-native-async-storage/async-storage";

import { useMutation, useQuery } from "@apollo/client";

import CustomTextInput from "../../component/CustomTextInput";
import CustomButton from "../../component/CustomButton";

import { RootStackParamsList } from "../../component/RootComponent";

import { SIGN_IN, SIGN_UP } from "../../queries/users";

import SweetAlert, { showSweetAlert } from "../../component/SweetAlert";

const SignInSignUp = () => {
  const [form, setForm] = useState<"Sign In" | "Sign Up">("Sign In");
  const [username, setUsername] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [confirmPassword, setConfirmPassword] = useState<string>("");
  const [display, setDisplay] = useState<string>("");
  const [showPassword, setShowPassword] = useState<boolean>(false);
  const [showConfirmPassword, setShowConfirmPassword] =
    useState<boolean>(false);

  const navigation =
    useNavigation<NativeStackNavigationProp<RootStackParamsList, "Welcome">>();

  const [signUp] = useMutation(SIGN_UP);
  const { refetch: signIn } = useQuery(SIGN_IN);

  const signUpHandler = async () => {
    try {
      if (password != confirmPassword) {
        throw new Error("Passwords do not match");
      }

      const { data } = await signUp({
        variables: {
          username,
          password,
          display,
        },
      });

      await AsyncStorage.setItem("token", data.createUser);

      navigation.navigate("Main");
    } catch (err: any) {
      showSweetAlert({
        title: "Error!",
        text: err.graphQLErrors[0].message,
        showCancelButton: false,
        cancelButtonText: "",
        confirmButtonText: "Close",
        onConfirm: () => null,
        onClose: () => null,
        type: "danger",
      });
    }
  };

  const signInHandler = async () => {
    try {
      const { data } = await signIn({
        username,
        password,
      });

      await AsyncStorage.setItem("token", data.getToken);
      navigation.navigate("Main");
    } catch (err: any) {
      showSweetAlert({
        title: "Error!",
        text: err.graphQLErrors[0].message,
        showCancelButton: false,
        cancelButtonText: "",
        confirmButtonText: "Close",
        onConfirm: () => null,
        onClose: () => null,
        type: "danger",
      });
    }
  };

  return (
    <SafeAreaProvider>
      <SweetAlert />
      <SafeAreaView style={styles.container}>
        <Heading style={styles.heading}>
          {form === "Sign In" ? "Sign In" : "Sign Up"}
        </Heading>
        <View style={styles.formContainer}>
          <CustomTextInput
            value={username}
            onChangeText={(newText) => setUsername(newText)}
            placeholder="Username"
            autoCorrect={false}
          />
          <CustomTextInput
            value={password}
            onChangeText={(newText) => setPassword(newText)}
            placeholder="Password"
            rightIconName={showPassword ? "eye" : "eye-off"}
            onPressRightIcon={() => setShowPassword(!showPassword)}
            secureTextEntry={!showPassword}
            autoCorrect={false}
          />
          {form === "Sign Up" && (
            <>
              <CustomTextInput
                value={confirmPassword}
                onChangeText={(newText) => setConfirmPassword(newText)}
                placeholder="Confirm password"
                rightIconName={showConfirmPassword ? "eye" : "eye-off"}
                onPressRightIcon={() =>
                  setShowConfirmPassword(!showConfirmPassword)
                }
                secureTextEntry={!showConfirmPassword}
                autoCorrect={false}
              />
              <CustomTextInput
                value={display}
                onChangeText={(newText) => setDisplay(newText)}
                placeholder="Display name"
                autoCorrect={false}
              />
            </>
          )}
        </View>
        <Text style={styles.helperText}>
          {form === "Sign In"
            ? "Don't have an account? "
            : "Already have an account? "}
          <Text
            style={styles.x_text}
            onPress={() => setForm(form === "Sign In" ? "Sign Up" : "Sign In")}
          >
            {form === "Sign In" ? "Sign Up" : "Sign In"}
          </Text>
        </Text>
        <CustomButton
          title={form}
          onPress={form === "Sign In" ? signInHandler : signUpHandler}
        />
      </SafeAreaView>
    </SafeAreaProvider>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    padding: 48,
  },
  formContainer: {
    gap: 24,
    marginVertical: 60,
  },
  heading: {
    fontFamily: "Inter",
    fontSize: 25,
    fontWeight: "400",
    lineHeight: 30.26,
    textAlign: "center",
    color: "#713030",
  },
  helperText: {
    marginBottom: 12,
    fontFamily: "Inter",
    fontSize: 15,
    fontWeight: "300",
    lineHeight: 18.15,
    textAlign: "center",
  },
  x_text: {
    color: "#713030",
    fontWeight: "600",
    textDecorationLine: "underline",
  },
});

export default SignInSignUp;
