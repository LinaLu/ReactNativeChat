import { View } from "../components/Themed";
import { Stack } from "expo-router";
import LoginPage from "../components/LoginPage";
import { styles } from "../styles";

export default function MainScreen() {
  return (
    <View style={styles.container}>
      <Stack.Screen
        options={{
          title: "Login",
        }}
      />
      <LoginPage />
    </View>
  );
}
