import React, { useState } from "react";
import {
    View,
    Text,
    TouchableOpacity,
    StyleSheet,
    ScrollView,
    Animated,
    FlatList,
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { useNavigation } from "@react-navigation/native";
import { StackNavigationProp } from "@react-navigation/stack";
import { RootStackParamList } from "../../App";
import { TextStyle } from "react-native";

// Sample maintenance request data
const maintenanceRequests = [
    { id: "1", issue: "Leaking Pipe", resident: "John Doe", status: "Pending", assignedTo: "" },
    { id: "2", issue: "Broken Elevator", resident: "Alice", status: "In Progress", assignedTo: "Technician Mike" },
    { id: "3", issue: "Power Outage", resident: "Bob", status: "Pending", assignedTo: "" },
    { id: "4", issue: "AC Not Working", resident: "Sarah", status: "Resolved", assignedTo: "Technician David" },
];

const MaintenancePage: React.FC = () => {
    const navigation = useNavigation<StackNavigationProp<RootStackParamList>>();
    const [sidebarOpen, setSidebarOpen] = useState(false);
    const slideAnim = useState(new Animated.Value(-250))[0];

    // Toggle Sidebar
    const toggleSidebar = () => {
        Animated.timing(slideAnim, {
            toValue: sidebarOpen ? -250 : 0,
            duration: 300,
            useNativeDriver: true,
        }).start();
        setSidebarOpen(!sidebarOpen);
    };

    // Function to assign request to staff
    const assignToStaff = (id: string, staffName: string) => {
        console.log(`Assigned request ${id} to ${staffName}`);
        // In a real-world scenario, update this in a database/API
    };

    // Function to mark request as completed
    const markAsCompleted = (id: string) => {
        console.log(`Marked request ${id} as Completed`);
        // Update in the backend/API
    };

    // Function to get dynamic text color based on status
    const getStatusTextStyle = (status: string): TextStyle => ({
        fontSize: 18,
        color: status === "Pending" ? "orange" : status === "In Progress" ? "blue" : "green",
    });

    return (
        <LinearGradient colors={["#1a120b", "#b88b4a"]} style={styles.container}>
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
                <TouchableOpacity style={styles.logoutItem}>
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
                    <Text style={styles.title}>M A I N T E N A N C E</Text>
                    <View style={styles.titleLine} />
                </View>

                {/* Maintenance List */}
                <FlatList
                    data={maintenanceRequests}
                    keyExtractor={(item) => item.id}
                    renderItem={({ item }) => (
                        <LinearGradient colors={["#d4af37", "#fff"]} style={styles.card}>
                            <Text style={styles.cardTitle}>{item.issue}</Text>
                            <Text style={styles.cardText}>Resident: {item.resident}</Text>
                            <Text style={[styles.cardText, getStatusTextStyle(item.status)]}>Status: {item.status}</Text>
                            <Text style={styles.cardText}>
                                Assigned To: {item.assignedTo ? item.assignedTo : "Not Assigned"}
                            </Text>

                            {/* Action Buttons */}
                            {item.status === "Pending" && (
                                <View style={styles.buttonContainer}>
                                    <TouchableOpacity
                                        style={[styles.button, styles.green]}
                                        onPress={() => assignToStaff(item.id, "Technician Mike")}
                                    >
                                        <Text style={styles.buttonText}>Assign to Mike</Text>
                                    </TouchableOpacity>
                                    <TouchableOpacity
                                        style={[styles.button, styles.orange]}
                                        onPress={() => assignToStaff(item.id, "Technician David")}
                                    >
                                        <Text style={styles.buttonText}>Assign to David</Text>
                                    </TouchableOpacity>
                                </View>
                            )}
                            {item.status === "In Progress" && (
                                <TouchableOpacity
                                    style={[styles.button, styles.blue]}
                                    onPress={() => markAsCompleted(item.id)}
                                >
                                    <Text style={styles.buttonText}>Mark as Completed</Text>
                                </TouchableOpacity>
                            )}
                        </LinearGradient>
                    )}
                />
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
        color: "#d4af37",
        textAlign: "center",
        fontFamily: "TimesNewRoman",
        marginBottom: 10,
        marginTop: 31,
    },
    titleLine: {
        width: "95%", // ✅ Adjust width as needed
        height: 1, // ✅ Thickness of the line
        backgroundColor: "#d4af37", // ✅ Golden color like the text
        alignSelf: "center", // ✅ Centers the line
        marginTop: 1, // ✅ Spacing from title
        borderRadius: 2, // ✅ Smooth edges
        marginBottom: 20,
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
        fontSize: 24,
        fontFamily: "TimesNewRoman",
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
        fontFamily: "TimesNewRoman",
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
        fontSize: 28,
        fontFamily: "TimesNewRoman",
        color: "#d4af37",
    },
    heading: {
        fontSize: 26,
        color: "#fff",
        textAlign: "center",
        marginBottom: 20,
    },
    card: {
        marginBottom: 15,
        padding: 15,
        borderRadius: 10,
        marginLeft: 5,
        marginRight: 5,
    },
    cardTitle: {
        fontSize: 22,
        fontFamily: "TimesNewRoman",
    },
    cardText: {
        fontSize: 18,
        fontFamily: "TimesNewRoman",
        color: "#444",
    },
    buttonContainer: {
        flexDirection: "row",
        justifyContent: "space-between",
        marginTop: 10,
    },
    button: {
        paddingVertical: 10,
        paddingHorizontal: 15,
        borderRadius: 5,
        alignItems: "center",
    },
    buttonText: {
        color: "#fff",
        fontSize: 20,
        fontFamily: "TimesNewRoman",
    },
    green: { backgroundColor: "green" },
    orange: { backgroundColor: "orange" },
    blue: { backgroundColor: "blue" },
});

export default MaintenancePage;
