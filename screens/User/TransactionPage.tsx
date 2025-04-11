import React, { useEffect, useState } from "react";
import { View, Text, TouchableOpacity, StyleSheet, ScrollView } from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { useNavigation } from "@react-navigation/native";
import { StackNavigationProp } from "@react-navigation/stack";
import { RootStackParamList } from "../../App"; // Import the navigation types
import Icon from "react-native-vector-icons/Feather";
import axios from "axios";
import AsyncStorage from "@react-native-async-storage/async-storage";

type Transaction = {
    month: string;
    amount: number;
    date_paid: string;
};

const TransactionPage = () => {
    const navigation = useNavigation<StackNavigationProp<RootStackParamList>>();
    const [transactions, setTransactions] = useState<Transaction[]>([]);

    useEffect(() => {
        const fetchTransactions = async () => {
            try {
                const userId = await AsyncStorage.getItem("userId");
                const response = await axios.get(`http://192.168.0.109:5000/api/transactions/getTransactions/${userId}`);
                setTransactions(response.data);
            } catch (error) {
                console.error("Error fetching transactions:", error);
            }
        };

        fetchTransactions();
    }, []);

    return (
        <LinearGradient colors={["#1a120b", "#b88b4a"]} style={styles.container}>
            {/* Back Button */}
            <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
                <Icon name="arrow-left" size={24} color="#d4af37" />
            </TouchableOpacity>

            {/* Page Title */}
            <Text style={styles.title}>T R A N S A C T I O N</Text>
            <View style={styles.titleLine} />

            {/* Transaction List */}
            <ScrollView style={styles.transactionList} contentContainerStyle={styles.scrollContent}>
                {transactions.map((item, index) => (
                    <View key={index}>
                        <TouchableOpacity
                            style={styles.transactionItem}
                            onPress={() => navigation.navigate("TransactionDetails", { transaction: item })}
                        >
                            <View style={styles.transactionTextContainer}>
                                <Text style={styles.transactionMonth}>2024 {item.month}</Text>
                                <View style={styles.amountRow}>
                                    <Text style={styles.transactionAmount}>RM{item.amount}</Text>
                                    <Text style={styles.transactionDate}>Paid {item.date_paid}</Text>
                                </View>
                            </View>
                            <Icon name="chevron-right" size={22} color="#d4af37" />
                        </TouchableOpacity>

                        {/* Separator Line */}
                        {index < transactions.length - 1 && <View style={styles.separator} />}
                    </View>
                ))}
            </ScrollView>

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
        width: "85%",
        height: 1,
        backgroundColor: "#d4af37",
        alignSelf: "center",
        marginTop: 1,
        borderRadius: 2,
    },
    transactionList: {
        flex: 1,
        marginTop: 20,
        marginBottom: 130, // ✅ Prevents transactions from going behind the navigation bar
    },
    scrollContent: {
        paddingBottom: 150, // ✅ Increased padding to ensure last item is visible above the navigation bar
        flexGrow: 1, // ✅ Ensures the ScrollView takes full height
    },
    transactionItem: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        paddingVertical: 15,
        paddingHorizontal: 20,
        backgroundColor: "transparent", // ✅ Transparent background
        borderRadius: 10,
        marginBottom: 10,
        width: "90%",
        alignSelf: "center",
    },
    separator: {
        width: "85%", // ✅ Makes it match the text width
        height: 1,
        backgroundColor: "#d4af37",
        alignSelf: "center",
    },
    transactionTextContainer: {
        flex: 1, // Allows text to take up max width
    },
    transactionMonth: {
        fontSize: 27,
        color: "#fff",
        fontFamily: "TimesNewRoman",
    },
    amountRow: {
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "flex-start", // ✅ Ensures correct positioning
        marginTop: 5,
    },
    transactionAmount: {
        fontSize: 20,
        color: "#d4af37",
        fontFamily: "TimesNewRoman",
    },
    transactionDate: {
        fontSize: 16,
        color: "#fff",
        marginLeft: 10, // ✅ Moves it slightly right of amount
        fontFamily: "TimesNewRoman",
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

export default TransactionPage;
