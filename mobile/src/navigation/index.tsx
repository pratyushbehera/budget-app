import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";

import LoginScreen from "../screens/LoginScreen";
// import SignupScreen from "../screens/SignupScreen";
// import HomeTabs from "./HomeTabs";

const Stack = createNativeStackNavigator();

export default function RootNavigator() {
  return (
    <NavigationContainer>
      <Stack.Navigator screenOptions={{ headerShown: false }}>
        <Stack.Screen name="Login" component={LoginScreen} />
        {/* <Stack.Screen name="Signup" component={SignupScreen} /> */}
        {/* <Stack.Screen name="Main" component={HomeTabs} /> */}
      </Stack.Navigator>
    </NavigationContainer>
  );
}
