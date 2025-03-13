import React, { useState, useEffect, useRef } from "react";
import { View, Text, TouchableOpacity, StyleSheet, ScrollView, Animated, FlatList, TextInput, Alert } from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { useNavigation } from "@react-navigation/native";
import { StackNavigationProp } from "@react-navigation/stack";
import { RootStackParamList } from "../../App";

type Message = {
    id: number;        // ✅ Changed to number (for real data consistency)
    sender: string;
    subject: string;
    message: string;
    status: string;
};

const ResidentPage: React.FC = () => {
    const navigation = useNavigation<StackNavigationProp<RootStackParamList>>();
    const [sidebarOpen, setSidebarOpen] = useState(false);
    const slideAnim = useState(new Animated.Value(-250))[0];
    const [replyMessage, setReplyMessage] = useState("");
    const [residentMessages, setResidentMessages] = useState<Message[]>([]);
    const scrollViewRef = useRef<ScrollView>(null);

    const [loading, setLoading] = useState(false);

    // ✅ Updated fetchMessages to refresh properly
    const fetchMessages = async () => {
        if (loading) return;  // ✅ Prevent multiple simultaneous requests
        setLoading(true); // ✅ Start loading state

        try {
            const response = await fetch("http://192.168.0.109:3000/api/get-resident-messages");
            const data: Message[] = await response.json();

            if (Array.isArray(data)) {
                setResidentMessages(data);  // ✅ Show only resident messages
                scrollViewRef.current?.scrollTo({ y: 0, animated: true });
            } else {
                Alert.alert("Error", "Failed to load messages.");
            }
        } catch (error) {
            console.error("Error fetching messages:", error);
            Alert.alert("Error", "Something went wrong. Please try again.");
        } finally {
            setLoading(false); // ✅ End loading state
        }
    };

    // Fetch messages when the page loads
    useEffect(() => {
        const unsubscribe = navigation.addListener('focus', () => {
            fetchMessages(); // ✅ Auto-refresh on navigation back
        });

        return unsubscribe;
    }, [navigation]);

    // Toggle Sidebar
    const toggleSidebar = () => {
        Animated.timing(slideAnim, {
            toValue: sidebarOpen ? -250 : 0,
            duration: 300,
            useNativeDriver: true,
        }).start();
        setSidebarOpen(!sidebarOpen);
    };

    // Function to reply to a message
    const replyToMessage = (id: number) => {
        console.log(`Replying to message ${id}`);
    };

    // Function to delete a message
    const deleteMessage = (id: number) => {
        console.log(`Deleted message ${id}`);
    };

    // Function to mark message as read/unread
    const toggleReadStatus = (id: number, currentStatus: string) => {
        const newStatus = currentStatus === "Unread" ? "Read" : "Unread";
        console.log(`Message ${id} marked as ${newStatus}`);
    };

    // Function to mark message as Read
    const markAsRead = async (id: number, currentStatus: string) => {
        if (currentStatus === "Replied") return; // ✅ Skip updating if already "Replied"

        try {
            const response = await fetch(`http://192.168.0.109:3000/api/update-status/${id}`, {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ status: "Read" }),
            });

            const data = await response.json();
            if (data.success) {
                console.log(`✅ Message ${id} marked as 'Read'`);
                setResidentMessages((prevMessages) =>
                    prevMessages.map((msg) =>
                        msg.id === id ? { ...msg, status: "Read" } : msg
                    )
                );
            } else {
                console.error(`❌ Failed to mark message ${id} as 'Read'`);
            }
        } catch (error) {
            console.error("Error updating status:", error);
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
                    <Text style={styles.title}>M E S S A G E S</Text>
                    <View style={styles.titleLine} />
                </View>

                <TouchableOpacity onPress={fetchMessages} style={styles.refreshButton}>
                    <Text style={styles.refreshText}>
                        {loading ? "⏳ Refreshing..." : "🔄 Refresh"}
                    </Text>
                </TouchableOpacity>

                {/* Messages List */}
                <FlatList
                    data={residentMessages}
                    keyExtractor={(item) => item.id.toString() || Math.random().toString()}
                    renderItem={({ item }) => (
                        <TouchableOpacity onPress={() => {
                            console.log("✅ Navigating to Reply Page");
                            markAsRead(item.id, item.status);  // ✅ Mark as 'Read' when clicked
                            navigation.navigate("Reply", {
                                messageId: item.id,     // ✅ Pass `messageId` to ReplyPage.tsx
                                recipientEmail: item.sender,
                                subject: item.subject,
                                originalMessage: item.message
                            });
                        }}>
                            <LinearGradient
                                colors={item.status === "Unread" ? ["#ffcccb", "#fff"] : item.status === "Replied" ? ["#90EE90", "#fff"] : ["#d4af37", "#fff"]}
                                style={styles.card}
                                pointerEvents="box-none"
                            >
                                <Text style={styles.subject}>{item.subject}</Text>
                                <Text style={styles.message}>{item.message}</Text>
                                <Text style={styles.sender}>From: {item.sender}</Text>
                                <Text style={styles.status}>
                                    Status: {item.status === "Unread" ? "🔶 Unread" : item.status === "Read" ? "✅ Read" : "📩 Replied"}
                                </Text>

                                {/* Reply Input */}
                                <TextInput
                                    style={styles.input}
                                    placeholder="Type your reply..."
                                    placeholderTextColor="#444"
                                    value={replyMessage}
                                    onChangeText={setReplyMessage}
                                />

                                {/* Action Buttons */}
                                <View style={styles.buttonContainer}>
                                    <TouchableOpacity onPress={() => replyToMessage(item.id)}>
                                        <Text style={styles.buttonText}>Reply</Text>
                                    </TouchableOpacity>

                                    <TouchableOpacity onPress={() => toggleReadStatus(item.id, item.status)}>
                                        <Text style={styles.buttonText}>
                                            {item.status === "Unread" ? "Mark as Read" : "Mark as Unread"}
                                        </Text>
                                    </TouchableOpacity>

                                    <TouchableOpacity onPress={() => deleteMessage(item.id)}>
                                        <Text style={styles.buttonText}>Delete</Text>
                                    </TouchableOpacity>
                                </View>
                            </LinearGradient>
                        </TouchableOpacity>
                    )}
                />
            </ScrollView>
        </LinearGradient >
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
        fontSize: 26,
        fontFamily: "Times New Roman",
        fontWeight: "bold",
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
        fontSize: 20,
        fontFamily: "Times New ROman",
        fontWeight: "bold",
    },
    cardText: {
        fontSize: 18,
        fontFamily: "Times New ROman",
        color: "#444",
    },
    input: {
        borderWidth: 1,
        borderColor: "#999",
        borderRadius: 5,
        padding: 8,
        marginTop: 10,
        fontSize: 14,
        color: "#000",
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
        fontSize: 18,
        fontFamily: "Times New ROman",
        fontWeight: "bold",
    },
    green: { backgroundColor: "green" },
    blue: { backgroundColor: "blue" },
    red: { backgroundColor: "red" },
    subject: {
        fontWeight: "bold",
        fontSize: 18,
        color: "#000",
        marginBottom: 5,
    },
    message: {
        marginVertical: 5,
        color: "#444",
    },
    sender: {
        color: "#777",
        fontSize: 14,
    },
    status: {
        marginTop: 5,
        fontWeight: "bold",
        color: "#d4af37",
    },
    refreshButton: {
        backgroundColor: "#d4af37",
        padding: 10,
        borderRadius: 8,
        alignItems: "center",
        marginVertical: 10,
    },
    refreshText: {
        color: "#000",
        fontWeight: "bold",
        fontSize: 16,
    },
});

export default ResidentPage;
