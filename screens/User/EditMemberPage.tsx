import React from "react";
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Image, Alert } from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { useNavigation } from "@react-navigation/native";
import { StackNavigationProp } from "@react-navigation/stack";
import { RootStackParamList } from "../../App"; // Import the navigation types
import Icon from "react-native-vector-icons/Feather";
import { RouteProp, useRoute } from "@react-navigation/native";
import AsyncStorage from "@react-native-async-storage/async-storage";

const EditMemberPage = () => {
    const navigation = useNavigation<StackNavigationProp<RootStackParamList>>();
    const route = useRoute<RouteProp<RootStackParamList, "EditMember">>();
    const member = route.params.member;

    return (
        <LinearGradient colors={["#1a120b", "#b88b4a"]} style={styles.container}>
            {/* Back Button */}
            <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
                <Icon name="arrow-left" size={24} color="#d4af37" />
            </TouchableOpacity>

            {/* Page Title */}
            <Text style={styles.title}>M E M B E R</Text>
            <View style={styles.titleLine} />

            {/* Edit Icon with Gradient Background */}
            <LinearGradient colors={["#f5e3a1", "#b88b4a"]} style={styles.iconContainer}>
                <Image source={require("../../assets/edit-icon.png")} style={styles.editIcon} />
            </LinearGradient>

            {/* Input Fields */}
            <View style={styles.inputContainer}>
                <Text style={styles.label}>Email</Text>
                <TextInput style={styles.input} value={member.email || ""} editable={false} placeholderTextColor="#ffffff99" />

                <Text style={styles.label}>Phone Number</Text>
                <TextInput style={styles.input} value={member.mobile || ""} editable={false} placeholderTextColor="#ffffff99" />

                <Text style={styles.label}>Username</Text>
                <TextInput style={styles.input} value={member.name || ""} editable={false} placeholderTextColor="#ffffff99" />
            </View>

            {/* Delete Button with Gradient Background */}
            <TouchableOpacity
                style={styles.inviteButton}
                onPress={async () => {
                    const currentUserEmail = await AsyncStorage.getItem("userEmail");
                    if (!currentUserEmail) return Alert.alert("Error", "User email not found.");

                    try {
                        const res = await fetch("http://192.168.0.109:5000/api/delete-member", {
                            method: "POST",
                            headers: { "Content-Type": "application/json" },
                            body: JSON.stringify({
                                userEmail: currentUserEmail,
                                memberEmail: member.email,
                            }),
                        });

                        const result = await res.json();
                        if (result.success) {
                            Alert.alert("Deleted", "Member has been removed.");
                            navigation.goBack();
                        } else {
                            Alert.alert("Error", result.message);
                        }
                    } catch (err) {
                        console.error(err);
                        Alert.alert("Error", "Failed to delete member.");
                    }
                }}
            >
                <LinearGradient colors={["#e6c78e", "#b88b4a"]} style={styles.inviteGradient}>
                    <Text style={styles.inviteText}>D E L E T E</Text>
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
    iconContainer: {
        width: 140, // ✅ Matches expected size
        height: 140,
        borderRadius: 70, // ✅ Fully rounded
        alignItems: "center",
        justifyContent: "center",
        marginBottom: 50,
        marginTop: 50,
    },
    editIcon: {
        width: 70, // ✅ Matches expected size
        height: 70,
        resizeMode: "contain",
    },
    inputContainer: {
        width: "85%",
        marginBottom: 20,
    },
    label: {
        fontSize: 16,
        color: "#A0A0A0", // ✅ Gray color for labels
        fontFamily: "Times New Roman",
        marginBottom: 5,
    },
    input: {
        borderBottomWidth: 1,
        borderBottomColor: "#A0A0A0",
        paddingVertical: 5,
        fontSize: 18,
        color: "#fff",
        fontFamily: "Times New Roman",
        marginBottom: 20,
    },
    inviteButton: {
        marginTop: 45, // ✅ Adjusted for spacing
        alignSelf: "center",
        width: "85%",
    },
    inviteGradient: {
        width: "100%",
        paddingVertical: 15,
        borderRadius: 25,
        alignItems: "center",
        elevation: 5,
    },
    inviteText: {
        color: "#000",
        fontSize: 18,
        fontWeight: "bold",
        fontFamily: "Times New Roman",
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

export default EditMemberPage;
