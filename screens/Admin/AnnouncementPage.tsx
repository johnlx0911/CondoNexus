import React, { useState, useEffect } from "react";
import { View, Text, TouchableOpacity, StyleSheet, ScrollView, Animated, FlatList, TextInput } from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { useNavigation } from "@react-navigation/native";
import { StackNavigationProp } from "@react-navigation/stack";
import { RootStackParamList } from "../../App";
import axios from "axios";

const AnnouncementPage: React.FC = () => {
    const navigation = useNavigation<StackNavigationProp<RootStackParamList>>();
    const [sidebarOpen, setSidebarOpen] = useState(false);
    const slideAnim = useState(new Animated.Value(-250))[0];
    const [announcements, setAnnouncements] = useState<any[]>([]);
    const [newTitle, setNewTitle] = useState("");
    const [newMessage, setNewMessage] = useState("");

    const API_BASE = "http://192.168.0.109:5000/api";

    // Fetch announcements from backend
    const fetchAnnouncements = async () => {
        try {
            const res = await axios.get(`${API_BASE}/get-announcements`);
            setAnnouncements(res.data);
        } catch (err) {
            console.error("❌ Failed to fetch announcements:", err);
        }
    };

    useEffect(() => {
        fetchAnnouncements();
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

    // Add new announcement
    const addAnnouncement = async () => {
        if (newTitle.trim() && newMessage.trim()) {
            const payload = {
                recipient: "all",
                sender: "leexing0911@gmail.com",
                subject: newTitle.trim(),
                message: newMessage.trim(),
                type: "announcement",
                timestamp: new Date().toISOString(),
            };

            try {
                await axios.post(`${API_BASE}/send-message`, payload);
                console.log("📢 Announcement sent!");
                setNewTitle("");
                setNewMessage("");
                fetchAnnouncements(); // Refresh list
            } catch (err: any) {
                console.error("❌ Failed to send announcement:", err.response?.data || err.message);
            }
        }
    };

    // Local delete (soft delete from UI)
    const deleteAnnouncement = async (id: number) => {
        try {
            await axios.delete(`${API_BASE}/delete-announcement/${id}`);
            setAnnouncements(prev => prev.filter(item => item.id !== id));
            console.log("🗑️ Deleted announcement ID:", id);
        } catch (err) {
            console.error("❌ Failed to delete announcement:", err);
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
                    <Text style={styles.title}>A N N O U N C E M E N T S</Text>
                    <View style={styles.titleLine} />
                </View>

                {/* Add New Announcement */}
                <View style={styles.inputContainer}>
                    <TextInput
                        style={styles.input}
                        placeholder="Enter Announcement Title"
                        placeholderTextColor="#bbb"
                        value={newTitle}
                        onChangeText={setNewTitle}
                    />
                    <TextInput
                        style={[styles.input, styles.messageInput]}
                        placeholder="Enter Announcement Message"
                        placeholderTextColor="#bbb"
                        multiline
                        numberOfLines={3}
                        value={newMessage}
                        onChangeText={setNewMessage}
                    />
                    <TouchableOpacity style={[styles.button, styles.green]} onPress={addAnnouncement}>
                        <Text style={styles.buttonText}>Post Announcement</Text>
                    </TouchableOpacity>
                </View>

                {/* Announcements List */}
                <FlatList
                    data={announcements}
                    keyExtractor={(item) => item.id}
                    renderItem={({ item }) => (
                        <LinearGradient colors={["#d4af37", "#fff"]} style={styles.card}>
                            <Text style={styles.cardTitle}>{item.title}</Text>
                            <Text style={styles.cardText}>{item.message}</Text>
                            <Text style={styles.cardDate}>📅 {item.date}</Text>

                            {/* Action Buttons */}
                            <TouchableOpacity style={[styles.button, styles.red]} onPress={() => deleteAnnouncement(item.id)}>
                                <Text style={styles.buttonText}>Delete</Text>
                            </TouchableOpacity>
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
        fontSize: 20,
        color: "#d4af37",
        textAlign: "center",
        fontFamily: "TimesNewRoman",
        marginBottom: 10,
        marginTop: 36,
    },
    titleLine: {
        width: "95%", // ✅ Adjust width as needed
        height: 1, // ✅ Thickness of the line
        backgroundColor: "#d4af37", // ✅ Golden color like the text
        alignSelf: "center", // ✅ Centers the line
        marginTop: 1, // ✅ Spacing from title
        borderRadius: 2, // ✅ Smooth edges
        marginBottom: 18,
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
        top: 55,
        zIndex: 15,
    },
    menuText: {
        fontSize: 28,
        fontFamily: "TimesNewRoman",
        color: "#d4af37",
    },
    heading: {
        fontSize: 28,
        color: "#fff",
        textAlign: "center",
        marginBottom: 20,
        fontFamily: "TimesNewRoman",
    },
    inputContainer: {
        marginBottom: 20,
        marginLeft: 8,
        marginRight: 8,
    },
    input: {
        backgroundColor: "#fff",
        borderRadius: 15,
        padding: 10,
        marginBottom: 10,
        fontSize: 18,
        fontFamily: "TimesNewRoman",
    },
    messageInput: {
        height: 80,
        textAlignVertical: "top",
    },
    card: {
        marginBottom: 15,
        padding: 15,
        borderRadius: 15,
        marginLeft: 8,
        marginRight: 8,
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
    cardDate: {
        fontSize: 16,
        color: "#777",
        marginTop: 5,
        fontFamily: "TimesNewRoman",
    },
    button: {
        padding: 10,
        borderRadius: 15,
        alignItems: "center",
        marginTop: 10,
    },
    buttonText: {
        color: "#fff",
        fontSize: 18,
        fontFamily: "TimesNewRoman",
    },
    green: { backgroundColor: "green" },
    red: { backgroundColor: "red" },
});

export default AnnouncementPage;
