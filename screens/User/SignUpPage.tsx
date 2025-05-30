import React, { useState } from "react";
import { Image, StyleSheet, Text, TextInput, TouchableOpacity, View, KeyboardAvoidingView, Platform, ScrollView, TouchableWithoutFeedback, Keyboard, Alert } from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import Icon from "react-native-vector-icons/Feather";
import { useNavigation } from "@react-navigation/native";
import { StackNavigationProp } from "@react-navigation/stack";
import { RootStackParamList } from "../../App"; // Import navigation types

const SignUpPage = () => {
    const navigation = useNavigation<StackNavigationProp<RootStackParamList>>();

    // States for user input
    const [name, setName] = useState("");
    const [mobile, setMobile] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [address, setAddress] = useState("");
    const [unitNumber, setUnitNumber] = useState("");
    const [passwordVisible, setPasswordVisible] = useState(false);
    const [confirmPasswordVisible, setConfirmPasswordVisible] = useState(false);

    // 📌 Function to handle user signup
    const handleSignUp = async () => {
        const API_URL = "http://192.168.0.109:5000/signup";

        if (!name || !mobile || !email || !password || !confirmPassword || !address || !unitNumber) {
            Alert.alert("Error", "Please fill in all fields.");
            return;
        }

        if (!mobile || !email || !password || !confirmPassword || !address || !unitNumber) {
            Alert.alert("Error", "Please fill in all fields.");
            return;
        }

        if (password !== confirmPassword) {
            Alert.alert("Error", "Passwords do not match.");
            return;
        }

        try {
            const response = await fetch(API_URL, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    name,
                    mobile,
                    email,
                    password,
                    address,
                    unit_number: unitNumber,
                }),
            });

            const contentType = response.headers.get("content-type");

            if (!response.ok) {
                const errorText = await response.text(); // Log the actual response
                console.error("❌ Server Error:", errorText);
                Alert.alert("Error", "Signup failed.");
                return;
            }

            if (contentType && contentType.includes("application/json")) {
                const data = await response.json();
                Alert.alert("Success", "Signup request submitted. Await admin approval", [
                    { text: "OK", onPress: () => navigation.navigate("Login") },
                ]);
            } else {
                const textResponse = await response.text();
                console.error("❌ Unexpected Response:", textResponse);
                Alert.alert("Error", "Unexpected response from the server.");
            }

        } catch (error) {
            console.error("❌ Signup error:", error);
            Alert.alert("Error", "Something went wrong. Please try again.");
        }
    };

    return (
        <LinearGradient colors={["#1a120b", "#b88b4a"]} style={styles.gradientContainer}>
            <KeyboardAvoidingView
                behavior={Platform.OS === "ios" ? "padding" : "height"}
                keyboardVerticalOffset={Platform.OS === "ios" ? 100 : 0}
                style={styles.container}
            >
                <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
                    <ScrollView
                        contentContainerStyle={styles.scrollContainer}
                        showsVerticalScrollIndicator={false}
                    >
                        {/* Logo */}
                        <View style={styles.logoContainer}>
                            <Image source={require("../../assets/Logo.png")} style={styles.logo} />
                        </View>

                        {/* Input Fields */}
                        <View style={styles.inputContainer}>
                            <Text style={styles.label}>Name</Text>
                            <TextInput
                                style={styles.input}
                                placeholder="Enter your full name"
                                placeholderTextColor="#ffffff99"
                                value={name}
                                onChangeText={setName}
                            />

                            <Text style={styles.label}>Mobile</Text>
                            <TextInput
                                style={styles.input}
                                placeholder="Enter your mobile number"
                                placeholderTextColor="#ffffff99"
                                value={mobile}
                                onChangeText={setMobile}
                                keyboardType="phone-pad"
                            />

                            <Text style={styles.label}>Email</Text>
                            <TextInput
                                style={styles.input}
                                placeholder="Enter your email"
                                placeholderTextColor="#ffffff99"
                                value={email}
                                onChangeText={setEmail}
                                keyboardType="email-address"
                            />

                            <Text style={styles.label}>Password</Text>
                            <View style={styles.passwordContainer}>
                                <TextInput
                                    style={styles.passwordInput}
                                    placeholder="Enter your password"
                                    placeholderTextColor="#ffffff99"
                                    secureTextEntry={!passwordVisible}
                                    value={password}
                                    onChangeText={setPassword}
                                />
                                <TouchableOpacity onPress={() => setPasswordVisible(!passwordVisible)} style={styles.eyeIcon}>
                                    <Icon name={passwordVisible ? "eye-off" : "eye"} size={20} color="#fff" />
                                </TouchableOpacity>
                            </View>

                            <Text style={styles.label}>Confirm Password</Text>
                            <View style={styles.passwordContainer}>
                                <TextInput
                                    style={styles.passwordInput}
                                    placeholder="Confirm your password"
                                    placeholderTextColor="#ffffff99"
                                    secureTextEntry={!confirmPasswordVisible}
                                    value={confirmPassword}
                                    onChangeText={setConfirmPassword}
                                />
                                <TouchableOpacity onPress={() => setConfirmPasswordVisible(!confirmPasswordVisible)} style={styles.eyeIcon}>
                                    <Icon name={confirmPasswordVisible ? "eye-off" : "eye"} size={20} color="#fff" />
                                </TouchableOpacity>
                            </View>

                            <Text style={styles.label}>Address</Text>
                            <TextInput
                                style={styles.input}
                                placeholder="Enter your address"
                                placeholderTextColor="#ffffff99"
                                value={address}
                                onChangeText={setAddress}
                            />

                            <Text style={styles.label}>Unit Number</Text>
                            <TextInput
                                style={styles.input}
                                placeholder="Enter your unit number"
                                placeholderTextColor="#ffffff99"
                                value={unitNumber}
                                onChangeText={setUnitNumber}
                                keyboardType="numeric"
                            />
                        </View>

                        {/* Sign Up Button */}
                        <TouchableOpacity style={styles.signUpButton} onPress={handleSignUp}>
                            <LinearGradient colors={["#fff", "#d4af37"]} style={styles.signUpGradient}>
                                <Text style={styles.signUpText}>R E G I S T E R</Text>
                            </LinearGradient>
                        </TouchableOpacity>

                        {/* Redirect to Login */}
                        <TouchableOpacity onPress={() => navigation.navigate("Login")}>
                            <Text style={styles.loginText}>
                                Have an account? <Text style={styles.loginBold}>Log In</Text>
                            </Text>
                        </TouchableOpacity>

                    </ScrollView>
                </TouchableWithoutFeedback>
            </KeyboardAvoidingView>
        </LinearGradient>
    );
};

const styles = StyleSheet.create({
    gradientContainer: {
        flex: 1
    },
    scrollContainer: {
        flexGrow: 1,
        justifyContent: "flex-start",
        paddingHorizontal: 30,
        paddingTop: 60,
        paddingBottom: 100
    },
    container: {
        flex: 1
    },
    logoContainer: {
        alignItems: "center",
        marginBottom: 20
    },
    logo: {
        width: 360,
        height: 360,
        resizeMode: "contain"
    },
    inputContainer: {
        marginTop: -40,
        marginBottom: 30
    },
    label: {
        color: "#fff",
        fontSize: 16,
        fontFamily: "TimesNewRoman",
        marginBottom: 5,
        marginTop: 10
    },
    input: {
        borderBottomWidth: 1,
        borderBottomColor: "#fff",
        paddingVertical: 15,
        fontSize: 18,
        fontFamily: "TimesNewRoman",
        color: "#fff"
    },
    passwordContainer: {
        flexDirection: "row",
        alignItems: "center",
        borderBottomWidth: 1,
        borderBottomColor: "#fff",
        width: "100%",
        paddingVertical: 5
    },
    passwordInput: {
        flex: 1,
        fontSize: 18,
        color: "#fff",
        fontFamily: "TimesNewRoman",
    },
    eyeIcon: {
        position: "absolute",
        right: 5,
        padding: 5
    },
    signUpButton: {
        marginTop: 20,
        alignSelf: "center"
    },
    signUpGradient: {
        width: 180,
        paddingVertical: 12,
        borderRadius: 25,
        alignItems: "center"
    },
    signUpText: {
        color: "#000",
        fontSize: 22,
        fontFamily: "TimesNewRoman",
    },
    loginText: {
        color: "#fff",
        fontSize: 16,
        fontFamily: "TimesNewRoman",
        textAlign: "center",
        marginTop: 20
    },
    loginBold: {
        color: "#d4af37"
    },
});

export default SignUpPage;