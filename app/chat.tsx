import { View } from "../components/Themed";
import { Stack, useLocalSearchParams, useRouter } from "expo-router";
import { styles } from "../styles";
import { Text } from "../components/Themed";
import ChatPage from "../components/ChatPage";
import { Button } from "react-native";
import { useEffect, useState } from "react";

export default function ChatScreen() {
  const navigation = useRouter();
  const { userName: routeParam } = useLocalSearchParams<Record<string, string>>();
  const [userName, setUserName] = useState<string>();

  const handleLogout = () => {
    navigation.push({ pathname: "/" });
  };

  useEffect(() => {
    if (!routeParam){
      handleLogout() //FIXME should direct to error page
    } else {
      setUserName(routeParam)
    }
  }, [])

  return (
    <View style={styles.container}>
      <Stack.Screen
        options={{
          headerRight: () => (
            <Button onPress={() => handleLogout()} title="Logout" />
          ),
          headerTitle: (props) => <Text>{userName}</Text>,
        }}
      />
      { userName && <ChatPage userName={userName} />}
    </View>
  );
}
