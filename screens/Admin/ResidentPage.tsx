import React, { useState, useEffect } from "react";
import { View, Text, TouchableOpacity, StyleSheet, ScrollView, Animated, FlatList, Alert } from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { useNavigation } from "@react-navigation/native";
import { StackNavigationProp } from "@react-navigation/stack";
import { RootStackParamList } from "../../App";
import axios from "axios";

type Resident = {
    id: string;
    name: string;
    unit_number: string;
    status: string;
};

const ResidentPage: React.FC = () => {
    const navigation = useNavigation<StackNavigationProp<RootStackParamList>>();
    const [sidebarOpen, setSidebarOpen] = useState(false);
    const slideAnim = useState(new Animated.Value(-250))[0];
    const [isLoading, setIsLoading] = useState(true);
    const [residents, setResidents] = useState<Resident[]>([]);

    useEffect(() => {
        const fetchResidents = async () => {
            try {
                const response = await axios.get<Resident[]>("http://192.168.0.109:5000/residents");

                console.log("✅ Residents Fetched:", response.data);  // ✅ Debugging log

                // 🔍 REMOVE THIS FILTER to show both "Pending" and "Approved"
                setResidents(response.data);  // ✅ Set filtered residents
            } catch (error) {
                console.error("❌ Error fetching residents:", error);
            } finally {
                setIsLoading(false);  // ✅ Stop loading after data fetch
            }
        };
        fetchResidents();
    }, []);

    // Toggle Sidebar
    const toggleSidebar = () => {
        Animated.timing(slideAnim, {
            toValue: sidebarOpen ? -250 : 0,
            duration: 300,
            useNativeDriver: true,
        }).start();
        setSidebarOpen(!sidebarOpen);
    };

    // Function to approve a resident
    const approveResident = async (id: string) => {
        try {
            const response = await axios.post(`http://192.168.0.109:5000/approve-resident/${id}`);
            if (response.data.success) {
                Alert.alert("Success", "Resident approved successfully.");
                setResidents(residents.map(resident =>
                    resident.id === id ? { ...resident, status: "Approved" } : resident
                ));
            } else {
                Alert.alert("Error", "Failed to approve resident. Please try again.");
            }
        } catch (error) {
            console.error("Error approving resident:", error);
            Alert.alert("Error", "Failed to approve resident.");
        }
    };

    // Function to edit resident details
    const editResident = (id: string) => {
        console.log(`Editing resident ${id}`);
        // Navigate to edit page
        navigation.navigate("Resident", { residentId: "default" });
    };

    // Function to terminate a resident
    const terminateResident = async (id: string) => {
        try {
            await axios.delete(`http://192.168.0.109:5000/reject-resident/${id}`);
            Alert.alert("Success", "Resident rejected successfully.");
            setResidents(residents.filter(resident => resident.id !== id));
        } catch (error) {
            console.error("Error rejecting resident:", error);
            Alert.alert("Error", "Failed to reject resident.");
        }
    };

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
                    <Text style={styles.title}>R E S I D E N T S</Text>
                    <View style={styles.titleLine} />
                </View>

                {/* Residents List */}
                <FlatList
                    data={residents}
                    keyExtractor={(item) => item.id}
                    ListEmptyComponent={
                        !isLoading ? (
                            <Text style={{ textAlign: "center", color: "white", marginTop: 20, fontFamily: "TimesNewRoman", fontSize: 24, }}>
                                No residents found
                            </Text>
                        ) : null
                    }
                    renderItem={({ item }) => (
                        <LinearGradient colors={["#d4af37", "#fff"]} style={styles.card}>
                            <Text style={styles.cardTitle}>{item.name}</Text>
                            <Text style={styles.cardText}>Unit: {item.unit_number}</Text>
                            <Text style={[styles.cardText, { color: item.status === "Pending" ? "orange" : "green" }]}>
                                Status: {item.status}
                            </Text>

                            {/* Action Buttons */}
                            <View style={styles.buttonContainer}>
                                {/* ✅ Show Approve Button Only for "Pending" Residents */}
                                {item.status === "Pending" && (
                                    <TouchableOpacity
                                        style={[styles.button, styles.green]}
                                        onPress={() => approveResident(item.id)}
                                    >
                                        <Text style={styles.buttonText}>Approve</Text>
                                    </TouchableOpacity>
                                )}

                                {/* ✅ Always Show Edit and Terminate for Both Statuses */}
                                <TouchableOpacity
                                    style={[styles.button, styles.blue]}
                                    onPress={() => editResident(item.id)}
                                >
                                    <Text style={styles.buttonText}>Edit</Text>
                                </TouchableOpacity>

                                <TouchableOpacity
                                    style={[styles.button, styles.red]}
                                    onPress={() => terminateResident(item.id)}
                                >
                                    <Text style={styles.buttonText}>Terminate</Text>
                                </TouchableOpacity>
                            </View>
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
        fontSize: 26,
        color: "#d4af37",
        textAlign: "center",
        fontFamily: "TimesNewRoman",
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
        marginLeft: 7,
        marginRight: 7,
    },
    cardTitle: {
        fontSize: 22,
        fontFamily: "TimesNewRoman",
    },
    cardText: {
        fontSize: 18,
        color: "#444",
        fontFamily: "TimesNewRoman",
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
    green: { backgroundColor: "green" },
    blue: { backgroundColor: "blue" },
    red: { backgroundColor: "red" },
    pendingStatus: {
        color: "orange",
    },
});

export default ResidentPage;
