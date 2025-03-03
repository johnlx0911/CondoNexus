import React, { useState } from "react";
import { View, Text, ScrollView, TouchableOpacity, StyleSheet, Image } from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { useNavigation } from "@react-navigation/native";
import { StackNavigationProp } from "@react-navigation/stack";
import { RootStackParamList } from "../../App"; // Import the navigation types
import Icon from "react-native-vector-icons/Feather";

const MemberPage = () => {
    const navigation = useNavigation<StackNavigationProp<RootStackParamList>>();

    // Define members state
    const [members, setMembers] = useState([
        { name: "John Lee Xing", email: "leexing0911@gmail.com" },
        { name: "Varsyathini Paramasawam", email: "varsya@gmail.com" },
        { name: "Leong Ee Mun", email: "eemun@gmail.com" },
        { name: "Jack", email: "jack@gmail.com" },
        { name: "Gabriel Yee", email: "gabriel@gmail.com" },
    ]);

    return (
        <LinearGradient colors={["#1a120b", "#b88b4a"]} style={styles.container}>
            {/* Back Button */}
            <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
                <Icon name="arrow-left" size={24} color="#d4af37" />
            </TouchableOpacity>

            {/* Page Title */}
            <Text style={styles.title}>MEMBER</Text>

            {/* Member List */}
            <ScrollView style={styles.listContainer}>
                {members.map((member, index) => (
                    <TouchableOpacity
                        key={index}
                        style={styles.memberCard}
                        onPress={() => navigation.navigate("EditMember")}
                    >
                        <Image source={require("../../assets/profile-icon.png")} style={styles.memberImage} />
                        <View>
                            <Text style={styles.memberName}>{member.name}</Text>
                            <Text style={styles.memberEmail}>{member.email}</Text>
                        </View>
                    </TouchableOpacity>
                ))}
            </ScrollView>

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
    listContainer: {
        marginBottom: 20,
    },
    memberCard: {
        flexDirection: "row",
        alignItems: "center",
        backgroundColor: "#d4af37",
        borderRadius: 15,
        padding: 15,
        marginBottom: 10,
    },
    memberImage: {
        width: 50,
        height: 50,
        borderRadius: 25,
        marginRight: 15,
    },
    memberName: {
        fontSize: 16,
        fontWeight: "bold",
        color: "#000",
    },
    memberEmail: {
        fontSize: 14,
        color: "#333",
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

export default MemberPage;
