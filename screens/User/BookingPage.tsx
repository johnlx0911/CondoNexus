import React, { useState } from "react";
import { View, Text, TouchableOpacity, StyleSheet, Platform, Alert, ScrollView, Dimensions } from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { useNavigation, useRoute } from "@react-navigation/native";
import { StackNavigationProp } from "@react-navigation/stack";
import { RootStackParamList } from "../../App";
import Icon from "react-native-vector-icons/Feather";
import DateTimePicker from "@react-native-community/datetimepicker";

const { height } = Dimensions.get("window"); // Get device height dynamically

const BookingPage = () => {
    const navigation = useNavigation<StackNavigationProp<RootStackParamList>>();
    const route = useRoute();
    const { facility } = route.params as { facility: string };

    const [bookingDate, setBookingDate] = useState(new Date());
    const [startTime, setStartTime] = useState<Date | null>(null);
    const [endTime, setEndTime] = useState<Date | null>(null);
    const [numPax, setNumPax] = useState(1);
    const [showDatePicker, setShowDatePicker] = useState(false);
    const [showStartPicker, setShowStartPicker] = useState(false);
    const [showEndPicker, setShowEndPicker] = useState(false);
    const [tempDate, setTempDate] = useState(bookingDate);
    const [tempStartTime, setTempStartTime] = useState<Date | null>(null);
    const [tempEndTime, setTempEndTime] = useState<Date | null>(null);

    const formatTime = (date: Date | null) => {
        return date ? date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }) : "";
    };

    const validateTimeRange = (newStartTime: Date | null, newEndTime: Date | null) => {
        if (!newStartTime || !newEndTime) return true;

        const minEndTime = new Date(newStartTime);
        minEndTime.setHours(minEndTime.getHours() + 1); // Min 1 hour booking

        const maxEndTime = new Date(newStartTime);
        maxEndTime.setHours(maxEndTime.getHours() + 4); // Max 4 hours booking

        return newEndTime >= minEndTime && newEndTime <= maxEndTime;
    };

    return (
        <LinearGradient colors={["#1a120b", "#b88b4a"]} style={styles.container}>
            {/* Back Button */}
            <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
                <Icon name="arrow-left" size={24} color="#d4af37" />
            </TouchableOpacity>

            {/* Page Title */}
            <Text style={styles.title}>F A C I L I T Y</Text>
            <View style={styles.titleLine} />

            <ScrollView
                contentContainerStyle={styles.gridContainer}
                style={{ maxHeight: height * 0.71 }} // 🔥 Limits scroll range (Adjustable)
                showsVerticalScrollIndicator={false}
            >
                {/* Facility Icon */}
                <View style={styles.facilityWrapper}>
                    <LinearGradient colors={["#e6c78e", "#b88b4a"]} style={styles.facilityContainer}>
                        <Icon name="calendar" size={50} color="#000" />
                    </LinearGradient>
                    <Text style={styles.facilityName}>{facility}</Text>
                </View>

                {/* Booking Details */}
                <View style={styles.detailsContainer}>
                    {/* Booking Date */}
                    <Text style={styles.label}>Booking Date</Text>
                    <TouchableOpacity style={styles.inputField} onPress={() => setShowDatePicker(true)}>
                        <Text style={styles.inputText}>{bookingDate.toDateString()}</Text>
                    </TouchableOpacity>
                    {showDatePicker && (
                        <View style={styles.pickerContainer}>
                            <DateTimePicker
                                value={tempDate}
                                mode="date"
                                display="spinner"
                                minimumDate={new Date()} // Prevent past dates
                                onChange={(event, selectedDate) => {
                                    if (selectedDate) setTempDate(selectedDate);
                                }}
                            />
                            <TouchableOpacity
                                onPress={() => {
                                    setBookingDate(tempDate);
                                    setShowDatePicker(false);
                                }}
                            >
                                <LinearGradient colors={["#e6c78e", "#b88b4a"]} style={styles.confirmButton}>
                                    <Text style={styles.confirmButtonText}>Confirm</Text>
                                </LinearGradient>
                            </TouchableOpacity>
                        </View>
                    )}

                    {/* Time Duration */}
                    <Text style={styles.label}>Time Duration</Text>
                    <View style={styles.timeContainer}>
                        <TouchableOpacity
                            style={[styles.inputField, styles.timeField]}
                            onPress={() => setShowStartPicker(true)}
                        >
                            <Text style={styles.inputText}>
                                {startTime ? formatTime(startTime) : "Start Time"}
                            </Text>
                        </TouchableOpacity>
                        <TouchableOpacity
                            style={[styles.inputField, styles.timeField]}
                            onPress={() => setShowEndPicker(true)}
                        >
                            <Text style={styles.inputText}>
                                {endTime ? formatTime(endTime) : "End Time"}
                            </Text>
                        </TouchableOpacity>
                    </View>

                    {showStartPicker && (
                        <View style={styles.pickerContainer}>
                            <DateTimePicker
                                value={tempStartTime || new Date()}
                                mode="time"
                                display="spinner"
                                onChange={(event, selectedTime) => {
                                    if (selectedTime) setTempStartTime(selectedTime);
                                }}
                            />
                            <TouchableOpacity
                                onPress={() => {
                                    if (tempStartTime && endTime && !validateTimeRange(tempStartTime, endTime)) {
                                        Alert.alert(
                                            "Invalid Start Time",
                                            "The start time must be at least 1 hour before and at most 4 hours before the end time."
                                        );
                                    } else {
                                        setStartTime(tempStartTime);
                                        setShowStartPicker(false);
                                    }
                                }}
                            >
                                <LinearGradient colors={["#e6c78e", "#b88b4a"]} style={styles.confirmButton}>
                                    <Text style={styles.confirmButtonText}>Confirm</Text>
                                </LinearGradient>
                            </TouchableOpacity>
                        </View>
                    )}

                    {showEndPicker && (
                        <View style={styles.pickerContainer}>
                            <DateTimePicker
                                value={tempEndTime || new Date()}
                                mode="time"
                                display="spinner"
                                onChange={(event, selectedTime) => {
                                    if (selectedTime) setTempEndTime(selectedTime);
                                }}
                            />
                            <TouchableOpacity
                                onPress={() => {
                                    if (tempEndTime && startTime && !validateTimeRange(startTime, tempEndTime)) {
                                        Alert.alert(
                                            "Invalid End Time",
                                            "The end time must be at least 1 hour after and at most 4 hours after the start time."
                                        );
                                    } else {
                                        setEndTime(tempEndTime);
                                        setShowEndPicker(false);
                                    }
                                }}
                            >
                                <LinearGradient colors={["#e6c78e", "#b88b4a"]} style={styles.confirmButton}>
                                    <Text style={styles.confirmButtonText}>Confirm</Text>
                                </LinearGradient>
                            </TouchableOpacity>
                        </View>
                    )}

                    {/* Num of Pax */}
                    <Text style={styles.label}>Num of Pax</Text>
                    <View style={styles.paxContainer}>
                        <TouchableOpacity
                            style={styles.paxButton}
                            onPress={() => setNumPax((prev) => Math.max(1, prev - 1))}
                        >
                            <Text style={styles.paxText}>−</Text>
                        </TouchableOpacity>
                        <Text style={styles.paxText}>{numPax}</Text>
                        <TouchableOpacity
                            style={styles.paxButton}
                            onPress={() => setNumPax((prev) => prev + 1)}
                        >
                            <Text style={styles.paxText}>+</Text>
                        </TouchableOpacity>
                    </View>
                </View>
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
        </LinearGradient >
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        paddingTop: 50,
        width: "100%",
    },
    gridContainer: {
        alignItems: "center",
        flexDirection: "row",
        flexWrap: "wrap",
        justifyContent: "center",
        paddingHorizontal: 20,
        width: "100%",
        marginBottom: 120, // ✅ Adjusted for bottom navigation space
    },
    pickerContainer: {
        alignItems: "center",
        backgroundColor: "rgba(255,255,255,0.1)",
        paddingVertical: 10,
        borderRadius: 10,
        marginTop: 10,
        marginBottom: 10,
    },
    confirmButton: {
        marginTop: 10,
        paddingVertical: 12,
        paddingHorizontal: 30,
        borderRadius: 10,
        alignItems: "center",
    },
    confirmButtonText: {
        fontSize: 20,
        fontWeight: "bold",
        color: "#000",
        fontFamily: "Times New Roman",
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
        borderRadius: 2,
    },
    facilityWrapper: {
        alignItems: "center",
        marginTop: 70,
    },
    facilityContainer: {
        width: 90,
        height: 90,
        borderRadius: 20,
        alignItems: "center",
        justifyContent: "center",
    },
    facilityName: {
        fontSize: 24,
        fontWeight: "bold",
        color: "#fff",
        marginTop: 10,
        fontFamily: "Times New Roman",
    },
    detailsContainer: {
        marginTop: 20,
        width: "85%",
    },
    label: {
        fontSize: 18,
        fontWeight: "bold",
        color: "#d4af37",
        marginBottom: 5,
        fontFamily: "Times New Roman",
    },
    inputField: {
        backgroundColor: "rgba(255,255,255,0.1)",
        paddingVertical: 12,
        paddingHorizontal: 15,
        borderRadius: 10,
        marginBottom: 15,
        width: "100%",
    },
    inputText: {
        fontSize: 18,
        color: "#fff",
        fontFamily: "Times New Roman",
    },
    timeContainer: {
        flexDirection: "row",
        justifyContent: "space-between",
    },
    timeField: {
        width: "48%",
    },
    paxContainer: {
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "center",
        marginTop: 10,
    },
    paxButton: {
        padding: 10,
    },
    paxText: {
        fontSize: 18,
        color: "#fff",
        marginHorizontal: 10,
        fontFamily: "Times New Roman",
    },
    bookNowButton: {
        width: "85%",
        alignSelf: "center",
        marginTop: 30,
    },
    bookNowGradient: {
        paddingVertical: 15,
        borderRadius: 15,
        alignItems: "center",
        elevation: 5,
        width: "100%",
    },
    bookNowText: {
        fontSize: 20,
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
});

export default BookingPage;
