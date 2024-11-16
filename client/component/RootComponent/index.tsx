import { useEffect, useState } from "react";
import { Button, SafeAreaView, TextInput } from "react-native";
import { Heading } from "react-native-sketchbook";

import { useMutation } from "@apollo/client";

import { SIGN_IN } from "../../queries/users";

const RootComponent = () => {
  const [username, setUsername] = useState("t0p.eerakarn");
  const [password, setPassword] = useState("Top230746");

  const [signIn, { data, loading }] = useMutation(SIGN_IN);

  useEffect(() => {
    if (!loading && data) {
      console.log(data);
    }
  }, [loading]);

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
      <Button title="log" onPress={() => console.log(username, password)} />
      <Button
        title="sign in"
        onPress={() => signIn({ variables: { username, password } })}
      />
    </SafeAreaView>
  );
};

export default RootComponent;
