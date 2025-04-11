import React from "react";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { useNavigation } from "@react-navigation/native";
import Icon from "react-native-vector-icons/Feather";
import { StackNavigationProp } from "@react-navigation/stack";
import { RouteProp, useRoute } from "@react-navigation/native";
import { RootStackParamList } from "../../App";

const TransactionDetailsPage = () => {
    const navigation = useNavigation<StackNavigationProp<RootStackParamList>>();
    const route = useRoute<RouteProp<RootStackParamList, "TransactionDetails">>();

    // Extract transaction details from route parameters
    const { transaction } = route.params || {};

    if (!transaction) {
        return (
            <LinearGradient colors={["#1a120b", "#b88b4a"]} style={styles.container}>
                <Text style={styles.title}>Transaction Details Not Found</Text>
            </LinearGradient>
        );
    }

    return (
        <LinearGradient colors={["#1a120b", "#b88b4a"]} style={styles.container}>
            {/* Back Button */}
            <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
                <Icon name="arrow-left" size={24} color="#d4af37" />
            </TouchableOpacity>

            {/* Page Title */}
            <Text style={styles.title}>T R A N S A C T I O N</Text>
            <View style={styles.titleLine} />

            {/* Transaction Details */}
            <View style={styles.detailsContainer}>
                <Text style={styles.transactionMonth}>{transaction.month} 2024</Text>
                <Text style={styles.transactionAmount}>RM{transaction.amount}.00</Text>
                <Text style={styles.transactionDate}>Paid {transaction.date}</Text>

                {/* Fees Breakdown */}
                <View style={styles.feesContainer}>
                    <Text style={styles.feeText}>Water</Text>
                    <Text style={styles.feeAmount}>RM50.00</Text>
                </View>

                <View style={styles.feesContainer}>
                    <Text style={styles.feeText}>Maintenance Fee</Text>
                    <Text style={styles.feeAmount}>RM100</Text>
                </View>

                <View style={styles.feesContainer}>
                    <Text style={styles.feeText}>Facilities Fee</Text>
                    <Text style={styles.feeAmount}>RM100</Text>
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
    },
    detailsContainer: {
        marginTop: 40,
        paddingHorizontal: 35,
    },
    transactionMonth: {
        fontSize: 47,
        color: "#fff",
        fontFamily: "TimesNewRoman",
        textAlign: "left",
        marginTop: 70,
    },
    transactionAmount: {
        fontSize: 47,
        color: "#d4af37",
        fontFamily: "TimesNewRoman",
        marginTop: 8,
        textAlign: "left",
    },
    transactionDate: {
        fontSize: 20,
        color: "#fff",
        fontFamily: "TimesNewRoman",
        marginTop: 10,
        textAlign: "left",
        marginBottom: 20,
    },
    feesContainer: {
        flexDirection: "row",
        alignItems: "center",
        marginTop: 40,
    },
    feeText: {
        fontSize: 22,
        color: "#fff",
        fontFamily: "TimesNewRoman",
        flex: 1,  // ✅ Makes sure all fee names take equal space
        textAlign: "left",  // ✅ Aligns text to left
    },
    feeAmount: {
        fontSize: 24,
        color: "#d4af37",
        fontFamily: "TimesNewRoman",
        width: 100,  // ✅ Ensures all amounts align correctly
        textAlign: "left",  // ✅ Aligns amounts in the same column
        marginRight: 30,
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

export default TransactionDetailsPage;
