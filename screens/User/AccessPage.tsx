import React from "react";
import { View, Text, StyleSheet, Image, TouchableOpacity } from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { useNavigation } from "@react-navigation/native";
import { StackNavigationProp } from "@react-navigation/stack";
import { RootStackParamList } from "../../App"; // Import the navigation types
import Icon from "react-native-vector-icons/Feather";

const AccessPage = () => {
    const navigation = useNavigation<StackNavigationProp<RootStackParamList>>();

    return (
        <LinearGradient colors={["#1a120b", "#b88b4a"]} style={styles.container}>
            {/* Back Button */}
            <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
                <Icon name="arrow-left" size={24} color="#d4af37" />
            </TouchableOpacity>

            {/* Access Icon */}
            <View style={styles.accessContainer}>
                <Image source={require("../../assets/access-icon.png")} style={styles.accessIcon} />
                <Text style={styles.accessText}>TAP TO ACCESS</Text>
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
        justifyContent: "center",
        alignItems: "center",
        paddingHorizontal: 30,
    },
    backButton: {
        position: "absolute",
        top: 50,
        left: 20,
    },
    accessContainer: {
        alignItems: "center",
        marginBottom: 40,
    },
    accessIcon: {
        width: 120,
        height: 120,
        resizeMode: "contain",
    },
    accessText: {
        fontSize: 16,
        color: "#d4af37",
        fontWeight: "bold",
        marginTop: 10,
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

export default AccessPage;
