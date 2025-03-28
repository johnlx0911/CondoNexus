/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 */

// User
import React, { useEffect } from "react";
// import NfcManager from "react-native-nfc-manager";
import { View } from "react-native";
import { NavigationContainer } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";
import SignUpPage from "./screens/User/SignUpPage";
import HomePage from "./screens/User/HomePage";
import ProfilePage from "./screens/User/ProfilePage";
import AccessPage from "./screens/User/AccessPage";
import MemberPage from "./screens/User/MemberPage";
import EditMemberPage from "./screens/User/EditMemberPage";
import PaymentPage from "./screens/User/PaymentPage";
import TransactionPage from "./screens/User/TransactionPage";
import TransactionDetailsPage from "./screens/User/TransactionDetailsPage";
import CheckOutPage from "./screens/User/CheckOutPage";
import FacilityPage from "./screens/User/FacilityPage";
import BookingPage from "./screens/User/BookingPage";
import NotificationPage from "./screens/User/NotificationPage";
import MessagePage from "./screens/User/MessagePage";
import ContactPage from "./screens/User/ContactPage";

import type { FacilityType } from './types/types';
// User

import { StripeProvider } from '@stripe/stripe-react-native';
import Constants from 'expo-constants';
// Correct key extraction to handle undefined/null values
const STRIPE_PUBLISHABLE_KEY = Constants.expoConfig?.extra?.STRIPE_PUBLISHABLE_KEY;

// Admin
import DashboardPage from "./screens/Admin/DashboardPage";
import FacilityManagementPage from "./screens/Admin/FacilityManagementPage";
import FacilityStatusPage from "./screens/Admin/FacilityStatusPage";
import MaintenancePage from "./screens/Admin/MaintenancePage";
import ResidentPage from "./screens/Admin/ResidentPage";
import ResidentMessagePage from "./screens/Admin/ResidentMessagePage";
import AnnouncementPage from "./screens/Admin/AnnouncementPage";
import ReplyPage from "./screens/Admin/ReplyPage";
// Admin

import type { PropsWithChildren } from 'react';
import {
    SafeAreaView,
    ScrollView,
    StatusBar,
    StyleSheet,
    Text,
    useColorScheme,
} from 'react-native';

import {
    Colors,
    DebugInstructions,
    Header,
    LearnMoreLinks,
    ReloadInstructions,
} from 'react-native/Libraries/NewAppScreen';

type SectionProps = PropsWithChildren<{
    title: string;
}>;

// Define the stack parameters
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
    TransactionDetails: { transaction: { month: string; amount: number; date: string } };
    CheckOut: undefined;
    Facility: undefined;
    Booking: { facility: FacilityType };
    Notification: undefined;
    Message: { message: { sender: string; title: string; body: string; time: string } };
    Contact: undefined;
    // User

    // Admin
    Dashboard: undefined;
    FacilityManagement: undefined;
    FacilityStatus: undefined;
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

function Section({ children, title }: SectionProps): React.JSX.Element {
    const isDarkMode = useColorScheme() === 'dark';
    return (
        <View style={styles.sectionContainer}>
            <Text
                style={[
                    styles.sectionTitle,
                    {
                        color: isDarkMode ? Colors.white : Colors.black,
                    },
                ]}>
                {title}
            </Text>
            <Text
                style={[
                    styles.sectionDescription,
                    {
                        color: isDarkMode ? Colors.light : Colors.dark,
                    },
                ]}>
                {children}
            </Text>
        </View>
    );
}

// Create the stack with types
const Stack = createStackNavigator<RootStackParamList>();

function App(): React.JSX.Element {
    const isDarkMode = useColorScheme() === 'dark';

    const backgroundStyle = {
        backgroundColor: isDarkMode ? Colors.darker : Colors.lighter,
    };

    useEffect(() => {
        // Initialize NFC when app starts
        // NfcManager.start().catch((error) => console.warn("NFC Init Error:", error));

        return () => {
            // Proper cleanup when app closes
            // NfcManager.cancelTechnologyRequest().catch(() => { });
            // NfcManager.unregisterTagEvent().catch(() => { });
        };
    }, []);

    return (
        <StripeProvider
            publishableKey={Constants.expoConfig?.extra?.STRIPE_PUBLISHABLE_KEY || ""}
        >
            <NavigationContainer>
                <Stack.Navigator initialRouteName="Login">
                    {/* User */}
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
                    <Stack.Screen name="FacilityManagement" component={FacilityManagementPage} options={{ headerShown: false }} />
                    <Stack.Screen name="FacilityStatus" component={FacilityStatusPage} options={{ headerShown: false }} />
                    <Stack.Screen name="Maintenance" component={MaintenancePage} options={{ headerShown: false }} />
                    <Stack.Screen name="ResidentMessage" component={ResidentMessagePage} options={{ headerShown: false }} />
                    <Stack.Screen name="Resident" component={ResidentPage} options={{ headerShown: false }} />
                    <Stack.Screen name="Announcement" component={AnnouncementPage} options={{ headerShown: false }} />
                    <Stack.Screen name="Reply" component={ReplyPage} options={{ headerShown: false }} />
                    {/* Admin */}
                </Stack.Navigator>
            </NavigationContainer>
        </StripeProvider>
    );
}

const styles = StyleSheet.create({
    sectionContainer: {
        marginTop: 32,
        paddingHorizontal: 24,
    },
    sectionTitle: {
        fontSize: 24,
        fontWeight: '600',
    },
    sectionDescription: {
        marginTop: 8,
        fontSize: 18,
        fontWeight: '400',
    },
    highlight: {
        fontWeight: '700',
    },
});

export default App;
