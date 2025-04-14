import React, { useState } from "react";
import { View, Text, ScrollView, TouchableOpacity, StyleSheet, Image, Alert, TextInput, Modal, TouchableWithoutFeedback } from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { useNavigation, useFocusEffect } from "@react-navigation/native";
import { StackNavigationProp } from "@react-navigation/stack";
import { RootStackParamList } from "../../App"; // Import the navigation types
import Icon from "react-native-vector-icons/Feather";
import AsyncStorage from "@react-native-async-storage/async-storage";

const MemberPage = () => {
    const navigation = useNavigation<StackNavigationProp<RootStackParamList>>();

    // Define members state
    const [members, setMembers] = useState<{ name: string; email: string; mobile: string }[]>([]);

    const [inviteModalVisible, setInviteModalVisible] = useState(false);
    const [inviteEmail, setInviteEmail] = useState("");

    const fetchMembers = async () => {
        try {
            const userEmail = await AsyncStorage.getItem("userEmail");
            if (!userEmail) return;

            const res = await fetch(`http://192.168.0.109:5000/api/get-members?email=${userEmail}`);
            const data = await res.json();

            if (Array.isArray(data)) {
                setMembers(data); // [{ name, email }]
            } else {
                Alert.alert("Error", "Failed to fetch members.");
            }
        } catch (err) {
            console.error("Error fetching members:", err);
            Alert.alert("Error", "Unable to load members.");
        }
    };

    useFocusEffect(
        React.useCallback(() => {
            fetchMembers();
        }, [])
    );

    return (
        <LinearGradient colors={["#1a120b", "#b88b4a"]} style={styles.container}>
            {/* Back Button */}
            <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
                <Icon name="arrow-left" size={24} color="#d4af37" />
            </TouchableOpacity>

            {/* Page Title */}
            <Text style={styles.title}>M E M B E R</Text>
            <View style={styles.titleLine} />

            {/* Member List */}
            <ScrollView style={styles.listContainer}>
                {members.map((member, index) => (
                    <TouchableOpacity
                        key={index}
                        style={styles.memberCard}
                        onPress={() => navigation.navigate("EditMember", { member })}
                    >
                        <View style={styles.memberContent}>
                            <Image source={require("../../assets/profile-icon.png")} style={styles.memberImage} />
                            <View>
                                <Text style={styles.memberName}>{member.name}</Text>
                                <Text style={styles.memberEmail}>{member.email}</Text>
                            </View>
                        </View>
                        <Icon name="chevron-right" size={20} color="#fff" />
                    </TouchableOpacity>
                ))}
            </ScrollView>

            <TouchableOpacity
                style={styles.buttonWrapper}
                onPress={() => setInviteModalVisible(true)}
            >
                <LinearGradient colors={["#e6c78e", "#b88b4a"]} style={styles.inviteButton}>
                    <Text style={styles.buttonText}>I N V I T E  M E M B E R</Text>
                </LinearGradient>
            </TouchableOpacity>

            <Modal
                transparent
                visible={inviteModalVisible}
                animationType="fade"
                onRequestClose={() => setInviteModalVisible(false)}
                statusBarTranslucent={true}
            >
                <View style={styles.modalContainer}>
                    {/* Background dismiss layer */}
                    <TouchableWithoutFeedback onPress={() => setInviteModalVisible(false)}>
                        <View style={styles.modalBackground} />
                    </TouchableWithoutFeedback>

                    {/* Modal content */}
                    <View style={styles.modalContentWrapper}>
                        <TouchableWithoutFeedback>
                            <View style={styles.modalContent}>
                                <Text style={styles.label}>Enter Member Email</Text>
                                <TextInput
                                    style={styles.inputField}
                                    placeholder="example@gmail.com"
                                    value={inviteEmail}
                                    onChangeText={setInviteEmail}
                                    placeholderTextColor="#999"
                                />
                                <TouchableOpacity
                                    onPress={async () => {
                                        const sender = await AsyncStorage.getItem("userEmail");
                                        if (!sender || !inviteEmail) return Alert.alert("Error", "Both emails required!");

                                        const messageData = {
                                            sender,
                                            recipient: inviteEmail,
                                            subject: "Membership Invitation",
                                            message: `${sender} has invited you to be a member.`,
                                            type: "user",
                                        };

                                        try {
                                            const res = await fetch("http://192.168.0.109:5000/api/send-message", {
                                                method: "POST",
                                                headers: { "Content-Type": "application/json" },
                                                body: JSON.stringify(messageData),
                                            });

                                            const result = await res.json();
                                            if (result.success) {
                                                Alert.alert("Success", "Invitation sent!");
                                                setInviteModalVisible(false);
                                                setInviteEmail("");
                                            } else {
                                                Alert.alert("Error", result.message);
                                            }
                                        } catch (err) {
                                            console.error(err);
                                            Alert.alert("Error", "Failed to send invitation.");
                                        }
                                    }}
                                >
                                    <LinearGradient colors={["#e6c78e", "#b88b4a"]} style={styles.confirmButton}>
                                        <Text style={styles.buttonText}>I N V I T E</Text>
                                    </LinearGradient>
                                </TouchableOpacity>
                            </View>
                        </TouchableWithoutFeedback>
                    </View>
                </View>
            </Modal>

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
        zIndex: 10, // ✅ Ensures it's above everything
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
        width: "85%", // ✅ Adjust width as needed
        height: 1, // ✅ Thickness of the line
        backgroundColor: "#d4af37", // ✅ Golden color like the text
        alignSelf: "center", // ✅ Centers the line
        marginTop: 1, // ✅ Spacing from title
        borderRadius: 2, // ✅ Smooth edges
        marginBottom: 20,
    },
    listContainer: {
        flex: 1,
        width: "86%",
    },
    memberCard: {
        flexDirection: "row",
        justifyContent: "space-between",
        paddingVertical: 12,
        paddingHorizontal: 15,
        alignItems: "center",
        backgroundColor: "rgba(255, 255, 255, 0.1)", // ✅ Matches NotificationPage style
        borderRadius: 15,
        width: "100%", // ✅ Reduced width to match title line
        marginBottom: 20,
    },
    memberContent: {
        flexDirection: "row",
        alignItems: "center",
    },
    memberImage: {
        width: 40,
        height: 40,
        borderRadius: 20,
        marginRight: 10,
    },
    memberName: {
        fontSize: 20,
        color: "#d4af37",
        fontFamily: "TimesNewRoman",
    },
    memberEmail: {
        fontSize: 16,
        color: "#fff",
        fontFamily: "TimesNewRoman",
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
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.3,
        shadowRadius: 5,
    },
    navButton: {
        alignItems: "center",
    },
    navText: {
        color: "#000",
        fontSize: 18,
        fontFamily: "TimesNewRoman",
    },
    buttonWrapper: {
        width: "85%", // ✅ Ensures the entire button is clickable
        alignSelf: "center",
    },
    buttonsContainer: {
        position: "absolute",
        bottom: 130,
        width: "100%",
        alignSelf: "center",
    },
    inviteButton: {
        width: "100%",
        paddingVertical: 15,
        borderRadius: 25,
        alignItems: "center",
        elevation: 5,
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.3,
        shadowRadius: 5,
        bottom: 130,
    },
    confirmButton: {
        width: "100%",
        marginTop: 10,
        paddingLeft: 20,
        paddingRight: 20,
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
    modalContainer: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: "rgba(0, 0, 0, 0.5)",
    },
    modalContent: {
        backgroundColor: "#fff",
        padding: 20,
        borderRadius: 20,
        width: "85%",
        alignItems: "center",
    },
    label: {
        fontSize: 20,
        marginBottom: 10,
        fontFamily: "TimesNewRoman",
        color: "#000",
    },
    inputField: {
        borderWidth: 1,
        borderColor: "#ccc",
        borderRadius: 10,
        paddingHorizontal: 15,
        paddingVertical: 10,
        marginBottom: 15,
        width: "100%",
        fontSize: 16,
        fontFamily: "TimesNewRoman",
        color: "#000",
    },
    modalContentWrapper: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
    },
    modalBackground: {
        position: "absolute",
        top: 0,
        left: 0,
        height: "100%",
        width: "100%",
        backgroundColor: "rgba(0, 0, 0, 0.5)",
    }    
});

export default MemberPage;
