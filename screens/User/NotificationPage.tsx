import React from "react";
import { View, Text, TouchableOpacity, StyleSheet, ScrollView, Image } from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { useNavigation } from "@react-navigation/native";
import { StackNavigationProp } from "@react-navigation/stack";
import { RootStackParamList } from "../../App"; // Import the navigation types
import Icon from "react-native-vector-icons/Feather";

const notifications = [
    { id: 1, sender: "Member", title: "Notification, please be inform...", body: "This is a test notification", time: "5:09 PM" },
    { id: 2, sender: "Facility", title: "Thanks for visit! See you next ...", body: "Your facility booking was successful", time: "4:30 PM" },
    { id: 3, sender: "Admin", title: "Good news! You have been cho...", body: "You are selected as Resident of the Month", time: "2:45 PM" },
    { id: 4, sender: "Payment", title: "Reminder, please be inform th...", body: "Your payment is due soon", time: "1:15 PM" },
    { id: 5, sender: "Facility", title: "Your facility booking was suc...", body: "Confirmation of your facility booking", time: "11:50 AM" },
];

const NotificationPage = () => {
    const navigation = useNavigation<StackNavigationProp<RootStackParamList>>();

    return (
        <LinearGradient colors={["#1a120b", "#b88b4a"]} style={styles.container}>
            {/* Back Button */}
            <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
                <Icon name="arrow-left" size={24} color="#d4af37" />
            </TouchableOpacity>

            {/* Page Title */}
            <Text style={styles.title}>NOTIFICATION</Text>

            {/* Scrollable Content with Contact Button Positioned Properly */}
            <View style={styles.contentContainer}>
                <ScrollView style={styles.notificationList} contentContainerStyle={{ paddingBottom: 20 }}>
                    {notifications.map((item) => (
                        <TouchableOpacity
                            key={item.id}
                            style={styles.notificationItem}
                            onPress={() => navigation.navigate("Message", { message: item })}
                        >
                            <View style={styles.notificationContent}>
                                <Image source={require("../../assets/profile-icon.png")} style={styles.notificationImage} />
                                <View>
                                    <Text style={styles.senderName}>{item.sender}</Text>
                                    <Text style={styles.notificationText}>{item.title}</Text>
                                </View>
                            </View>
                            <Icon name="chevron-right" size={20} color="#fff" />
                        </TouchableOpacity>
                    ))}
                </ScrollView>

                {/* Contact Manager Button */}
                <TouchableOpacity style={styles.contactButton} onPress={() => navigation.navigate("Contact")}>
                    <Text style={styles.contactText}>CONTACT MANAGER</Text>
                </TouchableOpacity>
            </View>

            {/* Bottom Navigation */}
            <View style={styles.bottomNav}>
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
            </View>
        </LinearGradient>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        paddingHorizontal: 20,
        paddingTop: 50,
    },
    backButton: {
        position: "absolute",
        top: 50,
        left: 20,
    },
    title: {
        fontSize: 24,
        fontWeight: "bold",
        color: "#d4af37",
        textAlign: "center",
        marginBottom: 20,
    },
    contentContainer: {
        flex: 1,
        justifyContent: "space-between",
        marginBottom: 20,
    },
    notificationList: {
        flexGrow: 1,
    },
    notificationItem: {
        flexDirection: "row",
        justifyContent: "space-between",
        paddingVertical: 15,
        paddingHorizontal: 20,
        backgroundColor: "rgba(255,255,255,0.1)",
        borderRadius: 10,
        marginBottom: 10,
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
        fontSize: 16,
        fontWeight: "bold",
        color: "#d4af37",
    },
    notificationText: {
        fontSize: 14,
        color: "#fff",
    },
    contactButton: {
        backgroundColor: "#d4af37",
        paddingVertical: 12,
        borderRadius: 25,
        alignItems: "center",
        marginHorizontal: 20,
        marginBottom: 10, // Ensures button is above bottom nav
    },
    contactText: {
        color: "#000",
        fontSize: 16,
        fontWeight: "bold",
    },
    bottomNav: {
        flexDirection: "row",
        backgroundColor: "#fff",
        borderRadius: 25,
        paddingVertical: 10,
        paddingHorizontal: 20,
        width: "90%",
        justifyContent: "space-around",
        alignItems: "center",
        alignSelf: "center",
        elevation: 5,
    },
    navButton: {
        alignItems: "center",
    },
    navText: {
        fontSize: 12,
        fontWeight: "bold",
        color: "#000",
        marginTop: 5,
    },
});

export default NotificationPage;
