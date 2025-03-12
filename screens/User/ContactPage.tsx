import React, { useState, useEffect } from "react";
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert } from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { useNavigation } from "@react-navigation/native";
import { StackNavigationProp } from "@react-navigation/stack";
import { RootStackParamList } from "../../App"; // Import navigation types
import Icon from "react-native-vector-icons/Feather";
import { Keyboard, TouchableWithoutFeedback } from "react-native"; // ✅ Import to dismiss keyboard
import AsyncStorage from '@react-native-async-storage/async-storage';

const ContactPage = () => {
    const navigation = useNavigation<StackNavigationProp<RootStackParamList>>();
    const [subject, setSubject] = useState("");
    const [message, setMessage] = useState("");
    const [userEmail, setUserEmail] = useState(""); // Store logged-in user's email

    // Fetch logged-in user's email from AsyncStorage
    useEffect(() => {
        const getUserEmail = async () => {
            const storedEmail = await AsyncStorage.getItem('userEmail');
            console.log("🟡 Stored Email in AsyncStorage:", storedEmail); // <-- Add this to debug
            setUserEmail(storedEmail || "Unknown User");
        };
        getUserEmail();
    }, []);

    const sendMessage = async () => {
        if (!subject || !message) {
            Alert.alert("Error", "Please fill in both the subject and message fields.");
            return;
        }

        try {
            const response = await fetch("http://192.168.0.109:3000/api/send-message", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    recipient: "leexing0911@gmail.com",  // ✅ Fixed missing field
                    sender: userEmail,  // Hardcoded for now
                    subject,
                    message,
                    timestamp: new Date().toISOString(), // ✅ Add timestamp for sorting
                    type: 'user'                  // ✅ Identify this message as a user-sent message
                }),
            });

            const data = await response.json();
            if (data.success) {
                Alert.alert("Success", "Message sent successfully!");
                setSubject("");  // Clear the input fields
                setMessage("");  // Clear the input fields
            } else {
                Alert.alert("Error", "Failed to send the message.");
            }
        } catch (error) {
            console.error("Error:", error);
            Alert.alert("Error", "Something went wrong. Please try again.");
        }
    };

    return (
        <TouchableWithoutFeedback onPress={Keyboard.dismiss} accessible={false}>
            <LinearGradient colors={["#1a120b", "#b88b4a"]} style={styles.container}>
                {/* Back Button */}
                <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
                    <Icon name="arrow-left" size={24} color="#d4af37" />
                </TouchableOpacity>

                {/* Page Title */}
                <Text style={styles.title}>N O T I F I C A T I O N</Text>
                <View style={styles.titleLine} />

                {/* Send Button */}
                <TouchableOpacity
                    style={styles.sendButton}
                    onPress={sendMessage}  // ✅ Added the sendMessage function here
                >
                    <Icon name="send" size={24} color="#000" />
                </TouchableOpacity>

                {/* Contact Form */}
                <View style={styles.formContainer}>
                    {/* TO */}
                    <View style={styles.rowContainer}>
                        <Text style={styles.label}>To</Text>
                        <Text style={styles.boldText}>Admin</Text>
                    </View>
                    <View style={styles.separator} />

                    {/* FROM */}
                    <View style={styles.rowContainer}>
                        <Text style={styles.label}>From</Text>
                        <Text style={styles.normalText}>{userEmail}</Text>  {/* ✅ Display the stored email */}
                    </View>
                    <View style={styles.separator} />

                    {/* SUBJECT */}
                    <View style={styles.rowContainer}>
                        <Text style={styles.label}>Subject</Text>
                        <TextInput
                            style={styles.inputField}
                            placeholder=""
                            placeholderTextColor="#ffffff99"
                            value={subject}
                            onChangeText={setSubject}
                        />
                    </View>
                    <View style={styles.separator} />

                    {/* COMPOSE MESSAGE */}
                    <Text style={styles.composeLabel}>Compose Message</Text>
                    <TextInput
                        style={styles.messageField}
                        placeholder=""
                        placeholderTextColor="#ffffff99"
                        multiline
                        value={message}
                        onChangeText={setMessage}
                    />
                </View>

                {/* Bottom Navigation */}
                <LinearGradient colors={["#e6c78e", "#b88b4a"]} style={styles.bottomNav}>
                    <TouchableOpacity style={styles.navButton} onPress={() => navigation.navigate("Home")}>
                        <Icon name="home" size={30} color="#000" />
                        <Text style={styles.navText}>Home</Text>
                    </TouchableOpacity>

                    <TouchableOpacity style={styles.navButton} onPress={() => navigation.navigate("Access")}>
                        <Icon name="key" size={30} color="#000" />
                        <Text style={styles.navText}>Access</Text>
                    </TouchableOpacity>

                    <TouchableOpacity style={styles.navButton} onPress={() => navigation.navigate("Profile")}>
                        <Icon name="user" size={30} color="#000" />
                        <Text style={styles.navText}>Profile</Text>
                    </TouchableOpacity>
                </LinearGradient>
            </LinearGradient>
        </TouchableWithoutFeedback>
    );
};


const styles = StyleSheet.create({
    container: {
        flex: 1,
        paddingTop: 50,
        alignItems: "center",
    },
    backButton: {
        position: "absolute",
        top: 50,
        left: 35,
        marginTop: 30,
        zIndex: 10, // ✅ Ensures it's above everything
    },
    title: {
        fontSize: 24,
        fontWeight: "bold",
        color: "#d4af37",
        textAlign: "center",
        fontFamily: "Times New Roman",
        marginBottom: 10,
        marginTop: 30,
    },
    titleLine: {
        width: "85%", // ✅ Adjust width as needed
        height: 1, // ✅ Thickness of the line
        backgroundColor: "#d4af37", // ✅ Golden color like the text
        alignSelf: "center", // ✅ Centers the line
        marginTop: 1, // ✅ Spacing from title
        borderRadius: 2, // ✅ Smooth edges
        marginBottom: 10,
    },
    formContainer: {
        width: "85%",
        marginBottom: 20,
    },
    rowContainer: {
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "flex-start",
        width: "100%",
        paddingVertical: 5,
    },
    label: {
        fontSize: 16,
        color: "#A0A0A0",
        fontFamily: "Times New Roman",
        width: 70, // ✅ Keep spacing for "To", "From", "Subject"
    },
    composeLabel: {
        fontSize: 16,
        color: "#A0A0A0",
        fontFamily: "Times New Roman",
        width: 140, // ✅ Increased width for "Compose Message" so it stays in one line
        marginBottom: 10,
    },
    boldText: {
        fontSize: 18,
        color: "#fff",
        fontFamily: "Times New Roman",
        flex: 1,
    },
    normalText: {
        fontSize: 18,
        color: "#fff",
        fontFamily: "Times New Roman",
        flex: 1,
    },
    inputField: {
        fontSize: 16,
        color: "#fff",
        fontFamily: "Times New Roman",
        flex: 1,
        textAlign: "left",
        paddingVertical: 5,
    },
    messageField: {
        fontSize: 16,
        color: "#fff",
        fontFamily: "Times New Roman",
        flex: 1, // ✅ Makes the input expand properly
        textAlignVertical: "top", // ✅ Keeps text input aligned properly
        minHeight: 100, // ✅ Prevents input field from collapsing
        paddingVertical: 5,
    },
    separator: {
        width: "100%",
        height: 1,
        backgroundColor: "#A0A0A0",
        marginBottom: 15,
        borderRadius: 2,
    },
    sendButton: {
        alignSelf: "flex-end", // ✅ Keeps button aligned to the right
        backgroundColor: "#d4af37",
        padding: 12,
        borderRadius: 25,
        marginBottom: 20, // ✅ Adds space before the form
        marginRight: 30, // ✅ Slight offset for better placement
        marginTop: 20,
    },
    bottomNav: {
        position: "absolute",
        bottom: 30,
        flexDirection: "row",
        paddingVertical: 15,
        width: "85%",
        maxWidth: 350,
        borderRadius: 25,
        justifyContent: "space-around",
        alignSelf: "center",
        elevation: 5,
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.3,
        shadowRadius: 5,
    },
    navButton: {
        alignItems: "center",
    },
    navText: {
        color: "#000",
        fontSize: 16,
        fontFamily: "Times New Roman",
        fontWeight: "bold",
    },
});

export default ContactPage;