import { useState } from "react";
import { StyleSheet, Text, View } from "react-native";
import { SafeAreaProvider, SafeAreaView } from "react-native-safe-area-context";
import { Heading } from "react-native-sketchbook";

import { useMutation, useQuery } from "@apollo/client";

import CustomTextInput from "../../component/CustomTextInput";
import CustomButton from "../../component/CustomButton";

import { SIGN_IN, SIGN_UP } from "../../queries/users";

const SignInSignUp = () => {
  const [form, setForm] = useState<"Sign In" | "Sign Up">("Sign In");
  const [username, setUsername] = useState<String>("");
  const [password, setPassword] = useState<String>("");
  const [confirmPassword, setConfirmPassword] = useState<String>("");
  const [display, setDisplay] = useState<String>("");
  const [showPassword, setShowPassword] = useState<boolean>(false);
  const [showConfirmPassword, setShowConfirmPassword] =
    useState<boolean>(false);

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
      console.log(data);
    } catch (err) {
      console.error(err);
    }
  };

  const signInHandler = async () => {
    try {
      const { data } = await signIn({
        username,
        password,
      });
      console.log(data);
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <SafeAreaProvider>
      <SafeAreaView style={styles.container}>
        <Heading style={styles.heading}>
          {form === "Sign In" ? "Sign In" : "Sign Up"}
        </Heading>
        <View style={styles.formContainer}>
          <CustomTextInput
            value={username as string}
            onChangeText={(newText) => setUsername(newText)}
            placeholder="Username"
          />
          <CustomTextInput
            value={password as string}
            onChangeText={(newText) => setPassword(newText)}
            placeholder="Password"
            rightIconName={showPassword ? "eye" : "eye-off"}
            onPressRightIcon={() => setShowPassword(!showPassword)}
            secureTextEntry={!showPassword}
          />
          {form === "Sign Up" && (
            <>
              <CustomTextInput
                value={confirmPassword as string}
                onChangeText={(newText) => setConfirmPassword(newText)}
                placeholder="Confirm password"
                rightIconName={showConfirmPassword ? "eye" : "eye-off"}
                onPressRightIcon={() =>
                  setShowConfirmPassword(!showConfirmPassword)
                }
                secureTextEntry={!showConfirmPassword}
              />
              <CustomTextInput
                value={display as string}
                onChangeText={(newText) => setDisplay(newText)}
                placeholder="Display name"
              />
            </>
          )}
        </View>
        <Text style={styles.helperText}>
          {form === "Sign In"
            ? "Don't have an account? "
            : "Already have an account? "}
          <Text
            style={{
              color: "#713030",
              fontWeight: 600,
              textDecorationLine: "underline",
            }}
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
    fontWeight: 400,
    lineHeight: 30.26,
    textAlign: "center",
    color: "#713030",
  },
  helperText: {
    marginBottom: 12,
    fontFamily: "Inter",
    fontSize: 15,
    fontWeight: 300,
    lineHeight: 18.15,
    textAlign: "center",
  },
});

export default SignInSignUp;
