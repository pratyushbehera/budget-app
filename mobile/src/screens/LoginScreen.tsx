import { View, Text, TextInput, Button } from "react-native";
import { useState } from "react";
import axios from "axios";

export default function LoginScreen({ navigation }: any) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleLogin = async () => {
    try {
      const res = await axios.post("http://YOUR_SERVER/api/auth/login", {
        email,
        password,
      });
      console.log("Logged in", res.data);
      navigation.replace("Main");
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <View>
      <Text>Login</Text>
      <TextInput placeholder="Email" value={email} onChangeText={setEmail} />
      <TextInput
        placeholder="Password"
        secureTextEntry
        value={password}
        onChangeText={setPassword}
      />
      <Button title="Login" onPress={handleLogin} />
    </View>
  );
}
