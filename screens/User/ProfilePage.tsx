import React from "react";
import { View, Text, StyleSheet, TouchableOpacity, Image, Alert } from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import Icon from "react-native-vector-icons/Feather";
import { useNavigation } from "@react-navigation/native";
import { StackNavigationProp } from "@react-navigation/stack";
import { RootStackParamList } from "../../App"; // Import the navigation types
import AsyncStorage from "@react-native-async-storage/async-storage";

const ProfilePage = () => {
    const navigation = useNavigation<StackNavigationProp<RootStackParamList>>();

    // ✅ Handle Logout Function
    const handleLogout = async () => {
        Alert.alert(
            "Confirm Logout",
            "Are you sure you want to log out?",
            [
                { text: "Cancel", style: "cancel" },
                {
                    text: "Logout",
                    onPress: async () => {
                        await AsyncStorage.removeItem("userToken"); // ✅ Clear stored token
                        navigation.replace("Login"); // ✅ Redirect to Login screen
                    }
                }
            ]
        );
    };

    return (
        <LinearGradient colors={["#1a120b", "#b88b4a"]} style={styles.container}>
            {/* Back Button */}
            <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
                <Icon name="arrow-left" size={24} color="#d4af37" />
            </TouchableOpacity>

            {/* Page Title */}
            <Text style={styles.title}>P R O F I L E</Text>
            <View style={styles.titleLine} />

            {/* Profile Picture with Gradient */}
            <LinearGradient colors={["#e6c78e", "#b88b4a"]} style={styles.profileContainer}>
                <Image source={{ uri: "https://via.placeholder.com/100" }} style={styles.profilePic} />
            </LinearGradient>

            {/* Buttons with Gradient */}
            <TouchableOpacity style={styles.button}>
                <LinearGradient colors={["#e6c78e", "#b88b4a"]} style={styles.buttonGradient}>
                    <Text style={styles.buttonText}>E D I T  P R O F I L E</Text>
                </LinearGradient>
            </TouchableOpacity>

            <TouchableOpacity style={styles.button}>
                <LinearGradient colors={["#e6c78e", "#b88b4a"]} style={styles.buttonGradient}>
                    <Text style={styles.buttonText}>C H A N G E  P A S S W O R D</Text>
                </LinearGradient>
            </TouchableOpacity>

            <TouchableOpacity style={styles.button}>
                <LinearGradient colors={["#e6c78e", "#b88b4a"]} style={styles.buttonGradient}>
                    <Text style={styles.buttonText}>P R E F E R E N C E</Text>
                </LinearGradient>
            </TouchableOpacity>

            <TouchableOpacity style={styles.button}>
                <LinearGradient colors={["#e6c78e", "#b88b4a"]} style={styles.buttonGradient}>
                    <Text style={styles.buttonText}>S E T T I N G S</Text>
                </LinearGradient>
            </TouchableOpacity>

            {/* ✅ LOGOUT BUTTON */}
            <TouchableOpacity style={styles.button} onPress={handleLogout}>
                <LinearGradient colors={["#e6c78e", "#b88b4a"]} style={styles.buttonGradient}>
                    <Text style={styles.logoutText}>L O G  O U T</Text>
                </LinearGradient>
            </TouchableOpacity>

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
    logoutText: {
        fontSize: 18,
        fontFamily: "Times New Roman",
        color: "#000", // Dark red to indicate logout
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
        marginBottom: 20,
    },
    profileContainer: {
        width: 120, // ✅ Slightly larger for the gradient effect
        height: 120,
        borderRadius: 60,
        alignItems: "center",
        justifyContent: "center",
        marginBottom: 40,
        marginTop: 30,
    },
    profilePic: {
        width: 100,
        height: 100,
        borderRadius: 50,
    },
    button: {
        width: "85%",
        marginBottom: 20, // ✅ Spacing between buttons
    },
    buttonGradient: {
        paddingVertical: 15, // ✅ Same height as other pages
        borderRadius: 25,
        alignItems: "center",
        elevation: 5,
    },
    buttonText: {
        fontSize: 18,
        fontFamily: "Times New Roman",
        color: "#000",
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

export default ProfilePage;
