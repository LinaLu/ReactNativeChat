import { useRouter } from "expo-router";
import React, { useState } from "react";
import { View, TextInput, Text, Pressable } from "react-native";
import { styles } from "../styles";

const LoginPage: React.FC = () => {
  const [userName, setUserName] = useState("");
  const navigation = useRouter();

  const handleLogin = () => {

    navigation.push({ pathname: "/chat", params: { userName: userName ? userName : "anonymous" } });
  };

  return (
    <View style={styles.container}>
      <View style={styles.inputContainer}>
        <TextInput
          style={styles.input}
          placeholder="Name"
          value={userName}
          onChangeText={setUserName}
        />
      </View>
      <View style={styles.inputContainer}>
        <Pressable style={styles.loginButton} onPress={handleLogin}>
          <Text style={styles.text}>Start Chatting</Text>
        </Pressable>
      </View>
    </View>
  );
};

export default LoginPage;
