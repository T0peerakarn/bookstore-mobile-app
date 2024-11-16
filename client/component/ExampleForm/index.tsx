import { useState } from "react";
import {
  Button,
  SafeAreaView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";
import { SubHeading } from "react-native-sketchbook";

import { useMutation, useQuery } from "@apollo/client";

import { SIGN_UP, SIGN_IN } from "../../queries/users";

const styles = StyleSheet.create({
  container: {
    margin: 24,
    gap: 12,
  },
  textInput: {
    borderWidth: 1,
    padding: 3,
  },
});

const RootComponent = () => {
  const [signUpUsername, setSignUpUsername] = useState("");
  const [signUpPassword, setSignUpPassword] = useState("");
  const [signUpDisplay, setSignUpDisplay] = useState("");
  const [signInUsername, setSignInUsername] = useState("");
  const [signInPassword, setSignInPassword] = useState("");

  const [signUp] = useMutation(SIGN_UP);
  const { refetch: signIn } = useQuery(SIGN_IN);

  const signUpHandler = async () => {
    try {
      const { data } = await signUp({
        variables: {
          username: signUpUsername,
          password: signUpPassword,
          display: signUpDisplay,
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
        username: signInUsername,
        password: signInPassword,
      });
      console.log(data);
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      {/* Sign Up Component */}
      <View>
        <SubHeading>Sign Up</SubHeading>
        <View>
          <Text>username: </Text>
          <TextInput
            style={styles.textInput}
            value={signUpUsername}
            onChangeText={(newText) => setSignUpUsername(newText)}
          />
        </View>
        <View>
          <Text>password: </Text>
          <TextInput
            style={styles.textInput}
            value={signUpPassword}
            onChangeText={(newText) => setSignUpPassword(newText)}
          />
        </View>
        <View>
          <Text>display: </Text>
          <TextInput
            style={styles.textInput}
            value={signUpDisplay}
            onChangeText={(newText) => setSignUpDisplay(newText)}
          />
        </View>
        <Button title="Sign Up" onPress={signUpHandler} />
      </View>

      {/* Sign In Component */}
      <View>
        <SubHeading>Sign In</SubHeading>
        <View>
          <Text>username: </Text>
          <TextInput
            style={styles.textInput}
            value={signInUsername}
            onChangeText={(newText) => setSignInUsername(newText)}
          />
        </View>
        <View>
          <Text>password: </Text>
          <TextInput
            style={styles.textInput}
            value={signInPassword}
            onChangeText={(newText) => setSignInPassword(newText)}
          />
        </View>
        <Button title="Sign In" onPress={signInHandler} />
      </View>
    </SafeAreaView>
  );
};

export default RootComponent;
