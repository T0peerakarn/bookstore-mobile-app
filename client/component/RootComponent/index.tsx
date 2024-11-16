import { useState } from "react";
import { Button, SafeAreaView, TextInput } from "react-native";
import { Heading } from "react-native-sketchbook";

import { useQuery } from "@apollo/client";

import { SIGN_IN } from "../../queries/users";

const RootComponent = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  const { refetch } = useQuery(SIGN_IN);

  const signIn = async () => {
    try {
      const { data } = await refetch({ username, password });
      console.log(data);
    } catch {
      console.error("Invalid username or password");
    }
  };

  return (
    <SafeAreaView>
      <Heading>Hello World</Heading>
      <TextInput
        value={username}
        onChangeText={(newText) => setUsername(newText)}
      />
      <TextInput
        value={password}
        onChangeText={(newText) => setPassword(newText)}
      />
      <Button title="sign in" onPress={signIn} />
    </SafeAreaView>
  );
};

export default RootComponent;
