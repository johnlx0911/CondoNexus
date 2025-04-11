import React, { useState, useEffect } from "react";
import { View, Text, StyleSheet, TouchableOpacity, Image } from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import Icon from "react-native-vector-icons/Feather";
import { useNavigation } from "@react-navigation/native";
import { StackNavigationProp } from "@react-navigation/stack";
import { RootStackParamList } from "../../App";
import AsyncStorage from "@react-native-async-storage/async-storage";

const HomePage = () => {
    const navigation = useNavigation<StackNavigationProp<RootStackParamList>>();
    const [currentDate, setCurrentDate] = useState<string>();
    const [userName, setUserName] = useState<string | null>(null);

    useEffect(() => {
        const today = new Date();
        const formattedDate = today.toLocaleDateString("en-GB", {
            day: "2-digit",
            month: "short",
            year: "numeric",
        });
        setCurrentDate(formattedDate);

        // ✅ Fetch the stored user's name
        const fetchUserName = async () => {
            const name = await AsyncStorage.getItem("userName"); // ✅ Load stored name

            if (name) {
                // ✅ Format Name: Uppercase + Spaced-Out Characters
                const formattedName = name.toUpperCase().split('').join(' ');
                setUserName(formattedName);
                console.log("✅ Formatted User Name:", formattedName);
            }
        };
        fetchUserName();
    }, []);

    return (
        <LinearGradient colors={["#1a120b", "#b88b4a"]} style={styles.container}>
            {/* Title */}
            <Text style={styles.title}>
                {userName ? `${userName}'s\n\nC O N D O  N E X U S` : `C O N D O  N E X U S`}
            </Text>

            {/* Dynamic Date */}
            <View style={styles.dateContainer}>
                <View style={styles.line} />
                <Text style={styles.date}>{currentDate}</Text>
                <View style={styles.line} />
            </View>

            {/* Icons Section */}
            <View style={styles.iconsContainer}>
                <View style={styles.row}>
                    <View style={styles.iconWrapper}>
                        <TouchableOpacity onPress={() => navigation.navigate("Payment")}>
                            <LinearGradient colors={["#e6c78e", "#b88b4a"]} style={styles.iconCircle}>
                                <Icon name="credit-card" size={40} color="#000" />
                            </LinearGradient>
                        </TouchableOpacity>
                        <Text style={styles.iconText}>Payment</Text>
                    </View>

                    <View style={styles.iconWrapper}>
                        <TouchableOpacity onPress={() => navigation.navigate("Facility")}>
                            <LinearGradient colors={["#e6c78e", "#b88b4a"]} style={styles.iconCircle}>
                                <Icon name="activity" size={40} color="#000" />
                            </LinearGradient>
                        </TouchableOpacity>
                        <Text style={styles.iconText}>Facility</Text>
                    </View>
                </View>

                <View style={styles.row}>
                    <View style={styles.iconWrapper}>
                        <TouchableOpacity onPress={() => navigation.navigate("Notification")}>
                            <LinearGradient colors={["#e6c78e", "#b88b4a"]} style={styles.iconCircle}>
                                <Icon name="bell" size={40} color="#000" />
                            </LinearGradient>
                        </TouchableOpacity>
                        <Text style={styles.iconText}>Notification</Text>
                    </View>

                    <View style={styles.iconWrapper}>
                        <TouchableOpacity onPress={() => navigation.navigate("Member")}>
                            <LinearGradient colors={["#e6c78e", "#b88b4a"]} style={styles.iconCircle}>
                                <Icon name="users" size={40} color="#000" />
                            </LinearGradient>
                        </TouchableOpacity>
                        <Text style={styles.iconText}>Member</Text>
                    </View>
                </View>
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
        justifyContent: "center",
        alignItems: "center",
    },
    title: {
        color: "#d4af37",
        fontSize: 26,
        fontFamily: "TimesNewRoman",
        textAlign: "center",
        marginTop: 50,
        marginBottom: 50,
    },
    date: {
        color: "#d4af37",
        fontSize: 20,
        marginVertical: 10,
        fontFamily: "TimesNewRoman",
        textAlign: "center",
    },
    dateContainer: {
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "center",
        marginVertical: 10,
        width: "80%", // Adjust the width if needed
    },
    line: {
        flex: 1, // Makes the lines flexible
        height: 1, // Line thickness
        backgroundColor: "#d4af37", // Golden color like your text
        marginHorizontal: 10, // Space between text and line
    },
    iconsContainer: {
        marginTop: 40,
        alignItems: "center",
        justifyContent: "center",
    },
    row: {
        flexDirection: "row",
        justifyContent: "center", // ✅ Ensures icons are centered
        alignItems: "center",
        gap: 70, // ✅ Adds spacing between icons (if needed)
        marginBottom: 70, // ✅ Adds space between rows (top-bottom spacing)
    },
    iconWrapper: {
        alignItems: "center", // Center icon + text
        justifyContent: "center",
    },
    iconCircle: {
        width: 80, // Adjust the circle size
        height: 80,
        borderRadius: 40, // Makes it circular
        justifyContent: "center",
        alignItems: "center",
        shadowColor: "#000", // Optional shadow effect
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.3,
        shadowRadius: 5,
    },
    iconText: {
        marginTop: 8, // Space between icon and text
        fontSize: 18,
        fontFamily: "TimesNewRoman",
        color: "#000",
        textAlign: "center",
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

export default HomePage;
