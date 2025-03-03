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
        fontSize: 16,
        fontWeight: "bold" as TextStyle["fontWeight"],
        color: status === "Pending" ? "orange" : status === "In Progress" ? "blue" : "green",
    });

    return (
        <LinearGradient colors={["#1a120b", "#b88b4a"]} style={styles.container}>
            {sidebarOpen && <View style={styles.overlay} onTouchStart={toggleSidebar} />}

            {/* Sidebar */}
            <Animated.View style={[styles.sidebar, { transform: [{ translateX: slideAnim }] }]}>
                <Text style={styles.sidebarTitle}>Admin Panel</Text>
                <TouchableOpacity style={styles.navItem} onPress={() => navigation.navigate("Dashboard")}>
                    <Text style={styles.navText}>🏠 Dashboard</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.navItem} onPress={() => navigation.navigate("Resident", { residentId: "default" })}>
                    <Text style={styles.navText}>👥 Residents</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.navItem} onPress={() => navigation.navigate("FacilityManagement")}>
                    <Text style={styles.navText}>🏊 Facility Booking</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.navItem} onPress={() => navigation.navigate("FacilityStatus")}>
                    <Text style={styles.navText}>📊 Facility Status</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.navItem} onPress={() => navigation.navigate("Maintenance")}>
                    <Text style={styles.navText}>🛠 Maintenance</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.navItem} onPress={() => navigation.navigate("ResidentMessage")}>
                    <Text style={styles.navText}>📩 Messages</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.navItem} onPress={() => navigation.navigate("Announcement")}>
                    <Text style={styles.navText}>📢 Announcements</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.logoutItem}>
                    <Text style={styles.navText}>🚪 Logout</Text>
                </TouchableOpacity>
            </Animated.View>

            {/* Main Content */}
            <ScrollView style={styles.mainContent}>
                {/* Toggle Sidebar Button */}
                <TouchableOpacity onPress={toggleSidebar} style={styles.menuButton}>
                    <Text style={styles.menuText}>☰</Text>
                </TouchableOpacity>

                <Text style={styles.heading}>Maintenance Requests & Work Orders</Text>

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
        fontSize: 20,
        fontWeight: "bold",
        color: "#d4af37",
        marginBottom: 10,
    },
    navItem: {
        paddingVertical: 10,
        paddingHorizontal: 5,
        borderRadius: 5,
        marginVertical: 5,
    },
    navText: {
        color: "#fff",
        fontSize: 16,
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
        left: 20,
        top: 20,
        zIndex: 15,
    },
    menuText: {
        fontSize: 24,
        fontWeight: "bold",
        color: "#d4af37",
    },
    heading: {
        fontSize: 24,
        fontWeight: "bold",
        color: "#fff",
        textAlign: "center",
        marginBottom: 20,
    },
    card: {
        marginBottom: 15,
        padding: 15,
        borderRadius: 10,
    },
    cardTitle: {
        fontSize: 18,
        fontWeight: "bold",
    },
    cardText: {
        fontSize: 16,
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
        fontSize: 16,
        fontWeight: "bold",
    },
    green: { backgroundColor: "green" },
    orange: { backgroundColor: "orange" },
    blue: { backgroundColor: "blue" },
});

export default MaintenancePage;
