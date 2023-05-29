import { StyleSheet } from "react-native";

export const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  inputContainer: {
    width: "65%",
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 10,
  },
  input: {
    width: "100%",
    height: 40,
    marginVertical: 10,
    padding: 10,
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 4,
    backgroundColor: "#fff",
  },
  loginButton: {
    width: "100%",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 12,
    paddingHorizontal: 32,
    marginTop: 10,
    borderRadius: 4,
    backgroundColor: "green",
  },
  text: {
    fontSize: 16,
    lineHeight: 21,
    fontWeight: "bold",
    letterSpacing: 0.25,
    color: "white",
  },
  link: {
    marginTop: 10,
    color: "#007bff",
    textDecorationLine: "underline",
  },
});
