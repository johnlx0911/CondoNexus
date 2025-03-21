import React, { useState, useEffect } from "react";
import { View, Text, TouchableOpacity, StyleSheet, Modal } from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { useNavigation } from "@react-navigation/native";
import { StackNavigationProp } from "@react-navigation/stack";
import { RootStackParamList } from "../../App"; // Import the navigation types
import Icon from "react-native-vector-icons/Feather";
import { useStripe } from '@stripe/stripe-react-native';
import axios from 'axios';

const CheckOutPage = () => {
    const navigation = useNavigation<StackNavigationProp<RootStackParamList>>();
    const { confirmPayment } = useStripe();

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

    const handlePayment = async () => {
        try {
            const response = await axios.post('http://localhost:5000/create-payment-intent', {
                amount: 23452, // Amount in cents (RM234.52)
                currency: 'myr',
            });

            const { clientSecret } = response.data;
            const { error, paymentIntent } = await confirmPayment(clientSecret, {
                paymentMethodType: "Card",
            });

            if (error) {
                alert(`Payment failed: ${error.message}`);
            } else if (paymentIntent) {
                alert(`Payment successful! ID: ${paymentIntent.id}`);
            }
        } catch (error) {
            alert("Failed to initiate payment. Please try again.");
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
                <View style={styles.modalBackground}>
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
                </View>
            </Modal>

            {/* Confirm Payment */}
            <TouchableOpacity style={styles.confirmButton} onPress={handlePayment}>
                <LinearGradient colors={["#e6c78e", "#b88b4a"]} style={styles.confirmGradient}>
                    <Text style={styles.confirmText}>P A Y  N O W</Text>
                </LinearGradient>
            </TouchableOpacity>

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
        fontSize: 24,
        fontWeight: "bold",
        color: "#d4af37",
        textAlign: "center",
        fontFamily: "Times New Roman",
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
        fontSize: 45,
        fontWeight: "bold",
        color: "#fff",
        fontFamily: "Times New Roman",
        textAlign: "left",
        marginTop: 60,
        marginBottom: 5,
    },
    dueDate: {
        fontSize: 18,
        color: "#fff",
        fontFamily: "Times New Roman",
        textAlign: "left",
        marginTop: 5,
    },
    warning: {
        fontSize: 16,
        color: "#d4af37",
        fontFamily: "Times New Roman",
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
        fontFamily: "Times New Roman",
        flex: 1,
        textAlign: "left",
    },
    feeAmount: {
        fontSize: 22,
        color: "#d4af37",
        fontWeight: "bold",
        fontFamily: "Times New Roman",
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
        fontSize: 18,
        fontWeight: "bold",
        color: "#000",
        fontFamily: "Times New Roman",
    },
    paymentType: {
        fontSize: 16,
        fontFamily: "Times New Roman",
        color: "#000",
        marginTop: 5,
    },
    confirmButton: {
        width: "85%",
        alignSelf: "center",
        marginTop: 15,
    },
    confirmGradient: {
        paddingVertical: 15,
        borderRadius: 25,
        alignItems: "center",
        elevation: 5,
        width: "100%",
    },
    confirmText: {
        fontSize: 18,
        fontWeight: "bold",
        color: "#000",
        fontFamily: "Times New Roman",
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
        fontSize: 16,
        fontFamily: "Times New Roman",
        fontWeight: "bold",
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
        fontSize: 22,
        fontFamily: "Times New Roman",
        fontWeight: "bold",
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
        fontFamily: "Times New Roman",
        textAlign: "center"
    },
    modalCloseButton: {
        marginTop: 15,
        paddingVertical: 10,
        backgroundColor: "#b88b4a",
        borderRadius: 10
    },
    modalCloseText: {
        fontSize: 18,
        fontFamily: "Times New Roman",
        textAlign: "center",
        color: "#fff"
    },
});

export default CheckOutPage;
