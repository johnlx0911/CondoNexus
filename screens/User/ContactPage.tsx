import React, { useState } from "react";
import { View, Text, TextInput, TouchableOpacity, StyleSheet } from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { useNavigation } from "@react-navigation/native";
import { StackNavigationProp } from "@react-navigation/stack";
import { RootStackParamList } from "../../App"; // Import navigation types
import Icon from "react-native-vector-icons/Feather";

const ContactPage = () => {
    const navigation = useNavigation<StackNavigationProp<RootStackParamList>>();
    const [subject, setSubject] = useState("");
    const [message, setMessage] = useState("");

    return (
        <LinearGradient colors={["#1a120b", "#b88b4a"]} style={styles.container}>
            {/* Back Button */}
            <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
                <Icon name="arrow-left" size={24} color="#d4af37" />
            </TouchableOpacity>

            {/* Page Title */}
            <Text style={styles.title}>NOTIFICATION</Text>

            {/* Contact Form */}
            <View style={styles.formContainer}>
                <Text style={styles.label}>To</Text>
                <Text style={styles.adminText}>Admin</Text>

                <Text style={styles.label}>From</Text>
                <Text style={styles.input}>leexing0911@gmail.com</Text>

                <Text style={styles.label}>Subject</Text>
                <TextInput
                    style={styles.inputField}
                    placeholder="Enter subject"
                    placeholderTextColor="#ffffff99"
                    value={subject}
                    onChangeText={setSubject}
                />

                <Text style={styles.label}>Compose Message</Text>
                <TextInput
                    style={styles.messageField}
                    placeholder="Enter your message"
                    placeholderTextColor="#ffffff99"
                    multiline
                    value={message}
                    onChangeText={setMessage}
                />
            </View>

            {/* Send Button */}
            <TouchableOpacity style={styles.sendButton}>
                <Icon name="send" size={24} color="#000" />
            </TouchableOpacity>

            {/* Bottom Navigation */}
            <View style={styles.bottomNav}>
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
            </View>
        </LinearGradient>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        paddingHorizontal: 20,
        paddingTop: 50,
    },
    backButton: {
        position: "absolute",
        top: 50,
        left: 20,
    },
    title: {
        fontSize: 24,
        fontWeight: "bold",
        color: "#d4af37",
        textAlign: "center",
        marginBottom: 20,
    },
    formContainer: {
        marginTop: 30,
    },
    label: {
        fontSize: 14,
        color: "#d4af37",
        marginTop: 10,
    },
    adminText: {
        fontSize: 16,
        fontWeight: "bold",
        color: "#fff",
        marginBottom: 10,
    },
    input: {
        fontSize: 16,
        color: "#fff",
        marginBottom: 10,
    },
    inputField: {
        backgroundColor: "rgba(255,255,255,0.1)",
        borderRadius: 8,
        padding: 10,
        color: "#fff",
        marginBottom: 15,
    },
    messageField: {
        backgroundColor: "rgba(255,255,255,0.1)",
        borderRadius: 8,
        padding: 10,
        height: 100,
        color: "#fff",
    },
    sendButton: {
        alignSelf: "flex-end",
        backgroundColor: "#d4af37",
        padding: 10,
        borderRadius: 25,
        marginTop: 20,
    },
    bottomNav: {
        position: "absolute",
        bottom: 20,
        flexDirection: "row",
        backgroundColor: "#fff",
        borderRadius: 25,
        paddingVertical: 10,
        paddingHorizontal: 20,
        width: "90%",
        justifyContent: "space-around",
        alignItems: "center",
        alignSelf: "center",
        elevation: 5,
    },
    navButton: {
        alignItems: "center",
    },
    navText: {
        fontSize: 12,
        fontWeight: "bold",
        color: "#000",
        marginTop: 5,
    },
});

export default ContactPage;
