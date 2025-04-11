import React, { useState, useEffect } from "react";
import { View, Text, TouchableOpacity, StyleSheet, Image } from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { useNavigation } from "@react-navigation/native";
import { StackNavigationProp } from "@react-navigation/stack";
import { RootStackParamList } from "../../App"; // Import the navigation types
import Icon from "react-native-vector-icons/Feather";

const PaymentPage = () => {
    const navigation = useNavigation<StackNavigationProp<RootStackParamList>>();
    const [dueDate, setDueDate] = useState<string>("");
    const [daysRemaining, setDaysRemaining] = useState<number>(0);

    useEffect(() => {
        // Get today's date
        const today = new Date();

        // Get next month and year
        let nextMonth = today.getMonth() + 1;
        let nextYear = today.getFullYear();

        if (nextMonth > 11) {
            nextMonth = 0; // Reset to January
            nextYear += 1; // Move to next year
        }

        // Set due date to 1st of next month
        const nextDueDate = new Date(nextYear, nextMonth, 1);

        // Calculate days remaining
        const diffTime = nextDueDate.getTime() - today.getTime();
        const daysLeft = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

        // Format date to "1 Apr 2025"
        const formattedDueDate = nextDueDate.toLocaleDateString("en-GB", {
            day: "numeric",
            month: "short",
            year: "numeric",
        });

        // Set state values
        setDueDate(formattedDueDate);
        setDaysRemaining(daysLeft);
    }, []);

    return (
        <LinearGradient colors={["#1a120b", "#b88b4a"]} style={styles.container}>
            {/* Back Button */}
            <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
                <Icon name="arrow-left" size={24} color="#d4af37" />
            </TouchableOpacity>

            {/* Page Title */}
            <Text style={styles.title}>P A Y M E N T</Text>
            {/* ✅ New line below the title */}
            <View style={styles.titleLine} />

            {/* Amount */}
            <Text style={styles.amount}>RM234.52</Text>
            <Text style={styles.dueDate}>Due date {dueDate}</Text>
            <Text style={styles.warning}>
                <Icon name="bell" size={16} color="#d4af37" /> {daysRemaining} Days to due date
            </Text>

            {/* Fees Breakdown */}
            <View style={styles.feesContainer}>
                <Text style={styles.feeLabel}>Water</Text>
                <Text style={styles.feeAmount}>RM34.52</Text>
            </View>
            <View style={styles.feesContainer}>
                <Text style={styles.feeLabel}>Maintenance Fee</Text>
                <Text style={styles.feeAmount}>RM100</Text>
            </View>
            <View style={styles.feesContainer}>
                <Text style={styles.feeLabel}>Facilities Fee</Text>
                <Text style={styles.feeAmount}>RM100</Text>
            </View>

            {/* Buttons Container */}
            <View style={styles.buttonsContainer}>
                {/* PAY NOW Button */}
                <TouchableOpacity style={styles.buttonWrapper} onPress={() => navigation.navigate("CheckOut")}>
                    <LinearGradient colors={["#e6c78e", "#b88b4a"]} style={styles.payNowButton}>
                        <Text style={styles.buttonText}>P A Y  N O W</Text>
                    </LinearGradient>
                </TouchableOpacity>

                {/* TRANSACTION Button */}
                <TouchableOpacity style={styles.buttonWrapper} onPress={() => navigation.navigate("Transaction")}>
                    <LinearGradient colors={["#e6c78e", "#b88b4a"]} style={styles.transactionButton}>
                        <Text style={styles.buttonText}>T R A N S A C T I O N</Text>
                    </LinearGradient>
                </TouchableOpacity>
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
        width: "85%", // ✅ Adjust width as needed
        height: 1, // ✅ Thickness of the line
        backgroundColor: "#d4af37", // ✅ Golden color like the text
        alignSelf: "center", // ✅ Centers the line
        marginTop: 1, // ✅ Spacing from title
        borderRadius: 2, // ✅ Smooth edges
    },
    amount: {
        fontSize: 47,
        fontFamily: "TimesNewRoman",
        color: "#fff",
        textAlign: "left", // ✅ Align text to left
        alignSelf: "flex-start", // ✅ Move to the left side
        marginLeft: 35, // ✅ Adjust for proper spacing
        marginBottom: 5,
        marginTop: 60,
    },
    dueDate: {
        fontSize: 18,
        fontFamily: "TimesNewRoman",
        color: "#fff",
        textAlign: "left", // ✅ Align text to left
        alignSelf: "flex-start", // ✅ Move to the left side
        marginLeft: 35, // ✅ Adjust for proper spacing
        marginTop: 5,
    },
    warning: {
        fontSize: 16,
        fontFamily: "TimesNewRoman",
        color: "#d4af37",
        textAlign: "left", // ✅ Align text to left
        alignSelf: "flex-start", // ✅ Move to the left side
        marginLeft: 35, // ✅ Adjust for proper spacing
        marginBottom: 20,
        marginTop: 5,
    },
    feesContainer: {
        flexDirection: "row",
        alignItems: "center",
        marginTop: 40,
        width: "85%",
        alignSelf: "center",
    },
    feeLabel: {
        fontSize: 22,
        color: "#fff",
        fontFamily: "TimesNewRoman",
        flex: 1, // Ensures equal spacing
        textAlign: "left",
    },
    feeAmount: {
        fontSize: 24,
        color: "#d4af37",
        fontFamily: "TimesNewRoman",
        width: 100,
        textAlign: "left",
        marginRight: 30,
    },
    buttonWrapper: {
        width: "85%", // ✅ Ensures the entire button is clickable
        alignSelf: "center",
    },
    buttonsContainer: {
        position: "absolute",
        bottom: 130, // ✅ Puts the buttons above the bottom navigation bar
        width: "100%",
        alignSelf: "center",
    },
    payNowButton: {
        width: "100%",
        paddingVertical: 15,
        borderRadius: 25,
        alignItems: "center",
        elevation: 5,
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.3,
        shadowRadius: 5,
        bottom: 10,
    },
    transactionButton: {
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
    buttonText: {
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
        fontSize: 18,
        fontFamily: "TimesNewRoman",
    },
});

export default PaymentPage;
