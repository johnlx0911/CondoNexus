import React from "react";
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Image } from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { useNavigation } from "@react-navigation/native";
import { StackNavigationProp } from "@react-navigation/stack";
import { RootStackParamList } from "../../App"; // Import the navigation types
import Icon from "react-native-vector-icons/Feather";

const EditMemberPage = () => {
    const navigation = useNavigation<StackNavigationProp<RootStackParamList>>();

    return (
        <LinearGradient colors={["#1a120b", "#b88b4a"]} style={styles.container}>
            {/* Back Button */}
            <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
                <Icon name="arrow-left" size={24} color="#d4af37" />
            </TouchableOpacity>

            {/* Page Title */}
            <Text style={styles.title}>MEMBER</Text>

            {/* Edit Icon */}
            <View style={styles.iconContainer}>
                <Image source={require("../../assets/edit-icon.png")} style={styles.editIcon} />
            </View>

            {/* Input Fields */}
            <View style={styles.inputContainer}>
                <Text style={styles.label}>Email or Phone Number</Text>
                <TextInput style={styles.input} placeholderTextColor="#ffffff99" />

                <Text style={styles.label}>Username</Text>
                <TextInput style={styles.input} placeholderTextColor="#ffffff99" />
            </View>

            {/* Invite Button */}
            <TouchableOpacity style={styles.inviteButton}>
                <LinearGradient colors={["#fff", "#d4af37"]} style={styles.inviteGradient}>
                    <Text style={styles.inviteText}>I N V I T E</Text>
                </LinearGradient>
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
    iconContainer: {
        alignItems: "center",
        marginBottom: 20,
    },
    editIcon: {
        width: 100,
        height: 100,
        resizeMode: "contain",
    },
    inputContainer: {
        marginBottom: 20,
    },
    label: {
        color: "#fff",
        fontSize: 14,
        marginBottom: 5,
    },
    input: {
        backgroundColor: "transparent",
        borderBottomWidth: 1,
        borderBottomColor: "#fff",
        paddingVertical: 5,
        fontSize: 16,
        color: "#fff",
    },
    inviteButton: {
        marginTop: 30,
        alignSelf: "center",
    },
    inviteGradient: {
        width: 180,
        paddingVertical: 12,
        borderRadius: 25,
        alignItems: "center",
    },
    inviteText: {
        color: "#000",
        fontSize: 18,
        fontWeight: "bold",
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

export default EditMemberPage;
