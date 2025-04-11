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
            <Text style={styles.title}>N O T I F I C A T I O N</Text>
            <View style={styles.titleLine} />

            {/* Sender Info */}
            <View style={styles.senderContainer}>
                {/* Gradient Background for Icon */}
                <Image source={require("../../assets/profile-icon.png")} style={styles.senderImage} />

                {/* Sender Details */}
                <View style={styles.senderDetails}>
                    <View style={styles.senderRow}>
                        <Text style={styles.senderName}>{message.sender}</Text>
                        <Text style={styles.timestamp}>{message.time}</Text>
                    </View>
                    <Text style={styles.recipient}>to me</Text>
                </View>
            </View>

            {/* Message Content */}
            <View style={styles.messageContainer}>
                <Text style={styles.messageTitle}>{message.title}</Text>
                <View style={styles.messageLine} />
                <Text style={styles.messageBody}>{message.body}</Text>
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
        fontSize: 26,
        color: "#d4af37",
        textAlign: "center",
        fontFamily: "TimesNewRoman",
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
    senderContainer: {
        flexDirection: "row",
        alignItems: "center",
        width: "85%",
        marginBottom: 20,
        marginTop: 20,
    },
    senderImage: {
        width: 55,
        height: 55,
    },
    senderDetails: {
        flex: 1,
        marginLeft: 15,
    },
    senderRow: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        marginBottom: 5,
    },
    senderName: {
        fontSize: 32,
        color: "#d4af37",
        fontFamily: "TimesNewRoman",
    },
    timestamp: {
        fontSize: 15,
        color: "#fff",
        fontFamily: "TimesNewRoman",
    },
    recipient: {
        fontSize: 15,
        color: "#fff",
        fontFamily: "TimesNewRoman",
    },
    messageContainer: {
        width: "85%",
        marginBottom: 20,
    },
    messageTitle: {
        fontSize: 32,
        color: "#fff",
        fontFamily: "TimesNewRoman",
        marginBottom: 5,
    },
    messageLine: {
        width: "100%",
        height: 1,
        backgroundColor: "#d4af37",
        marginBottom: 25,
        marginTop: 25,
        borderRadius: 2,
    },
    messageBody: {
        fontSize: 18,
        color: "#fff",
        fontFamily: "TimesNewRoman",
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
        fontSize: 18,
        fontFamily: "TimesNewRoman",
    },
});

export default MessagePage;
