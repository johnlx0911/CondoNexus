import React, { useState } from "react";
import { Image, StyleSheet, Text, TextInput, TouchableOpacity, View, KeyboardAvoidingView, Platform, ScrollView, TouchableWithoutFeedback, Keyboard } from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { createStackNavigator, StackNavigationProp } from "@react-navigation/stack";
import Icon from "react-native-vector-icons/Feather";
import { useNavigation } from "@react-navigation/native";
import { RootStackParamList } from "../../App"; // Import the navigation types

const SignUpPage = () => {
    const navigation = useNavigation<StackNavigationProp<RootStackParamList>>();

    // States for user input
    const [mobile, setMobile] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [address, setAddress] = useState("");
    const [unitNumber, setUnitNumber] = useState("");
    const [passwordVisible, setPasswordVisible] = useState(false);
    const [confirmPasswordVisible, setConfirmPasswordVisible] = useState(false);

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
                        <TouchableOpacity style={styles.signUpButton}>
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
        flex: 1,
    },
    scrollContainer: {
        flexGrow: 1,
        justifyContent: "flex-start",
        paddingHorizontal: 30,
        paddingTop: 60,
        paddingBottom: 100,
    },
    container: {
        flex: 1,
    },
    logoContainer: {
        alignItems: "center",
        marginBottom: 20,
    },
    logo: {
        width: 360,
        height: 360,
        resizeMode: "contain",
    },
    title: {
        fontSize: 26,
        color: "#d4af37",
        fontWeight: "bold",
        marginTop: 10,
        fontFamily: Platform.OS === "ios" ? "Times New Roman" : "TimesNewRoman-Regular",
    },
    inputContainer: {
        marginTop: -40,
        marginBottom: 30,
    },
    label: {
        color: "#fff",
        fontSize: 16,
        marginBottom: 5,
        marginTop: 10,
        fontFamily: Platform.OS === "ios" ? "Times New Roman" : "TimesNewRoman-Regular",
    },
    input: {
        backgroundColor: "transparent",
        borderBottomWidth: 1,
        borderBottomColor: "#fff",
        paddingVertical: 15,
        fontSize: 18,
        color: "#fff",
        fontFamily: Platform.OS === "ios" ? "Times New Roman" : "TimesNewRoman-Regular",
    },
    passwordContainer: {
        flexDirection: "row",
        alignItems: "center",
        borderBottomWidth: 1,
        borderBottomColor: "#fff",
        width: "100%",
        paddingVertical: 5,
    },
    passwordInput: {
        flex: 1,
        backgroundColor: "transparent",
        fontSize: 18,
        color: "#fff",
        fontFamily: Platform.OS === "ios" ? "Times New Roman" : "TimesNewRoman-Regular",
    },
    eyeIcon: {
        position: "absolute",
        right: 5,
        padding: 5,
    },
    signUpButton: {
        marginTop: 20,
        alignSelf: "center",
    },
    signUpGradient: {
        width: 180,
        paddingVertical: 12,
        borderRadius: 25,
        alignItems: "center",
    },
    signUpText: {
        color: "#000",
        fontSize: 20,
        fontWeight: "bold",
        fontFamily: "Times New Roman",
    },
    loginText: {
        color: "#fff",
        fontSize: 16,
        textAlign: "center",
        marginTop: 20,
        fontFamily: "Times New Roman",
    },
    loginBold: {
        fontWeight: "bold",
        fontStyle: "italic",
        color: "#d4af37",
        fontFamily: "Times New Roman",
    },
});

export default SignUpPage;