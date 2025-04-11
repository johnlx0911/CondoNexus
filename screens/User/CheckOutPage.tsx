import React, { useState, useEffect } from "react";
import { View, Text, TouchableOpacity, StyleSheet, Modal, Image } from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { useNavigation } from "@react-navigation/native";
import { StackNavigationProp } from "@react-navigation/stack";
import { RootStackParamList } from "../../App"; // Import the navigation types
import Icon from "react-native-vector-icons/Feather";
import axios from 'axios';
import AsyncStorage from "@react-native-async-storage/async-storage";

const QRImage = require("../../assets/images/qr.jpg");

const CheckOutPage = () => {
    const navigation = useNavigation<StackNavigationProp<RootStackParamList>>();

    const [dueDate, setDueDate] = useState<string>("");
    const [daysRemaining, setDaysRemaining] = useState<number>(0);
    const [selectedPaymentMethod, setSelectedPaymentMethod] = useState<string>("");
    const [isModalVisible, setIsModalVisible] = useState<boolean>(false);

    useEffect(() => {
        const today = new Date();
        let nextMonth = today.getMonth() + 1;
        let nextYear = today.getFullYear();

        if (nextMonth > 11) {
            nextMonth = 0;
            nextYear += 1;
        }

        const nextDueDate = new Date(nextYear, nextMonth, 1);
        const diffTime = nextDueDate.getTime() - today.getTime();
        const daysLeft = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

        const formattedDueDate = nextDueDate.toLocaleDateString("en-GB", {
            day: "numeric",
            month: "short",
            year: "numeric",
        });

        setDueDate(formattedDueDate);
        setDaysRemaining(daysLeft);
    }, []);

    // Handle Payment Method Selection
    const handlePaymentMethodSelect = (method: string) => {
        setSelectedPaymentMethod(method);
        setIsModalVisible(false); // Close modal after selection
    };

    const handleTngPayment = async () => {
        const userId = await AsyncStorage.getItem("userId"); // 👈 if you're storing userId
        const today = new Date();
        const payload = {
            user_id: parseInt(userId ?? "0"),
            month: "April",
            amount: 234.52,
            date_paid: today.toISOString().split("T")[0], // format: YYYY-MM-DD
            payment_method: "TnG",
        };

        try {
            await axios.post("http://192.168.0.109:5000/api/transactions/addTransaction", payload);
            setSelectedPaymentMethod("");
            navigation.navigate("Transaction");
        } catch (error) {
            console.error("Payment failed", error);
        }
    };

    return (
        <LinearGradient colors={["#1a120b", "#b88b4a"]} style={styles.container}>
            {/* Back Button */}
            <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
                <Icon name="arrow-left" size={24} color="#d4af37" />
            </TouchableOpacity>

            {/* Page Title */}
            <Text style={styles.title}>P A Y M E N T</Text>
            <View style={styles.titleLine} />

            {/* Payment Details */}
            <View style={styles.detailsContainer}>
                <Text style={styles.amount}>RM234.52</Text>
                <Text style={styles.dueDate}>Due date: {dueDate}</Text>
                <Text style={styles.warning}>
                    <Icon name="bell" size={16} color="#d4af37" /> {daysRemaining} Days to due date
                </Text>

                {/* Fees Breakdown */}
                <View style={styles.feeContainer}>
                    <Text style={styles.feeText}>Water</Text>
                    <Text style={styles.feeAmount}>RM34.52</Text>
                </View>
                <View style={styles.feeContainer}>
                    <Text style={styles.feeText}>Maintenance Fee</Text>
                    <Text style={styles.feeAmount}>RM100</Text>
                </View>
                <View style={styles.feeContainer}>
                    <Text style={styles.feeText}>Facilities Fee</Text>
                    <Text style={styles.feeAmount}>RM100</Text>
                </View>
            </View>

            {/* Payment Method Button */}
            <TouchableOpacity
                style={styles.paymentMethodButton}
                onPress={() => setIsModalVisible(true)}
            >
                <LinearGradient colors={["#e6c78e", "#b88b4a"]} style={styles.paymentGradient}>
                    <Text style={styles.paymentMethodText}>💲 P A Y M E N T  M E T H O D</Text>
                    <Text style={styles.paymentType}>
                        {selectedPaymentMethod || "Select a method"}
                    </Text>
                </LinearGradient>
            </TouchableOpacity>

            {/* Payment Modal */}
            <Modal
                transparent={true}
                animationType="slide"
                visible={isModalVisible}
                onRequestClose={() => setIsModalVisible(false)}
            >
                <TouchableOpacity
                    style={styles.modalBackground}
                    activeOpacity={1}
                    onPressOut={() => setSelectedPaymentMethod("")}
                >
                    <View style={styles.modalContainer}>
                        <Text style={styles.modalTitle}>Select Payment Method</Text>
                        <TouchableOpacity onPress={() => handlePaymentMethodSelect("Card")} style={styles.modalOption}>
                            <Text style={styles.modalOptionText}>💳 Card</Text>
                        </TouchableOpacity>
                        <TouchableOpacity onPress={() => handlePaymentMethodSelect("Online Banking")} style={styles.modalOption}>
                            <Text style={styles.modalOptionText}>🏦 Online Banking</Text>
                        </TouchableOpacity>
                        <TouchableOpacity onPress={() => handlePaymentMethodSelect("TnG")} style={styles.modalOption}>
                            <Text style={styles.modalOptionText}>📱 TnG eWallet</Text>
                        </TouchableOpacity>

                        {/* Close Button */}
                        <TouchableOpacity
                            onPress={() => setIsModalVisible(false)}
                            style={styles.modalCloseButton}
                        >
                            <Text style={styles.modalCloseText}>Cancel</Text>
                        </TouchableOpacity>
                    </View>
                </TouchableOpacity>
            </Modal>

            {/* TnG Payment QR Modal */}
            {selectedPaymentMethod === "TnG" && (
                <Modal
                    transparent={true}
                    animationType="slide"
                    visible={true}
                    onRequestClose={() => setSelectedPaymentMethod("")}
                >
                    <View style={styles.modalBackground}>
                        <View style={styles.qrModalContainer}>
                            <Text style={styles.modalTitle}>Pay with Touch 'n Go</Text>
                            <Text style={styles.receiverText}>Receiver: JOHN LEE XING</Text>
                            <Text style={styles.amountText}>Amount: RM234.52</Text>
                            <Image source={QRImage} style={styles.qrImage} />

                            <TouchableOpacity
                                style={styles.modalCloseButton}
                                onPress={handleTngPayment} // <-- ✅ use the actual function to send to DB
                            >
                                <Text style={styles.modalCloseText}>I've Paid</Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                </Modal>
            )}

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
        paddingHorizontal: 35,
    },
    amount: {
        fontSize: 47,
        color: "#fff",
        fontFamily: "TimesNewRoman",
        textAlign: "left",
        marginTop: 60,
        marginBottom: 5,
    },
    dueDate: {
        fontSize: 18,
        color: "#fff",
        fontFamily: "TimesNewRoman",
        textAlign: "left",
        marginTop: 5,
    },
    warning: {
        fontSize: 16,
        color: "#d4af37",
        fontFamily: "TimesNewRoman",
        textAlign: "left",
        marginTop: 5,
        marginBottom: 20,
    },
    feeContainer: {
        flexDirection: "row",
        alignItems: "center",
        marginTop: 40,
    },
    feeText: {
        fontSize: 22,
        color: "#fff",
        fontFamily: "TimesNewRoman",
        flex: 1,
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
    paymentMethodButton: {
        width: "85%",
        alignSelf: "center",
        marginTop: 70,
    },
    paymentGradient: {
        paddingVertical: 15,
        borderRadius: 25,
        alignItems: "center",
        elevation: 5,
        width: "100%",
    },
    paymentMethodText: {
        fontSize: 20,
        color: "#000",
        fontFamily: "TimesNewRoman",
    },
    paymentType: {
        fontSize: 16,
        fontFamily: "TimesNewRoman",
        color: "#000",
        marginTop: 5,
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
    },
    navButton: {
        alignItems: "center",
    },
    navText: {
        color: "#000",
        fontSize: 18,
        fontFamily: "TimesNewRoman",
    },

    // Modal Styles
    modalBackground: {
        flex: 1,
        backgroundColor: "rgba(0, 0, 0, 0.6)",
        justifyContent: "center",
        alignItems: "center"
    },
    modalContainer: {
        width: "80%",
        backgroundColor: "#fff",
        padding: 20,
        borderRadius: 20
    },
    modalTitle: {
        fontSize: 24,
        fontFamily: "TimesNewRoman",
        textAlign: "center",
        marginBottom: 20
    },
    modalOption: {
        paddingVertical: 12,
        borderBottomWidth: 1,
        borderBottomColor: "#ddd"
    },
    modalOptionText: {
        fontSize: 20,
        fontFamily: "TimesNewRoman",
        textAlign: "center"
    },
    modalCloseButton: {
        marginTop: 15,
        paddingVertical: 10,
        paddingHorizontal: 10,
        backgroundColor: "#b88b4a",
        borderRadius: 10
    },
    modalCloseText: {
        fontSize: 18,
        fontFamily: "TimesNewRoman",
        textAlign: "center",
        color: "#fff"
    },
    qrModalContainer: {
        width: "85%",
        backgroundColor: "#fff",
        padding: 20,
        borderRadius: 20,
        alignItems: "center",
    },
    qrImage: {
        width: 220,
        height: 220,
        marginVertical: 20,
        borderRadius: 10,
    },
    receiverText: {
        fontSize: 18,
        fontFamily: "TimesNewRoman",
        color: "#000",
        marginBottom: 10,
    },
    amountText: {
        fontSize: 22,
        fontFamily: "TimesNewRoman",
        color: "#b88b4a",
        marginBottom: 5,
    },
});

export default CheckOutPage;
