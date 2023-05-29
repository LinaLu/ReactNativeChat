import React, { useEffect, useRef, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  FlatList,
  NativeSyntheticEvent,
  NativeScrollEvent,
  ActivityIndicator,
} from "react-native";
import { format } from "date-fns";
import { Ionicons } from "@expo/vector-icons";
import { firestoreDB } from "../config/firebase";
import firebase from "@firebase/app-compat";
import {
  DocumentData,
  DocumentReference,
  FieldValue,
  QuerySnapshot,
} from "@firebase/firestore-types";

interface ChatMessage {
  id?: string;
  content: string;
  sender: string;
  timestamp: Date | FieldValue;
}

interface ChatMessageProps {
  message: ChatMessage;
  isOwnMessage: boolean;
}

export interface ChatComponentProps {
  userName: string;
}

const ChatMessageEntry: React.FC<ChatMessageProps> = ({
  message,
  isOwnMessage,
}) => {
  const containerStyle = isOwnMessage
    ? styles.ownContainer
    : styles.otherContainer;

  const textStyle = isOwnMessage ? styles.ownText : styles.otherText;

  return (
    <View style={[styles.container, containerStyle]}>
      <View style={styles.header}>
        <Text style={[styles.name, textStyle]}>{message.sender}</Text>
        <Text style={[styles.timestamp, textStyle]}>
          {format(message.timestamp as Date, "HH:mm")}
        </Text>
      </View>
      <Text style={textStyle}>{message.content}</Text>
    </View>
  );
};

const ChatPage: React.FC<ChatComponentProps> = ({ userName }) => {
  const [newMessage, setNewMessage] = useState("");
  const [messages, setMessages] = useState(Array<ChatMessage>);
  const [firstVisibleMsg, setFirstVisibleMsg] = useState<DocumentData | null>(
    null
  );
  const [loading, setLoading] = useState<boolean>(false);
  const scrollViewRef = useRef<FlatList>(null);

  const DOCUMENT_LIMIT = 10;

  const chatDocumentRef = firestoreDB
    .collection("chats")
    .doc("chatId") as DocumentReference<ChatMessage>;

  const handleSendMessage = async () => {
    if (newMessage === "") return;

    try {
      await chatDocumentRef.collection("messages").add({
        content: newMessage,
        sender: userName,
        timestamp: firebase.firestore.FieldValue.serverTimestamp(),
      } as ChatMessage);
      setNewMessage("");
    } catch (error) {
      console.error("Error sending message:", error);
    }
  };

  useEffect(() => {
    setMessages([]);
    const unsubscribe = subscribeToUpdates();
    return () => unsubscribe(); // so I don't receive message when component unmounts
  }, []);

  const fetchDocuments = async () => {
    try {
      setLoading(true);
      let query = chatDocumentRef
        .collection("messages")
        .orderBy("timestamp", "desc");

      if (firstVisibleMsg) {
        query = query.startAfter(firstVisibleMsg);
      }

      const snapshot = await query.limit(DOCUMENT_LIMIT).get();
      const newMessages = snapshot.docs.map((doc) => ({
        id: doc.id,
        content: doc.data().content,
        sender: doc.data().sender,
        timestamp: doc.data().timestamp.toDate(),
      }));

      const firstMessage = snapshot.docs[snapshot.docs.length - 1];

      setMessages((prevMessages) => [
        ...newMessages.reverse(),
        ...prevMessages,
      ]);

      if (firstMessage) setFirstVisibleMsg(firstMessage);
    } catch (error) {
      console.log("Error fetching documents:", error);
    } finally {
      setLoading(false);
    }
  };

  const subscribeToUpdates = () => {
    return chatDocumentRef
      .collection("messages")
      .orderBy("timestamp", "desc")
      .limit(DOCUMENT_LIMIT)
      .onSnapshot((snapshot: QuerySnapshot<DocumentData>) => {
        const firstMessage = snapshot.docs[snapshot.docs.length - 1];
        if (firstMessage) setFirstVisibleMsg(firstMessage);

        const newMessages = snapshot
          .docChanges()
          .filter(
            (change: DocumentData) =>
              change.type === "added" || change.type === "modified"
          )
          .map((change: DocumentData): ChatMessage => {
            const doc = change.doc;
            const data = change.doc.data();
            let timestamp = null;

            if (change.type === "added" && data.timestamp) {
              timestamp = data.timestamp.toDate();
            } else if (change.type === "modified" && data.timestamp) {
              timestamp = data.timestamp.toDate();
            }

            return {
              id: doc.id,
              content: data.content,
              sender: data.sender,
              timestamp,
            };
          })
          .filter((doc: ChatMessage) => doc.timestamp != null); //FIXME: replace with a reducer

        setMessages((prevMessages) => [
          ...prevMessages,
          ...newMessages.reverse(),
        ]);

        setTimeout(() => scrollToBottom(), 1000); //FIXME
      });
  };

  const scrollToBottom = () => {
    if (scrollViewRef.current) {
      scrollViewRef.current.scrollToEnd({ animated: true });
    }
  };

  const handleScroll = ({
    nativeEvent,
  }: NativeSyntheticEvent<NativeScrollEvent>) => {
    const { contentOffset } = nativeEvent;
    const isScrolledToTop = contentOffset.y === 0;

    if (isScrolledToTop) {
      fetchDocuments();
    }
  };

  return (
    <View style={styles.container}>
      {loading ? (
        <ActivityIndicator />
      ) : (
        <>
          <FlatList
            data={messages}
            ref={scrollViewRef}
            renderItem={({ item }) => (
              <ChatMessageEntry
                key={item.id}
                message={item}
                isOwnMessage={item.sender === userName}
              />
            )}
            onScroll={handleScroll}
            scrollEventThrottle={400}
          />
          <View style={styles.inputContainer}>
            <TextInput
              style={styles.input}
              placeholder="Write a message..."
              value={newMessage}
              textAlignVertical="top"
              onChangeText={setNewMessage}
              multiline
            />
            <TouchableOpacity style={styles.button} onPress={handleSendMessage}>
              <Ionicons name={"send"} size={24} color="black" />
            </TouchableOpacity>
          </View>
        </>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    maxWidth: "80%",
    marginVertical: 8,
    padding: 10,
    borderRadius: 8,
  },
  chatContainer: {
    flex: 1,
    padding: 16,
  },
  ownContainer: {
    alignSelf: "flex-end",
    backgroundColor: "#DCF8C6",
  },
  otherContainer: {
    alignSelf: "flex-start",
    backgroundColor: "#F0F0F0",
  },
  ownText: {
    color: "green",
  },
  otherText: {
    color: "black",
  },
  inputContainer: {
    flexDirection: "row",
    marginTop: 8,
    alignItems: "center",
    justifyContent: "center",
  },
  input: {
    width: "90%",
    borderWidth: 1,
    margin: 10,
    borderColor: "gray",
    borderRadius: 4,
    paddingHorizontal: 16,
  },
  button: {
    paddingVertical: 8,
    paddingHorizontal: 16,
    marginLeft: 8,
    borderRadius: 8,
    backgroundColor: "#DCF8C6",
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 5,
  },
  name: {
    fontSize: 16,
    fontWeight: "bold",
    marginRight: 5,
  },
  timestamp: {
    fontSize: 12,
  },
});

export default ChatPage;
