import React, { useState } from "react";
import {
    View,
    Text,
    TouchableOpacity,
    StyleSheet,
    ScrollView,
    Animated,
    Alert,
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { useNavigation } from "@react-navigation/native";
import { StackNavigationProp } from "@react-navigation/stack";
import { RootStackParamList } from "../../App"; // Import navigation types
import Icon from "react-native-vector-icons/Feather";
import AsyncStorage from "@react-native-async-storage/async-storage";

const DashboardPage: React.FC = () => {
    const navigation = useNavigation<StackNavigationProp<RootStackParamList>>();
    const [sidebarOpen, setSidebarOpen] = useState(false);
    const slideAnim = useState(new Animated.Value(-250))[0]; // Sidebar animation

    // ✅ Handle Logout
    const handleLogout = async () => {
        try {
            await AsyncStorage.removeItem("userToken"); // Remove token from storage
            navigation.replace("Login"); // Redirect back to Login page
        } catch (error) {
            console.error("Logout Error:", error);
            Alert.alert("Error", "Failed to logout. Please try again.");
        }
    };

    // Toggle Sidebar
    const toggleSidebar = () => {
        Animated.timing(slideAnim, {
            toValue: sidebarOpen ? -250 : 0,
            duration: 300,
            useNativeDriver: true,
        }).start();
        setSidebarOpen(!sidebarOpen);
    };

    return (
        <LinearGradient colors={["#1a120b", "#b88b4a"]} style={styles.container}>
            {/* Overlay when Sidebar is open */}
            {sidebarOpen && <View style={styles.overlay} onTouchStart={toggleSidebar} />}

            {/* Sidebar */}
            <Animated.View style={[styles.sidebar, { transform: [{ translateX: slideAnim }] }]}>
                <Text style={styles.sidebarTitle}>A D M I N  P A N E L</Text>
                <TouchableOpacity style={styles.navItem} onPress={() => navigation.navigate("Dashboard")}>
                    <Text style={styles.navText}>🏠  D A S H B O A R D</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.navItem} onPress={() => navigation.navigate("Resident", { residentId: "default" })}>
                    <Text style={styles.navText}>👥  R E S I D E N T S</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.navItem} onPress={() => navigation.navigate("FacilityManagement")}>
                    <Text style={styles.navText}>🏊  F A C I L I T Y  B O O K I N G</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.navItem} onPress={() => navigation.navigate("FacilityStatus")}>
                    <Text style={styles.navText}>📊  F A C I L I T Y  S T A T U S</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.navItem} onPress={() => navigation.navigate("Maintenance")}>
                    <Text style={styles.navText}>🛠  M A I N T E N A N C E</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.navItem} onPress={() => navigation.navigate("ResidentMessage")}>
                    <Text style={styles.navText}>📩  M E S S A G E S</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.navItem} onPress={() => navigation.navigate("Announcement")}>
                    <Text style={styles.navText}>📢  A N N O U N C E M E N T S</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.logoutItem} onPress={handleLogout}>
                    <Text style={styles.navText}>🚪  L O G O U T</Text>
                </TouchableOpacity>
            </Animated.View>

            {/* Main Content */}
            <ScrollView style={styles.mainContent}>
                {/* Toggle Sidebar Button */}
                <TouchableOpacity onPress={toggleSidebar} style={styles.menuButton}>
                    <Text style={styles.menuText}>☰</Text>
                </TouchableOpacity>

                {/* Page Title (Updated) */}
                <View style={{ alignItems: "center", marginTop: 30 }}>
                    <Text style={styles.title}>D A S H B O A R D</Text>
                    <View style={styles.titleLine} />
                </View>

                {/* Summary Cards */}
                <View style={styles.gridContainer}>
                    <LinearGradient colors={["#d4af37", "#fff"]} style={styles.card}>
                        <Text style={styles.cardTitle}>Residents</Text>
                        <Text style={styles.cardText}>Total: <Text style={styles.bold}>120</Text></Text>
                        <Text style={{ color: "green" }}>Active: 110</Text>
                        <Text style={{ color: "red" }}>Pending: 5 | Terminated: 5</Text>
                    </LinearGradient>

                    <LinearGradient colors={["#d4af37", "#fff"]} style={styles.card}>
                        <Text style={styles.cardTitle}>Facility Bookings</Text>
                        <Text style={styles.cardText}>Active Bookings: <Text style={styles.bold}>30</Text></Text>
                        <Text style={{ color: "blue" }}>Upcoming: 15</Text>
                        <Text style={{ color: "red" }}>Pending Approval: 5</Text>
                    </LinearGradient>

                    <LinearGradient colors={["#d4af37", "#fff"]} style={styles.card}>
                        <Text style={styles.cardTitle}>Maintenance Requests</Text>
                        <Text style={styles.cardText}>Total Issues: <Text style={styles.bold}>8</Text></Text>
                        <Text style={{ color: "orange" }}>In Progress: 3</Text>
                        <Text style={{ color: "green" }}>Resolved: 5</Text>
                    </LinearGradient>
                </View>

                {/* Messages and Quick Actions */}
                <View style={styles.gridContainer}>
                    <LinearGradient colors={["#d4af37", "#fff"]} style={styles.card}>
                        <Text style={styles.cardTitle}>Unread Messages</Text>
                        <Text style={styles.cardText}>Inbox: <Text style={styles.bold}>12</Text></Text>
                        <TouchableOpacity style={styles.button}><Text style={styles.buttonText}>View Messages</Text></TouchableOpacity>
                    </LinearGradient>

                    <LinearGradient colors={["#d4af37", "#fff"]} style={styles.card}>
                        <Text style={styles.cardTitle}>Quick Actions</Text>
                        <View>
                            <TouchableOpacity style={[styles.button, styles.green]}>
                                <Text style={styles.buttonText}>📢 Post Announcement</Text>
                            </TouchableOpacity>
                            <TouchableOpacity style={[styles.button, styles.orange]}>
                                <Text style={styles.buttonText}>🛠 Assign Maintenance</Text>
                            </TouchableOpacity>
                            <TouchableOpacity style={[styles.button, styles.red]}>
                                <Text style={styles.buttonText}>🚪 Terminate Resident</Text>
                            </TouchableOpacity>
                        </View>
                    </LinearGradient>
                </View>
            </ScrollView>
        </LinearGradient>
    );
};

/* ✅ Styles */
const styles = StyleSheet.create({
    container: {
        flex: 1,
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
        width: "95%", // ✅ Adjust width as needed
        height: 1, // ✅ Thickness of the line
        backgroundColor: "#d4af37", // ✅ Golden color like the text
        alignSelf: "center", // ✅ Centers the line
        marginTop: 1, // ✅ Spacing from title
        borderRadius: 2, // ✅ Smooth edges
        marginBottom: 10,
    },
    sidebar: {
        position: "absolute",
        left: 0,
        top: 0,
        width: 250,
        height: "100%",
        backgroundColor: "#1a120b",
        padding: 20,
        zIndex: 10,
    },
    sidebarTitle: {
        fontSize: 22,
        fontFamily: "Times New Roman",
        fontWeight: "bold",
        color: "#d4af37",
        marginBottom: 10,
        marginTop: 60,
    },
    navItem: {
        paddingVertical: 15,
        paddingHorizontal: 5,
        borderRadius: 5,
        marginVertical: 5,
    },
    navText: {
        color: "#fff",
        fontFamily: "Times New Roman",
        fontSize: 13,
    },
    logoutItem: {
        marginVertical: 10,
        backgroundColor: "#ffdddd",
        borderRadius: 5,
        padding: 10,
    },
    overlay: {
        position: "absolute",
        top: 0,
        left: 0,
        width: "100%",
        height: "100%",
        backgroundColor: "rgba(0, 0, 0, 0.5)",
        zIndex: 5,
    },
    mainContent: {
        flex: 1,
        padding: 20,
    },
    menuButton: {
        padding: 10,
        position: "absolute",
        left: 15,
        top: 53,
        zIndex: 15,
    },
    menuText: {
        fontSize: 26,
        fontFamily: "Times New Roman",
        fontWeight: "bold",
        color: "#d4af37",
    },
    heading: {
        fontSize: 24,
        fontWeight: "bold",
        color: "#fff",
        textAlign: "center",
    },
    gridContainer: {
        flexWrap: "wrap",
        justifyContent: "space-between",
        marginTop: 20,
        marginLeft: 5,
        marginRight: 5,
    },
    card: {
        width: "100%",
        padding: 15,
        borderRadius: 10,
        marginBottom: 20,
    },
    cardTitle: {
        fontSize: 20,
        fontWeight: "bold",
        fontFamily: "Times New Roman",
    },
    cardText: {
        fontSize: 18,
        color: "#444",
        fontFamily: "Times New Roman",
    },
    bold: {   // ✅ THIS FIXES THE ERROR
        fontWeight: "bold",
    },
    button: {
        marginTop: 10,
        paddingVertical: 10,
        paddingHorizontal: 15,
        borderRadius: 5,
        alignItems: "center",
        backgroundColor: "#d4af37",
    },
    buttonText: {
        color: "#000",
        fontSize: 18,
        fontWeight: "bold",
        fontFamily: "Times New Roman",
    },
    green: { backgroundColor: "green" },
    orange: { backgroundColor: "orange" },
    red: { backgroundColor: "red" },
});

export default DashboardPage;
