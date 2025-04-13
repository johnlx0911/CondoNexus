import React, { useState, useEffect } from "react";
import * as Font from 'expo-font';
import { Image, StyleSheet, Text, TextInput, TouchableOpacity, View, Alert, Modal } from "react-native";
import { createStackNavigator, StackNavigationProp } from "@react-navigation/stack";
import { LinearGradient } from "expo-linear-gradient";
import { Checkbox } from "react-native-paper";
import Icon from "react-native-vector-icons/Feather";
import axios from "axios";
import AsyncStorage from "@react-native-async-storage/async-storage";

// Import other pages
// User
import SignUpPage from "../../screens/User/SignUpPage";
import HomePage from "../../screens/User/HomePage";
import ProfilePage from "../../screens/User/ProfilePage";
import AccessPage from "../../screens/User/AccessPage";
import MemberPage from "../../screens/User/MemberPage";
import EditMemberPage from "../../screens/User/EditMemberPage";
import PaymentPage from "../../screens/User/PaymentPage";
import TransactionPage from "../../screens/User/TransactionPage";
import TransactionDetailsPage from "../../screens/User/TransactionDetailsPage";
import CheckOutPage from "../../screens/User/CheckOutPage";
import FacilityPage from "../../screens/User/FacilityPage";
import BookingPage from "../../screens/User/BookingPage";
import NotificationPage from "../../screens/User/NotificationPage";
import MessagePage from "../../screens/User/MessagePage";
import ContactPage from "../../screens/User/ContactPage";
// User

// Admin
import DashboardPage from "../../screens/Admin/DashboardPage";
import MaintenancePage from "../../screens/Admin/MaintenancePage";
import ResidentPage from "../../screens/Admin/ResidentPage";
import ResidentMessagePage from "../../screens/Admin/ResidentMessagePage";
import AnnouncementPage from "../../screens/Admin/AnnouncementPage";
import ReplyPage from "../../screens/Admin/ReplyPage";
// Admin

// Define navigation types
export type RootStackParamList = {
  // User
  Login: undefined;
  Signup: undefined;
  Home: undefined;
  Profile: undefined;
  Access: undefined;
  Member: undefined;
  EditMember: { member: { name: string; email: string; mobile: string } };
  Payment: undefined;
  Transaction: undefined;
  TransactionDetails: { transaction: { month: string; amount: number; date_paid: string } };
  CheckOut: undefined;
  Facility: undefined;
  Booking: { facility: string };
  Notification: undefined;
  Message: { message: { sender: string; title: string; body: string; time: string } };
  Contact: undefined;
  // User

  // Admin
  Dashboard: undefined;
  Maintenance: undefined;
  ResidentMessage: undefined;
  Resident: { residentId: string };
  Announcement: undefined;
  Reply: {
    messageId: number;         // ✅ Added `messageId` here
    recipientEmail: String;
    subject: String;
    originalMessage: String;
  }
  // Admin
};

// Create stack navigator
const Stack = createStackNavigator<RootStackParamList>();

// Login Screen
import { KeyboardAvoidingView, Platform, ScrollView, TouchableWithoutFeedback, Keyboard } from "react-native";

function LoginScreen({ navigation }: { navigation: StackNavigationProp<RootStackParamList, "Login"> }) {
  const [checked, setChecked] = useState(false);
  const [passwordVisible, setPasswordVisible] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [isModalVisible, setIsModalVisible] = useState(false);
  const [forgotEmail, setForgotEmail] = useState("");

  const [fontsLoaded, setFontsLoaded] = useState(false);

  useEffect(() => {
    Font.loadAsync({
      'TimesNewRoman': require('../../assets/fonts/TimesNewRoman.ttf'),
    }).then(() => {
      setFontsLoaded(true);

      // ✅ GLOBAL DEFAULT FONT OVERRIDE FOR <Text>
      const TextAny = Text as any;
      const oldTextRender = TextAny.render;
      TextAny.render = function (...args: any[]) {
        const origin = oldTextRender.call(this, ...args);
        if (!origin) return null;
        return React.cloneElement(origin, {
          style: [{ fontFamily: 'TimesNewRoman' }, origin.props.style],
        });
      };

      // ✅ GLOBAL DEFAULT FONT FOR <TextInput>
      const TextInputAny = TextInput as any;
      const oldInputRender = TextInputAny.render;
      TextInputAny.render = function (...args: any[]) {
        const origin = oldInputRender.call(this, ...args);
        if (!origin) return null;
        return React.cloneElement(origin, {
          style: [{ fontFamily: 'TimesNewRoman' }, origin.props.style],
        });
      };
    });
  }, []);

  // ✅ Handle Forgot Password using SendGrid
  const handleForgotPassword = async () => {
    if (!forgotEmail) {
      Alert.alert("Error", "Please enter your email");
      return;
    }

    try {
      console.log("📡 Sending forgot password request to backend...");
      const response = await axios.post("http://192.168.0.109:5000/api/forgot-password", { email: forgotEmail });

      console.log("✅ Response received:", response.data);
      Alert.alert("Success", response.data.message);
      setIsModalVisible(false); // Close the modal after sending
    } catch (error: any) {
      console.error("❌ Forgot Password Error:", error.response?.data || error.message);
      Alert.alert("Error", error.response?.data?.message || "Failed to send reset email");
    }
  };

  // ✅ Auto-login check
  useEffect(() => {
    const checkLoginStatus = async () => {
      try {
        const token = await AsyncStorage.getItem("userToken");

        if (token === "adminToken") {
          console.log("🔄 Admin token found! Redirecting to Dashboard.");
          navigation.replace("Dashboard"); // ✅ Redirect to Admin Dashboard
        } else if (token) {
          console.log("🔄 Token found! Redirecting to Home.");
          navigation.replace("Home"); // ✅ Redirect to Home for normal users
        } else {
          console.log("🔄 No token found, staying on Login Page.");
        }
      } catch (error) {
        console.error("Error checking login status:", error);
      }
    };
    checkLoginStatus();
  }, []);

  // ✅ Load Remember Me details
  useEffect(() => {
    const loadRememberMe = async () => {
      const savedEmail = await AsyncStorage.getItem("rememberedEmail");
      if (savedEmail) {
        setEmail(savedEmail);
        setChecked(true);
      }
    };
    loadRememberMe();
  }, []);

  // ✅ Handle Login
  const handleLogin = async () => {
    // Admin accounts check
    const adminAccounts = [
      { email: 'leexing0911@gmail.com', password: 'John@2003' },
      { email: 'varsya1234@gmail.com', password: 'Varsya@1234' }
    ];

    // Check if the entered email is one of the admin accounts
    const adminAccount = adminAccounts.find(
      (admin) => admin.email === email && admin.password === password
    );

    if (adminAccount) {
      await AsyncStorage.setItem("userToken", "adminToken"); // ✅ Admin session
      await AsyncStorage.setItem("adminEmail", email);        // ✅ Correctly store Admin Email
      navigation.replace("Dashboard");  // ✅ Redirect to Dashboard
      return;  // Prevent further logic from running
    }

    if (!email || !password) {
      Alert.alert("Error", "Please enter both email and password.");
      return;
    }

    try {
      const response = await axios.post("http://192.168.0.109:5000/login", { email, password });

      if (response.data.token) {
        await AsyncStorage.setItem("userToken", response.data.token);
        await AsyncStorage.setItem("userEmail", email);     // ✅ Correctly store User Email

        if (response.data.id) {
          await AsyncStorage.setItem("userId", response.data.id.toString());  // ✅ Save userId
        } else {
          console.warn("⚠️ No 'id' in login response.");
        }

        if (response.data.name) {
          await AsyncStorage.setItem("userName", response.data.name); // ✅ Store user's name
          console.log("✅ User Name Stored:", response.data.name);
        } else {
          console.warn("⚠️ No 'name' found in response. Check server-side logic.");
        }

        if (checked) {
          await AsyncStorage.setItem("rememberedEmail", email);  // ✅ Store email if Remember Me is checked
        } else {
          await AsyncStorage.removeItem("rememberedEmail");      // ✅ Remove if unchecked
        }

        console.log(`✅ User Login Successful: ${email}`);
        navigation.replace("Home");
      } else {
        Alert.alert("Login Failed", response.data.message);
      }
    } catch (error) {
      console.error("Login error:", error);
      Alert.alert("Login Error", "Invalid email or password.");
    }
  };

  // ✅ Handle Logout (to be called from HomePage)
  const handleLogout = async () => {
    await AsyncStorage.removeItem("userToken");
    navigation.replace("Login");
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      style={{ flex: 1 }}
    >
      <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
        <ScrollView contentContainerStyle={{ flexGrow: 1 }}>
          <LinearGradient colors={["#1a120b", "#b88b4a"]} style={styles.container}>

            {/* Logo */}
            <View style={styles.logoContainer}>
              <Image source={require("../../assets/Logo.png")} style={styles.logo} />
            </View>

            {/* Input Fields */}
            <View style={styles.inputContainer}>
              <Text style={styles.label}>Email</Text>
              <TextInput
                style={styles.input}
                placeholder="Enter your email"
                placeholderTextColor="#ffffff99"
                value={email}
                onChangeText={setEmail}
                keyboardType="email-address"
                autoCapitalize="none"
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
            </View>

            {/* Remember Me & Forgot Password */}
            <View style={styles.row}>
              <TouchableOpacity onPress={() => setChecked(!checked)} activeOpacity={0.8}>
                <Checkbox.Android
                  status={checked ? "checked" : "unchecked"}
                  onPress={() => setChecked(!checked)}
                  color="#d4af37"
                  uncheckedColor="#fff"
                />
              </TouchableOpacity>
              <Text style={styles.rememberText}>Remember Me</Text>

              {/* ✅ Forgot Password Button */}
              <TouchableOpacity onPress={() => setIsModalVisible(true)}>
                <Text style={styles.forgotPassword}>Forgot Password?</Text>
              </TouchableOpacity>

              {/* Forgot Password Modal */}
              <Modal
                transparent
                visible={isModalVisible}
                animationType="slide"
                onRequestClose={() => setIsModalVisible(false)}
              >
                <View style={styles.modalContainer}>
                  <View style={styles.modalContent}>
                    <Text style={styles.modalTitle}>Reset Password</Text>
                    <Text style={styles.modalText}>Enter your email to reset your password.</Text>

                    <TextInput
                      style={styles.modalInput}
                      placeholder="Email"
                      value={forgotEmail}
                      onChangeText={setForgotEmail}
                      keyboardType="email-address"
                      autoCapitalize="none"
                    />

                    <View style={styles.buttonContainer}>
                      <TouchableOpacity style={styles.modalButton} onPress={handleForgotPassword}>
                        <Text style={styles.buttonText}>Send Reset Link</Text>
                      </TouchableOpacity>

                      <TouchableOpacity
                        style={[styles.modalButton, styles.cancelButton]}
                        onPress={() => setIsModalVisible(false)}
                      >
                        <Text style={styles.buttonText}>Cancel</Text>
                      </TouchableOpacity>
                    </View>
                  </View>
                </View>
              </Modal>

            </View>

            {/* Login Button */}
            <TouchableOpacity style={styles.loginButton} onPress={handleLogin}>
              <LinearGradient colors={["#fff", "#d4af37"]} style={styles.loginGradient}>
                <Text style={styles.loginText}>L O G  I N</Text>
              </LinearGradient>
            </TouchableOpacity>

            {/* Sign Up */}
            <TouchableOpacity onPress={() => navigation.navigate("Signup")}>
              <Text style={styles.signupText}>
                Don't have an account? <Text style={styles.signupBold}>Sign up</Text>
              </Text>
            </TouchableOpacity>

          </LinearGradient>
        </ScrollView>
      </TouchableWithoutFeedback>
    </KeyboardAvoidingView>
  );
}

// App Navigator
export default function AppNavigator() {
  return (
    <Stack.Navigator initialRouteName="Login">
      {/* User */}
      <Stack.Screen name="Login" component={LoginScreen} options={{ headerShown: false }} />
      <Stack.Screen name="Signup" component={SignUpPage} options={{ headerShown: false }} />
      <Stack.Screen name="Home" component={HomePage} options={{ headerShown: false }} />
      <Stack.Screen name="Profile" component={ProfilePage} options={{ headerShown: false }} />
      <Stack.Screen name="Access" component={AccessPage} options={{ headerShown: false }} />
      <Stack.Screen name="Member" component={MemberPage} options={{ headerShown: false }} />
      <Stack.Screen name="EditMember" component={EditMemberPage} options={{ headerShown: false }} />
      <Stack.Screen name="Payment" component={PaymentPage} options={{ headerShown: false }} />
      <Stack.Screen name="Transaction" component={TransactionPage} options={{ headerShown: false }} />
      <Stack.Screen name="TransactionDetails" component={TransactionDetailsPage} options={{ headerShown: false }} />
      <Stack.Screen name="CheckOut" component={CheckOutPage} options={{ headerShown: false }} />
      <Stack.Screen name="Facility" component={FacilityPage} options={{ headerShown: false }} />
      <Stack.Screen name="Booking" component={BookingPage} options={{ headerShown: false }} />
      <Stack.Screen name="Notification" component={NotificationPage} options={{ headerShown: false }} />
      <Stack.Screen name="Message" component={MessagePage} options={{ headerShown: false }} />
      <Stack.Screen name="Contact" component={ContactPage} options={{ headerShown: false }} />
      {/* User */}

      {/* Admin */}
      <Stack.Screen name="Dashboard" component={DashboardPage} options={{ headerShown: false }} />
      <Stack.Screen name="Maintenance" component={MaintenancePage} options={{ headerShown: false }} />
      <Stack.Screen name="ResidentMessage" component={ResidentMessagePage} options={{ headerShown: false }} />
      <Stack.Screen name="Resident" component={ResidentPage} options={{ headerShown: false }} />
      <Stack.Screen name="Announcement" component={AnnouncementPage} options={{ headerShown: false }} />
      <Stack.Screen name="Reply" component={ReplyPage} options={{ headerShown: false }} />
      {/* Admin */}
    </Stack.Navigator>
  );
}

// Styles
const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "flex-start",
    paddingHorizontal: 30,
    paddingTop: 60,
  },
  checkboxWrapper: {
    width: 24,
    height: 24,
    borderWidth: 2,
    borderColor: "#fff", // White border so it's visible
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 4,
  },
  checkboxChecked: {
    backgroundColor: "#d4af37", // Background turns gold when checked
    borderColor: "#d4af37", // Change border color to match
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
    fontSize: 28,
    color: "#d4af37",
    marginTop: 10,
  },
  inputContainer: {
    marginBottom: 20,
    marginTop: -40,
  },
  label: {
    color: "#fff",
    fontSize: 16,
    marginBottom: 5,
    marginTop: 10,
    fontFamily: "TimesNewRoman",
  },
  input: {
    flex: 1,
    backgroundColor: "transparent",
    borderBottomWidth: 1,
    borderBottomColor: "#fff",
    paddingVertical: 15,
    fontSize: 18,
    color: "#fff",
    fontFamily: "TimesNewRoman",
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
    width: "100%",
    fontFamily: "TimesNewRoman",
  },
  eyeIcon: {
    position: "absolute",
    right: 5,
    padding: 5,
  },
  row: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginTop: 10,
  },
  rememberText: {
    color: "#fff",
    fontSize: 16,
    marginLeft: 8,
    fontFamily: "TimesNewRoman",
  },
  forgotPassword: {
    color: "#d4af37",
    fontSize: 16,
    marginLeft: "auto",
    fontFamily: "TimesNewRoman",
  },
  forgotPasswordContainer: {
    flex: 1,
    alignItems: "flex-end",
  },
  loginButton: {
    marginTop: 20,
    alignSelf: "center",
  },
  loginGradient: {
    width: 180,
    paddingVertical: 12,
    borderRadius: 25,
    alignItems: "center",
  },
  loginText: {
    color: "#000",
    fontSize: 22,
    fontFamily: "TimesNewRoman",
  },
  signupText: {
    color: "#fff",
    fontSize: 16,
    textAlign: "center",
    marginTop: 20,
    fontFamily: "TimesNewRoman",
  },
  signupBold: {
    color: "#d4af37",
    fontFamily: "TimesNewRoman",
  },

  // ✅ Modal Styles
  modalContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0,0,0,0.5)",
  },
  modalContent: {
    backgroundColor: "#fff",
    padding: 20,
    width: "80%",
    borderRadius: 10,
    alignItems: "center",
  },
  modalTitle: {
    fontSize: 22,
    marginBottom: 10,
  },
  modalText: {
    fontSize: 16,
    marginBottom: 10,
    textAlign: "center",
  },
  modalInput: {
    backgroundColor: "#f0f0f0",
    padding: 10,
    borderRadius: 5,
    width: "100%",
    marginBottom: 15,
  },
  buttonContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    width: "100%",
  },
  modalButton: {
    backgroundColor: "#d4af37",
    padding: 10,
    borderRadius: 5,
    width: "48%",
    alignItems: "center",
  },
  cancelButton: {
    backgroundColor: "#888",
  },
  buttonText: {
    color: "#fff",
    fontSize: 16,
  },

});