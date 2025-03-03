import React, { useState } from "react";
import {
    View,
    Text,
    TouchableOpacity,
    StyleSheet,
    ScrollView,
    Animated,
    FlatList,
    TextInput,
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { useNavigation } from "@react-navigation/native";
import { StackNavigationProp } from "@react-navigation/stack";
import { RootStackParamList } from "../../App";

// Sample announcements data
const initialAnnouncements = [
    { id: "1", title: "Pool Maintenance", message: "The swimming pool will be closed for cleaning on Saturday.", date: "2025-02-28" },
    { id: "2", title: "Security Update", message: "Please remember to update your visitor access list.", date: "2025-02-25" },
    { id: "3", title: "Event: Community BBQ", message: "Join us for a BBQ this weekend at the common area!", date: "2025-03-02" },
];

const AnnouncementPage: React.FC = () => {
    const navigation = useNavigation<StackNavigationProp<RootStackParamList>>();
    const [sidebarOpen, setSidebarOpen] = useState(false);
    const slideAnim = useState(new Animated.Value(-250))[0];
    const [announcements, setAnnouncements] = useState(initialAnnouncements);
    const [newTitle, setNewTitle] = useState("");
    const [newMessage, setNewMessage] = useState("");

    // Toggle Sidebar
    const toggleSidebar = () => {
        Animated.timing(slideAnim, {
            toValue: sidebarOpen ? -250 : 0,
            duration: 300,
            useNativeDriver: true,
        }).start();
        setSidebarOpen(!sidebarOpen);
    };

    // Function to add a new announcement
    const addAnnouncement = () => {
        if (newTitle.trim() && newMessage.trim()) {
            const newAnnouncement = {
                id: Math.random().toString(),
                title: newTitle,
                message: newMessage,
                date: new Date().toISOString().split("T")[0],
            };
            setAnnouncements([newAnnouncement, ...announcements]);
            setNewTitle("");
            setNewMessage("");
        }
    };

    // Function to delete an announcement
    const deleteAnnouncement = (id: string) => {
        setAnnouncements(announcements.filter((item) => item.id !== id));
    };

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

                <Text style={styles.heading}>Announcements</Text>

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
    overlay: {
        position: "absolute",
        top: 0,
        left: 0,
        width: "100%",
        height: "100%",
        backgroundColor: "rgba(0, 0, 0, 0.5)",  // Dim the background
        zIndex: 5,
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
        color: "#007BFF",
      },
    heading: {
        fontSize: 24,
        fontWeight: "bold",
        color: "#fff",
        textAlign: "center",
        marginBottom: 20,
    },
    inputContainer: {
        marginBottom: 20,
    },
    input: {
        backgroundColor: "#fff",
        borderRadius: 5,
        padding: 10,
        marginBottom: 10,
        fontSize: 16,
    },
    messageInput: {
        height: 80,
        textAlignVertical: "top",
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
    cardDate: {
        fontSize: 14,
        color: "#777",
        marginTop: 5,
    },
    button: {
        padding: 10,
        borderRadius: 5,
        alignItems: "center",
        marginTop: 10,
    },
    buttonText: {
        color: "#fff",
        fontSize: 16,
    },
    green: { backgroundColor: "green" },
    red: { backgroundColor: "red" },
});

export default AnnouncementPage;
