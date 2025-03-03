import React from "react";
import { View, Text, StyleSheet, TouchableOpacity, Image } from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import Icon from "react-native-vector-icons/Feather";
import { useNavigation } from "@react-navigation/native";
import { StackNavigationProp } from "@react-navigation/stack";
import { RootStackParamList } from "../../App"; // Import the navigation types

const ProfilePage = () => {
    const navigation = useNavigation<StackNavigationProp<RootStackParamList>>();

    return (
        <LinearGradient colors={["#1a120b", "#b88b4a"]} style={styles.container}>
            {/* Back Button */}
            <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
                <Icon name="arrow-left" size={25} color="#d4af37" />
            </TouchableOpacity>

            {/* Profile Title */}
            <Text style={styles.title}>PROFILE</Text>

            {/* Profile Picture */}
            <View style={styles.profileContainer}>
                <Image source={{ uri: "https://via.placeholder.com/100" }} style={styles.profilePic} />
            </View>

            {/* Buttons */}
            <TouchableOpacity style={styles.button}>
                <Text style={styles.buttonText}>EDIT PROFILE</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.button}>
                <Text style={styles.buttonText}>CHANGE PASSWORD</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.button}>
                <Text style={styles.buttonText}>PREFERENCE</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.button}>
                <Text style={styles.buttonText}>SETTINGS</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.button}>
                <Text style={styles.buttonText}>LOG OUT</Text>
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
        alignItems: "center",
    },
    backButton: {
        position: "absolute",
        top: 50,
        left: 20,
    },
    title: {
        color: "#d4af37",
        fontSize: 24,
        fontWeight: "bold",
        textAlign: "center",
        marginTop: 80,
    },
    profileContainer: {
        alignItems: "center",
        marginTop: 20,
    },
    profilePic: {
        width: 100,
        height: 100,
        borderRadius: 50,
        backgroundColor: "#fff",
    },
    button: {
        backgroundColor: "#fff",
        paddingVertical: 15,
        paddingHorizontal: 50,
        borderRadius: 25,
        marginTop: 15,
        width: "80%",
        alignItems: "center",
    },
    buttonText: {
        fontSize: 16,
        color: "#000",
    },
    bottomNav: {
        position: "absolute",
        bottom: 10,
        flexDirection: "row",
        backgroundColor: "#d4af37",
        paddingVertical: 15,
        width: "90%",
        borderRadius: 25,
        justifyContent: "space-around",
    },
    navButton: {
        alignItems: "center",
    },
    navText: {
        color: "#000",
        fontSize: 14,
    },
});

export default ProfilePage;
