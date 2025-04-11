import React, { useState, useEffect } from "react";
import { View, Text, TouchableOpacity, StyleSheet, ScrollView, Image, Alert, ActivityIndicator } from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { useNavigation } from "@react-navigation/native";
import { StackNavigationProp } from "@react-navigation/stack";
import Icon from "react-native-vector-icons/Feather";
import AsyncStorage from "@react-native-async-storage/async-storage";

// Type definition for dynamic notifications
type Notification = {
    id: number;
    sender: string;
    subject: string;
    message: string;
    status: string;
    createdAt: string; // ✅ Corrected for timestamp usage
    type: string; // ✅ Identify if the message is from 'admin'
};

const NotificationPage = () => {
    const navigation = useNavigation<StackNavigationProp<any>>();
    const [notifications, setNotifications] = useState<Notification[]>([]);
    const [isLoading, setIsLoading] = useState(false);  // ✅ Loading State

    // ✅ Fetch Notifications Function
    const fetchNotifications = async () => {
        setIsLoading(true);

        try {
            const loggedInUserEmail = await AsyncStorage.getItem("userEmail");  // ✅ Retrieve dynamically

            if (!loggedInUserEmail) {
                Alert.alert("Error", "Failed to retrieve user email.");
                return;
            }

            const response = await fetch(
                `http://192.168.0.109:5000/api/get-notifications?recipientEmail=${loggedInUserEmail}`
            );

            const data: Notification[] = await response.json();

            if (Array.isArray(data)) {
                setNotifications(data);  // ✅ Show only admin replies
            } else {
                Alert.alert("Error", "Failed to load notifications.");
            }
        } catch (error) {
            console.error("Error fetching notifications:", error);
            Alert.alert("Error", "Something went wrong. Please try again.");
        } finally {
            setIsLoading(false);
        }
    };

    const handleInvitation = async (messageId: number, senderEmail: string, action: "accept" | "reject") => {
        const userEmail = await AsyncStorage.getItem("userEmail");
        if (!userEmail) return Alert.alert("Error", "Your email is not available.");

        if (action === "accept") {
            try {
                // Step 1: Add to member list
                const response = await fetch("http://192.168.0.109:5000/api/add-member", {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({
                        userEmail,
                        senderEmail
                    }),
                });

                const data = await response.json();

                if (data.success) {
                    // Step 2: Update message status to 'Accepted'
                    await fetch(`http://192.168.0.109:5000/api/update-status/${messageId}`, {
                        method: "PUT",
                        headers: { "Content-Type": "application/json" },
                        body: JSON.stringify({ status: "Accepted" }),
                    });

                    Alert.alert("Success", "You are now connected!");
                    fetchNotifications();
                } else {
                    Alert.alert("Error", data.message);
                }
            } catch (err) {
                console.error(err);
                Alert.alert("Error", "Something went wrong.");
            }
        } else {
            // Reject logic (just delete the message or mark as read)
            try {
                await fetch(`http://192.168.0.109:5000/api/update-status/${messageId}`, {
                    method: "PUT",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({ status: "Rejected" }),
                });
                fetchNotifications(); // refresh
            } catch (err) {
                console.error(err);
            }
        }
    };

    return (
        <LinearGradient colors={["#1a120b", "#b88b4a"]} style={styles.container}>
            {/* Back Button */}
            <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
                <Icon name="arrow-left" size={24} color="#d4af37" />
            </TouchableOpacity>

            {/* Page Title */}
            <Text style={styles.title}>N O T I F I C A T I O N</Text>
            <View style={styles.titleLine} />

            {/* Refresh Button */}
            <TouchableOpacity onPress={fetchNotifications} style={styles.refreshButton}>
                <Icon name="refresh-cw" size={20} color="#d4af37" />
                <Text style={styles.refreshText}>Refresh</Text>
            </TouchableOpacity>

            {/* Scrollable Content */}
            <View style={styles.contentContainer}>
                {isLoading ? (
                    <ActivityIndicator size="large" color="#d4af37" />
                ) : notifications.length === 0 ? (
                    <View style={styles.emptyContainer}>
                        <Icon name="inbox" size={50} color="#d4af37" />
                        <Text style={styles.noNotificationText}>No notifications yet.</Text>
                    </View>
                ) : (
                    <ScrollView contentContainerStyle={styles.notificationList}>
                        {notifications.map((item) => (
                            <View key={item.id} style={styles.notificationItem}>
                                <View style={styles.notificationContent}>
                                    <Image
                                        source={require("../../assets/profile-icon.png")}
                                        style={styles.notificationImage}
                                    />
                                    <View>
                                        <Text style={styles.senderName}>{item.sender}</Text>
                                        <Text style={styles.notificationText}>{item.subject}</Text>
                                    </View>
                                </View>

                                {/* 👉 Conditional Buttons for Membership Invitation */}
                                {item.subject === "Membership Invitation" ? (
                                    <>
                                        {item.status === "Unread" ? (
                                            <View style={{ flexDirection: "row" }}>
                                                <TouchableOpacity
                                                    style={styles.actionButton}
                                                    onPress={() => handleInvitation(item.id, item.sender, "accept")}
                                                >
                                                    <Text style={styles.actionButtonText}>Accept</Text>
                                                </TouchableOpacity>
                                                <TouchableOpacity
                                                    style={[styles.actionButton, { backgroundColor: "#c0392b" }]}
                                                    onPress={() => handleInvitation(item.id, item.sender, "reject")}
                                                >
                                                    <Text style={styles.actionButtonText}>Reject</Text>
                                                </TouchableOpacity>
                                            </View>
                                        ) : item.status === "Accepted" ? (
                                            <Text style={{ color: "#2ecc71" }}>
                                                You are now connected with {item.sender}
                                            </Text>
                                        ) : item.status === "Rejected" ? (
                                            <Text style={{ color: "#e74c3c" }}>
                                                You rejected the invitation from {item.sender}
                                            </Text>
                                        ) : null}
                                    </>
                                ) : (
                                    <Icon name="chevron-right" size={20} color="#fff" />
                                )}
                            </View>
                        ))}
                    </ScrollView>
                )}

                {/* Contact Manager Button (Now Visible & Positioned Properly) */}
                <View style={styles.buttonsContainer}>
                    <TouchableOpacity style={styles.buttonWrapper} onPress={() => navigation.navigate("Contact")}>
                        <LinearGradient colors={["#e6c78e", "#b88b4a"]} style={styles.contactButton}>
                            <Text style={styles.contactText}>C O N T A C T  M A N A G E R</Text>
                        </LinearGradient>
                    </TouchableOpacity>
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
        marginBottom: 10,
    },
    refreshButton: {
        flexDirection: "row",
        alignItems: "center",
        marginBottom: 10,
    },
    refreshText: {
        color: "#d4af37",
        marginLeft: 5,
        fontSize: 16,
    },
    contentContainer: {
        flex: 1,
        width: "90%",
        alignItems: "center",
    },
    emptyContainer: {
        alignItems: "center",
        marginTop: 50,
    },
    noNotificationText: {
        color: "#fff",
        fontSize: 16,
        marginTop: 10,
        fontFamily: "TimesNewRoman",
    },
    notificationList: {
        paddingBottom: 10,
        width: "100%",
        alignItems: "center",
    },
    notificationItem: {
        flexDirection: "row",
        justifyContent: "space-between",
        paddingVertical: 12,
        paddingHorizontal: 15,
        backgroundColor: "rgba(255,255,255,0.1)",
        borderRadius: 15,
        marginBottom: 8,
        width: "100%",
        alignItems: "center",
    },
    notificationContent: {
        flexDirection: "row",
        alignItems: "center",
    },
    notificationImage: {
        width: 40,
        height: 40,
        borderRadius: 20,
        marginRight: 10,
    },
    senderName: {
        fontSize: 20,
        color: "#d4af37",
    },
    notificationText: {
        fontSize: 16,
        color: "#fff",
    },
    buttonWrapper: {
        width: "85%", // ✅ Ensures the entire button is clickable
        alignSelf: "center",
    },
    buttonsContainer: {
        position: "absolute",
        bottom: 125, // ✅ Puts the buttons above the bottom navigation bar
        width: "110%",
        alignSelf: "center",
    },
    contactButton: {
        width: "100%",
        marginTop: 10, // ✅ Spacing between the two buttons
        paddingVertical: 15,
        borderRadius: 25,
        alignItems: "center",
        elevation: 5,
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.3,
        shadowRadius: 5,
    },
    contactText: {
        fontSize: 20,
        fontFamily: "TimesNewRoman",
        color: "#000",
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
    },
    navButton: {
        alignItems: "center",
    },
    navText: {
        color: "#000",
        fontSize: 16,
    },
    actionButton: {
        backgroundColor: "#27ae60",
        paddingVertical: 5,
        paddingHorizontal: 10,
        borderRadius: 8,
        marginHorizontal: 3,
    },
    actionButtonText: {
        color: "#fff",
        fontSize: 16,
    },
});

export default NotificationPage;