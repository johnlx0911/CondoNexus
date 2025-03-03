import React from "react";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { useNavigation, useRoute } from "@react-navigation/native";
import { StackNavigationProp } from "@react-navigation/stack";
import { RootStackParamList } from "../../App"; // Import the navigation types
import Icon from "react-native-vector-icons/Feather";

const BookingPage = () => {
    const navigation = useNavigation<StackNavigationProp<RootStackParamList>>();
    const route = useRoute();
    const { facility } = route.params as { facility: string };

    return (
        <LinearGradient colors={["#1a120b", "#b88b4a"]} style={styles.container}>
            {/* Back Button */}
            <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
                <Icon name="arrow-left" size={24} color="#d4af37" />
            </TouchableOpacity>

            {/* Page Title */}
            <Text style={styles.title}>FACILITY</Text>

            {/* Facility Icon */}
            <View style={styles.facilityContainer}>
                <Icon name="calendar" size={50} color="#000" />
                <Text style={styles.facilityName}>{facility}</Text>
            </View>

            {/* Booking Details */}
            <View style={styles.detailsContainer}>
                <Text style={styles.label}>Booking Date</Text>
                <TouchableOpacity style={styles.inputField}>
                    <Text>29 Dec 2024 (Sun)</Text>
                </TouchableOpacity>

                <Text style={styles.label}>Time Duration</Text>
                <View style={styles.timeContainer}>
                    <TouchableOpacity style={styles.inputField}>
                        <Text>Start Time</Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={styles.inputField}>
                        <Text>End Time</Text>
                    </TouchableOpacity>
                </View>

                <Text style={styles.label}>Num of Pax</Text>
                <TouchableOpacity style={styles.inputField}>
                    <Text>1</Text>
                </TouchableOpacity>
            </View>

            {/* Book Now Button */}
            <TouchableOpacity style={styles.bookNowButton}>
                <Text style={styles.bookNowText}>BOOK NOW</Text>
            </TouchableOpacity>
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
    facilityContainer: {
        alignItems: "center",
        marginTop: 30,
    },
    facilityName: {
        fontSize: 22,
        fontWeight: "bold",
        color: "#fff",
        marginTop: 10,
    },
    detailsContainer: {
        marginTop: 20,
    },
    label: {
        fontSize: 16,
        fontWeight: "bold",
        color: "#d4af37",
        marginBottom: 5,
    },
    inputField: {
        backgroundColor: "rgba(255,255,255,0.1)",
        paddingVertical: 10,
        paddingHorizontal: 15,
        borderRadius: 10,
        marginBottom: 15,
    },
    timeContainer: {
        flexDirection: "row",
        justifyContent: "space-between",
    },
    bookNowButton: {
        backgroundColor: "#d4af37",
        paddingVertical: 15,
        borderRadius: 10,
        alignItems: "center",
        marginTop: 20,
    },
    bookNowText: {
        fontSize: 18,
        fontWeight: "bold",
        color: "#000",
    },
});

export default BookingPage;
