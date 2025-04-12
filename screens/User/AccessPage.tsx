import React, { useEffect, useState } from "react";
import { View, Text, StyleSheet, Image, TouchableOpacity, Alert } from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { useNavigation } from "@react-navigation/native";
import { StackNavigationProp } from "@react-navigation/stack";
import { RootStackParamList } from "../../App";
import Icon from "react-native-vector-icons/Feather";
import axios from 'axios';

const AccessPage = () => {
    const navigation = useNavigation<StackNavigationProp<RootStackParamList>>();

    useEffect(() => {
        const pingESP32 = async () => {
            try {
                const res = await axios.get("http://192.168.0.115/app-ping");
                console.log("✅ ESP32 Response:", res.data);
            } catch (error: any) {
                console.error("❌ Failed to ping ESP32:", error.message);
                Alert.alert("ESP32 Error", "Could not reach ESP32.");
            }
        };

        pingESP32();
    }, []);

    useEffect(() => {
        const interval = setInterval(() => {
            axios.get("http://192.168.0.115/app-ping")
                .then(res => console.log("✅ ESP32 Response:", res.data))
                .catch(err => console.error("❌ ESP32 Error:", err.message));
        }, 5000); // every 5s

        return () => clearInterval(interval); // cleanup on page exit
    }, []);

    return (
        <LinearGradient colors={["#1a120b", "#b88b4a"]} style={styles.container}>
            <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
                <Icon name="arrow-left" size={24} color="#d4af37" />
            </TouchableOpacity>

            <Text style={styles.title}>A C C E S S</Text>
            <View style={styles.titleLine} />

            <View style={styles.accessContainer}>
                <Image source={require("../../assets/access-icon.png")} style={styles.accessIcon} />
                <Text style={styles.accessText}>T A P  T O  A C C E S S</Text>
            </View>

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
        zIndex: 10,
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
        width: "85%",
        height: 1,
        backgroundColor: "#d4af37",
        alignSelf: "center",
        marginTop: 1,
        borderRadius: 2,
        marginBottom: 20,
    },
    accessContainer: {
        alignItems: "center",
        marginBottom: 40,
    },
    accessIcon: {
        width: 200,
        height: 200,
        marginTop: 120,
        marginBottom: 30,
        resizeMode: "contain",
    },
    accessText: {
        fontSize: 27,
        fontFamily: "TimesNewRoman",
        color: "#d4af37",
        marginTop: 10,
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

export default AccessPage;
