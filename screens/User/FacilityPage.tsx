import React, { useState } from "react";
import { View, Text, TextInput, TouchableOpacity, StyleSheet, ScrollView, Dimensions } from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { useNavigation } from "@react-navigation/native";
import { StackNavigationProp } from "@react-navigation/stack";
import { RootStackParamList } from "../../App"; // Import the navigation types
import Icon from "react-native-vector-icons/Feather";

const { height } = Dimensions.get("window"); // Get device height dynamically

const facilities = [
    { id: 1, name: "BBQ", icon: "zap", description: "Located at rooftop, perfect for family grilling." },
    { id: 2, name: "Sauna", icon: "sun", description: "Next to the gym, open for relaxation and healthy." },
    { id: 3, name: "Ping Pong", icon: "disc", description: "Basement floor, great for friendly matches." },
    { id: 4, name: "Gym", icon: "activity", description: "Beside lobby, includes cardio and weights." },
    { id: 5, name: "Swimming", icon: "droplet", description: "Infinity pool on Level 3, Please wear swim suit." },
    { id: 6, name: "Movie", icon: "film", description: "Private screening room, prepare your own bites and head to Level 2." },
    { id: 7, name: "Basketball", icon: "circle", description: "Outdoor court, open for all ages, located at open area." },
    { id: 8, name: "Badminton", icon: "wind", description: "Indoor court, reserve at least 1 day ahead." },
    { id: 9, name: "Tennis", icon: "target", description: "Available all day, including evening with lighting." },
    { id: 10, name: "Library", icon: "book", description: "Quiet reading room, please lower your voice, Level 5." },
    { id: 11, name: "Cafe", icon: "coffee", description: "Ground floor, great drinks and light bites." },
    { id: 12, name: "Co-Working", icon: "briefcase", description: "Work pods and fast Wi-Fi, Level 4." },
    { id: 13, name: "Karaoke", icon: "music", description: "Sing your heart out, enjoy the music, basement level." },
];

const FacilityPage = () => {
    const navigation = useNavigation<StackNavigationProp<RootStackParamList>>();
    const [search, setSearch] = useState("");

    // Filter facilities based on search input
    const filteredFacilities = facilities.filter(facility =>
        facility.name.toLowerCase().includes(search.toLowerCase())
    );

    return (
        <LinearGradient colors={["#1a120b", "#b88b4a"]} style={styles.container}>
            {/* Back Button */}
            <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
                <Icon name="arrow-left" size={24} color="#d4af37" />
            </TouchableOpacity>

            {/* Page Title */}
            <Text style={styles.title}>F A C I L I T Y</Text>
            <View style={styles.titleLine} />

            {/* Search Bar with Gradient */}
            <LinearGradient colors={["#e6c78e", "#b88b4a"]} style={styles.searchContainer}>
                <Icon name="search" size={18} color="#000" style={styles.searchIcon} />
                <TextInput
                    style={styles.searchInput}
                    placeholder="Search"
                    placeholderTextColor="#000"
                    value={search}
                    onChangeText={setSearch}
                />
            </LinearGradient>

            {/* Facility Grid List */}
            <ScrollView
                contentContainerStyle={styles.gridContainer}
                style={{ maxHeight: height * 0.58 }} // 🔥 Limits scroll range (Adjustable)
                showsVerticalScrollIndicator={false}
            >
                {filteredFacilities.map((facility, index) => (
                    <TouchableOpacity
                        key={index}
                        onPress={() => navigation.navigate("Booking", { facility })}
                        style={styles.facilityWrapper}
                    >
                        <LinearGradient colors={["#e6c78e", "#b88b4a"]} style={styles.facilityCard}>
                            <Icon name={facility.icon} size={40} color="#000" />
                            <Text style={styles.facilityText}>{facility.name}</Text>
                        </LinearGradient>
                    </TouchableOpacity>
                ))}
                {/* 🛠 Added extra spacing at the bottom to prevent cut-off */}
                <View style={{ height: 90 }} />
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
        alignItems: "center",
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
    searchContainer: {
        flexDirection: "row",
        alignItems: "center",
        borderRadius: 25,
        paddingHorizontal: 15,
        paddingVertical: 15,
        marginBottom: 30,
        marginTop: 30,
        width: "85%",
        alignSelf: "center",
        elevation: 5,
    },
    searchIcon: {
        marginRight: 10,
    },
    searchInput: {
        flex: 1,
        fontSize: 18,
        fontFamily: "TimesNewRoman",
        color: "#000",
    },
    gridContainer: {
        flexDirection: "row",
        flexWrap: "wrap",
        justifyContent: "center",
        paddingHorizontal: 20,
        width: "100%",
        marginBottom: 120, // ✅ Adjusted for bottom navigation space
    },
    facilityWrapper: {
        width: "33%", // Ensures three items per row
        alignItems: "center",
    },
    facilityCard: {
        width: 100,
        height: 120,
        borderRadius: 15,
        alignItems: "center",
        justifyContent: "center",
        marginBottom: 15,
        elevation: 5,
    },
    facilityText: {
        fontSize: 18,
        fontFamily: "TimesNewRoman",
        color: "#000",
        marginTop: 5,
        textAlign: "center",
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

export default FacilityPage;