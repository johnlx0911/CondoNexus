import React from "react";
import { View, Text, TouchableOpacity, StyleSheet, ScrollView, Image } from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { useNavigation } from "@react-navigation/native";
import { StackNavigationProp } from "@react-navigation/stack";
import Icon from "react-native-vector-icons/Feather";

const notifications = [
    { id: 1, sender: "Member", title: "Notification, please be inform...", body: "This is a test notification", time: "5:09 PM" },
    { id: 2, sender: "Facility", title: "Thanks for visit! See you next ...", body: "Your facility booking was successful", time: "4:30 PM" },
    { id: 3, sender: "Admin", title: "Good news! You have been cho...", body: "You are selected as Resident of the Month", time: "2:45 PM" },
    { id: 4, sender: "Payment", title: "Reminder, please be inform th...", body: "Your payment is due soon", time: "1:15 PM" },
    { id: 5, sender: "Facility", title: "Your facility booking was suc...", body: "Confirmation of your facility booking", time: "11:50 AM" },
];

const NotificationPage = () => {
    const navigation = useNavigation<StackNavigationProp<any>>();

    return (
        <LinearGradient colors={["#1a120b", "#b88b4a"]} style={styles.container}>
            {/* Back Button */}
            <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
                <Icon name="arrow-left" size={24} color="#d4af37" />
            </TouchableOpacity>

            {/* Page Title */}
            <Text style={styles.title}>N O T I F I C A T I O N</Text>
            <View style={styles.titleLine} />

            {/* Scrollable Content */}
            <View style={styles.contentContainer}>
                <ScrollView contentContainerStyle={styles.notificationList}>
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
        width: "85%", // ✅ Adjust width as needed
        height: 1, // ✅ Thickness of the line
        backgroundColor: "#d4af37", // ✅ Golden color like the text
        alignSelf: "center", // ✅ Centers the line
        marginTop: 1, // ✅ Spacing from title
        borderRadius: 2, // ✅ Smooth edges
        marginBottom: 10,
    },
    contentContainer: {
        flex: 1,
        width: "90%",
        justifyContent: "space-between",
        marginBottom: 10,
        alignItems: "center", // ✅ Centering items
    },
    notificationList: {
        paddingBottom: 10,
        width: "120%",
        alignItems: "center", // ✅ Ensures the list is centered
    },
    notificationItem: {
        flexDirection: "row",
        justifyContent: "space-between",
        paddingVertical: 12,
        paddingHorizontal: 15,
        backgroundColor: "rgba(255,255,255,0.1)",
        borderRadius: 15,
        marginBottom: 8,
        marginTop: 10,
        width: "80%", // ✅ Reduced width to match title line
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
        fontSize: 18,
        fontWeight: "bold",
        color: "#d4af37",
        fontFamily: "Times New Roman",
    },
    notificationText: {
        fontSize: 16,
        color: "#fff",
        fontFamily: "Times New Roman",
    },
    buttonWrapper: {
        width: "85%", // ✅ Ensures the entire button is clickable
        alignSelf: "center",
    },
    buttonsContainer: {
        position: "absolute",
        bottom: 120, // ✅ Puts the buttons above the bottom navigation bar
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
        fontSize: 18,
        fontFamily: "Times New Roman",
        fontWeight: "bold",
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
        elevation: 5,
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.3,
        shadowRadius: 5,
    },
    navButton: {
        alignItems: "center",
    },
    navText: {
        color: "#000",
        fontSize: 16,
        fontFamily: "Times New Roman",
        fontWeight: "bold",
    },
});

export default NotificationPage;
