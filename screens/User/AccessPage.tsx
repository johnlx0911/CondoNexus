import React, { useEffect, useState } from "react";
import { View, Text, StyleSheet, Image, TouchableOpacity, Alert } from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { useNavigation } from "@react-navigation/native";
import { StackNavigationProp } from "@react-navigation/stack";
import { RootStackParamList } from "../../App";
import Icon from "react-native-vector-icons/Feather";
// import NfcManager, { NfcTech } from 'react-native-nfc-manager';
// import { BleManager } from 'react-native-ble-plx';

// Initialize NFC
// NfcManager.start();

const AccessPage = () => {
    const navigation = useNavigation<StackNavigationProp<RootStackParamList>>();
    // const bleManager = new BleManager();

    const DEVICE_NAME = "ESP32_NFC_Reader";  // Match your ESP32's Bluetooth name
    const SERVICE_UUID = "XXXXXXXX-XXXX-XXXX-XXXX-XXXXXXXXXXXX"; // Replace with actual UUID
    const CHARACTERISTIC_UUID = "YYYYYYYY-YYYY-YYYY-YYYY-YYYYYYYYYYYY"; // Replace with actual UUID

    // const sendBluetoothSignal = async () => {
    //     const devices = await bleManager.devices([]);
    //     const targetDevice = devices.find(device => device.name === DEVICE_NAME);

    //     if (targetDevice) {
    //         await targetDevice.connect();
    //         await targetDevice.discoverAllServicesAndCharacteristics();
    //         await targetDevice.writeCharacteristicWithResponseForService(
    //             SERVICE_UUID,
    //             CHARACTERISTIC_UUID,
    //             Buffer.from("APP_RUNNING").toString('base64')  // Send "APP_RUNNING" to ESP32
    //         );
    //     }
    // };

    // useEffect(() => {
    //     const detectNfc = async () => {
    //         try {
    //             await NfcManager.requestTechnology(NfcTech.Ndef);
    //             const tag = await NfcManager.getTag();

    //             if (tag) {
    //                 await sendBluetoothSignal(); // Send Bluetooth signal to confirm app is active

    //                 Alert.alert('🔵 App NFC Detected', JSON.stringify(tag, null, 2));
    //                 console.log('🔵 App NFC Detected:', tag);
    //             } else {
    //                 Alert.alert('🟠 Phone NFC Detected', 'Detected via system NFC reader.');
    //                 console.log('🟠 Phone NFC Detected:', tag);
    //             }
    //         } catch (error) {
    //             console.warn('NFC read failed', error);
    //             Alert.alert('❌ No NFC Tag Found');
    //         } finally {
    //             NfcManager.cancelTechnologyRequest();
    //         }
    //     };

    //     detectNfc();

    //     // Optional: Resend signal periodically to keep connection active
    //     const interval = setInterval(() => {
    //         sendBluetoothSignal();
    //     }, 8000); // Send signal every 8 seconds

    //     return () => {
    //         clearInterval(interval);  // Clean up interval on unmount
    //     };
    // }, []);

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
