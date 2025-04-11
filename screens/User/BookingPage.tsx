import React, { useState, useEffect } from "react";
import { View, Text, TouchableOpacity, StyleSheet, Platform, Alert, ScrollView, Dimensions } from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { useNavigation, useRoute } from "@react-navigation/native";
import { StackNavigationProp } from "@react-navigation/stack";
import { RootStackParamList } from "../../App";
import Icon from "react-native-vector-icons/Feather";
import DateTimePicker from "@react-native-community/datetimepicker";
import axios from 'axios';
import type { FacilityType } from '../../types/types';
import AsyncStorage from "@react-native-async-storage/async-storage";

const { height } = Dimensions.get("window"); // Get device height dynamically

const BookingPage = () => {
    const navigation = useNavigation<StackNavigationProp<RootStackParamList>>();
    const route = useRoute();
    const { facility } = route.params as { facility: FacilityType };

    const [hasBooking, setHasBooking] = useState(false);
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

    const [userId, setUserId] = useState<number | null>(null);
    const [bookedSlots, setBookedSlots] = useState<{ [key: string]: number }>({});
    const [fullyBookedRanges, setFullyBookedRanges] = useState<{ start: string; end: string }[]>([]);

    const MAX_PAX = 10;

    const isSlotFull = (time: Date) => {
        const checkTime = time.toTimeString().slice(0, 5); // "18:00"
        for (let range of fullyBookedRanges) {
            if (checkTime >= range.start && checkTime < range.end) {
                return true;
            }
        }
        return false;
    };

    const fetchSlotCounts = async () => {
        try {
            const response = await axios.get('http://192.168.0.109:5000/api/bookings/booking-count', {
                params: {
                    facility_id: facility.id,
                    booking_date: bookingDate.toISOString().split('T')[0],
                },
            });

            const slotMap: { [key: string]: number } = {};
            const fullRanges: { start: string; end: string }[] = [];

            response.data.forEach((entry: any) => {
                const start = entry.start_time; // already "HH:mm"
                const end = entry.end_time;     // already "HH:mm"

                if (start) {
                    slotMap[start] = entry.total_pax;
                }

                if (start && end && entry.total_pax >= MAX_PAX) {
                    fullRanges.push({ start, end });
                }
            });

            setBookedSlots(slotMap);
            setFullyBookedRanges(fullRanges);
        } catch (error) {
            console.error("Failed to fetch slot counts:", error);
        }
    };

    const formatTime = (date: Date | null) => {
        return date ? date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }) : "";
    };

    const formatTimeForBackend = (date: Date | null) =>
        date ? date.toTimeString().slice(0, 5) : null;  // 👈 Only HH:mm

    const normalizeTime = (date: Date) => {
        const normalized = new Date(date);
        normalized.setSeconds(0);
        normalized.setMilliseconds(0);
        return normalized;
    };

    const isToday = (date: Date) => {
        const now = new Date();
        return (
            date.getDate() === now.getDate() &&
            date.getMonth() === now.getMonth() &&
            date.getFullYear() === now.getFullYear()
        );
    };

    const validateTimeRange = (newStartTime: Date | null, newEndTime: Date | null) => {
        if (!newStartTime || !newEndTime) return true;

        const normalizedStart = normalizeTime(newStartTime);
        const normalizedEnd = normalizeTime(newEndTime);

        const minEndTime = new Date(normalizedStart);
        minEndTime.setHours(minEndTime.getHours() + 1);

        const maxEndTime = new Date(normalizedStart);
        maxEndTime.setHours(maxEndTime.getHours() + 4);

        return normalizedEnd >= minEndTime && normalizedEnd <= maxEndTime;
    };

    const checkBookingStatus = async () => {
        if (!userId) return Alert.alert("Error", "User ID not found.");

        try {
            const response = await axios.get(`http://192.168.0.109:5000/api/bookings/check-booking-status`, {
                params: {
                    user_id: userId, // Replace with dynamic user ID
                    facility_id: facility.id,
                    booking_date: bookingDate.toISOString().split('T')[0],
                }
            });

            setHasBooking(response.data.exists);
        } catch (error) {
            console.error("Error checking booking status:", error);
            Alert.alert("Error", "Failed to check booking status.");
        }
    };

    useEffect(() => {
        if (userId !== null) {
            checkBookingStatus();
        }
    }, [userId, facility.id, bookingDate]);

    useEffect(() => {
        console.log("🔍 Facility Data:", facility);

        if (!facility || !facility.id) {
            Alert.alert("Error", "Facility data is missing. Please go back and select a facility.");
            navigation.goBack();
        }
    }, []);

    useEffect(() => {
        const fetchUserId = async () => {
            const id = await AsyncStorage.getItem("userId");
            setUserId(id ? parseInt(id) : null);
        };
        fetchUserId();
    }, []);

    useEffect(() => {
        if (userId) fetchSlotCounts();
    }, [bookingDate, facility.id, userId]);

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
                style={{ maxHeight: height * 0.55 }} // 🔥 Limits scroll range (Adjustable)
                showsVerticalScrollIndicator={false}
            >
                {/* Facility Icon */}
                <View style={styles.facilityWrapper}>
                    <LinearGradient colors={["#e6c78e", "#b88b4a"]} style={styles.facilityContainer}>
                        <Icon name="calendar" size={50} color="#000" />
                    </LinearGradient>
                    <Text style={styles.facilityName}>{facility.name}</Text>
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
                                minimumDate={isToday(bookingDate) ? new Date() : undefined} // ⛔️ Disable past times today
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
                                    } else if (tempStartTime && isSlotFull(tempStartTime)) {
                                        Alert.alert("Fully Booked", "This time slot is fully booked. Please choose another one.");
                                        return;
                                    }
                                    else {
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
                                minimumDate={isToday(bookingDate) ? new Date() : undefined}
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
                                    } else if (tempEndTime && isSlotFull(tempEndTime)) {
                                        Alert.alert("Fully Booked", "This time slot is fully booked. Please choose another one.");
                                        return;
                                    }
                                    else {
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
                            <Text style={styles.paxText}>-</Text>
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

            {/* Buttons Container */}
            <View style={styles.buttonsContainer}>
                {/* CONFIRM BOOKING Button */}
                <TouchableOpacity
                    style={styles.buttonWrapper}
                    onPress={async () => {
                        if (!userId) return Alert.alert("Error", "User ID not found.");
                        if (!startTime || !endTime) return Alert.alert("Missing Time", "Please select both start and end times.");

                        const newStart = formatTimeForBackend(startTime) || "";
                        const newEnd = formatTimeForBackend(endTime) || "";

                        // ⛔️ Check for overlap with fully booked time ranges
                        const isOverlap = fullyBookedRanges.some((range) => {
                            return newStart < range.end && newEnd > range.start;
                        });

                        if (isOverlap) {
                            Alert.alert("Time Conflict", "Your selected time overlaps with a fully booked slot.");
                            return;
                        }

                        try {
                            const response = await axios.post('http://192.168.0.109:5000/api/bookings/confirm-booking', {
                                user_id: userId,
                                facility_id: facility.id,
                                booking_date: bookingDate.toISOString().split('T')[0],
                                start_time: newStart,  // Convert to "HH:mm:ss"
                                end_time: newEnd,
                                num_pax: numPax,
                            }, { timeout: 10000 });

                            Alert.alert("Success", response.data.message);
                            setHasBooking(true);
                        } catch (error: any) {
                            console.error("Error confirming booking:", error);

                            const message =
                                error.response?.data?.message || "Failed to confirm booking. Please try again later.";

                            Alert.alert("Booking Failed", message);
                        }
                    }}
                >
                    <LinearGradient colors={["#e6c78e", "#b88b4a"]} style={styles.confirmBookButton}>
                        <Text style={styles.buttonText}>C O N F I R M</Text>
                    </LinearGradient>
                </TouchableOpacity>

                {/* CANCEL BOOKING Button */}
                <TouchableOpacity
                    style={styles.buttonWrapper}
                    onPress={async () => {
                        if (!userId) return Alert.alert("Error", "User ID not found.");

                        try {
                            const response = await axios.post('http://192.168.0.109:5000/api/bookings/cancel-booking', {
                                user_id: userId,
                                facility_id: facility.id,
                                booking_date: bookingDate.toISOString().split('T')[0],
                            });

                            Alert.alert("Success", response.data.message);
                            setHasBooking(false);  // ✅ Mark booking status as false
                        } catch (error) {
                            console.error("Error canceling booking:", error);
                            Alert.alert("Error", "Failed to cancel booking.");
                        }
                    }}
                >
                    <LinearGradient colors={["#e6c78e", "#b88b4a"]} style={styles.cancelButton}>
                        <Text style={styles.buttonText}>C A N C E L</Text>
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
        fontSize: 22,
        color: "#000",
        fontFamily: "TimesNewRoman",
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
        fontSize: 26,
        color: "#fff",
        marginTop: 10,
        fontFamily: "TimesNewRoman",
    },
    detailsContainer: {
        marginTop: 20,
        width: "85%",
    },
    label: {
        fontSize: 20,
        color: "#d4af37",
        marginBottom: 5,
        fontFamily: "TimesNewRoman",
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
        fontFamily: "TimesNewRoman",
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
        fontFamily: "TimesNewRoman",
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
    confirmBookButton: {
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
    cancelButton: {
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

export default BookingPage;
