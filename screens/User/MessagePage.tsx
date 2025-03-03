import React from "react";
import { View, Text, TouchableOpacity, StyleSheet, Image } from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { useNavigation, useRoute } from "@react-navigation/native";
import { RouteProp } from "@react-navigation/native";
import { StackNavigationProp } from "@react-navigation/stack";
import { RootStackParamList } from "../../App"; // Import the navigation types
import Icon from "react-native-vector-icons/Feather";

const MessagePage = () => {
    const navigation = useNavigation<StackNavigationProp<RootStackParamList>>();
    const route = useRoute<RouteProp<RootStackParamList, "Message">>();
    const { message } = route.params;

    return (
        <LinearGradient colors={["#1a120b", "#b88b4a"]} style={styles.container}>
            {/* Back Button */}
            <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
                <Icon name="arrow-left" size={24} color="#d4af37" />
            </TouchableOpacity>

            {/* Page Title */}
            <Text style={styles.title}>NOTIFICATION</Text>

            {/* Sender Info */}
            <View style={styles.senderContainer}>
                <Image source={require("../../assets/profile-icon.png")} style={styles.senderImage} />
                <View>
                    <Text style={styles.senderName}>{message.sender}</Text>
                    <Text style={styles.timestamp}>{message.time}</Text>
                    <Text style={styles.recipient}>to me</Text>
                </View>
            </View>

            {/* Message Content */}
            <View style={styles.messageContainer}>
                <Text style={styles.messageTitle}>{message.title}</Text>
                <Text style={styles.messageBody}>{message.body}</Text>
            </View>

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
    senderContainer: {
        flexDirection: "row",
        alignItems: "center",
        marginBottom: 20,
    },
    senderImage: {
        width: 50,
        height: 50,
        borderRadius: 25,
        marginRight: 10,
    },
    senderName: {
        fontSize: 18,
        fontWeight: "bold",
        color: "#d4af37",
    },
    timestamp: {
        fontSize: 12,
        color: "#fff",
    },
    recipient: {
        fontSize: 12,
        color: "#fff",
    },
    messageContainer: {
        backgroundColor: "rgba(255,255,255,0.1)",
        padding: 15,
        borderRadius: 10,
    },
    messageTitle: {
        fontSize: 18,
        fontWeight: "bold",
        color: "#fff",
        marginBottom: 10,
    },
    messageBody: {
        fontSize: 14,
        color: "#fff",
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

export default MessagePage;
