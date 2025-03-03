import React, { useState } from "react";
import {
    View,
    Text,
    TouchableOpacity,
    StyleSheet,
    ScrollView,
    Animated,
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { useNavigation } from "@react-navigation/native";
import { StackNavigationProp } from "@react-navigation/stack";
import { RootStackParamList } from "../../App"; // Import navigation types

const DashboardPage: React.FC = () => {
    const navigation = useNavigation<StackNavigationProp<RootStackParamList>>();
    const [sidebarOpen, setSidebarOpen] = useState(false);
    const slideAnim = useState(new Animated.Value(-250))[0]; // Sidebar animation

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

                <Text style={styles.heading}>Admin Dashboard</Text>

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
    },
    gridContainer: {
        flexDirection: "row",
        flexWrap: "wrap",
        justifyContent: "space-between",
        marginTop: 20,
    },
    card: {
        width: "48%",
        padding: 15,
        borderRadius: 10,
        marginBottom: 20,
    },
    cardTitle: {
        fontSize: 18,
        fontWeight: "bold",
    },
    cardText: {
        fontSize: 16,
        color: "#444",
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
        fontSize: 16,
        fontWeight: "bold",
    },
    green: { backgroundColor: "green" },
    orange: { backgroundColor: "orange" },
    red: { backgroundColor: "red" },
});

export default DashboardPage;
