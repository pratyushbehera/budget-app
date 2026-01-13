import { View, Text, TextInput, Pressable } from "react-native";
import { useRouter } from "expo-router";
import { useState } from "react";

export default function Login() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  return (
    <View style={{ padding: 20 }}>
      <Text style={{ fontSize: 24, marginBottom: 16 }}>Login</Text>

      <TextInput
        placeholder="Email"
        value={email}
        onChangeText={setEmail}
        style={{ borderWidth: 1, padding: 12, marginBottom: 12 }}
      />

      <TextInput
        placeholder="Password"
        secureTextEntry
        value={password}
        onChangeText={setPassword}
        style={{ borderWidth: 1, padding: 12, marginBottom: 20 }}
      />

      <Pressable
        //onPress={() => router.replace("/(tabs)")}
        style={{ backgroundColor: "#000", padding: 14 }}
      >
        <Text style={{ color: "#fff", textAlign: "center" }}>Login</Text>
      </Pressable>
    </View>
  );
}
