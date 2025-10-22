import { useNavigation } from "@react-navigation/native";
import React from "react";
import {
  Image,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { responsiveFontSize } from "react-native-responsive-dimensions";
import {
  heightPercentageToDP as hp,
  widthPercentageToDP as wp,
} from "react-native-responsive-screen";
import { SafeAreaView } from "react-native-safe-area-context";

const LoginScreen = () => {
  const navigation = useNavigation();

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView
        contentContainerStyle={{
          flexGrow: 1,
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <Image
          style={styles.logoImage}
          source={require("../assets/images/Logo.png")}
        />
        <Text style={styles.pickupLine}>Your B2B produce marketplace</Text>

        <View style={{ width: wp(85) }}>
          <Text style={styles.label}>Phone no:</Text>

          <View style={styles.phoneInputContainer}>
            <View style={{ flexDirection: "row", alignItems: "center" }}>
              <Image
                source={require("../assets/images/indianflag.png")}
                style={styles.flagIcon}
              />
              <Text style={styles.code}>+91</Text>
            </View>
            <TextInput
              placeholder="Enter a valid 10 digit Phone number"
              style={styles.input}
              keyboardType="phone-pad"
            />
          </View>

          <View style={styles.optionsRow}>
            <View style={{ flexDirection: "row", alignItems: "center" }}>
              <Image
                source={require("../assets/images/Checkbox.png")}
                style={styles.checkbox}
              />
              <Text style={styles.optionText}>Remember me</Text>
            </View>
            <TouchableOpacity>
              <Text style={styles.forgotText}>Forgot password?</Text>
            </TouchableOpacity>
          </View>

          <TouchableOpacity
            style={styles.primaryButton}
            onPress={() => navigation.navigate("VerifyOtp")}
          >
            <Text style={styles.otptxt}>Send OTP</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default LoginScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
  logoImage: {
    resizeMode: "contain",
    width: wp(95),
    height: hp(30),
    marginBottom: hp(-0.2),
  },
  pickupLine: {
    marginBottom: hp(3),
    fontFamily: "Poppins",
    color: "#AEDC81",
    fontWeight: "900",
    fontSize: responsiveFontSize(2.5),
    textAlign: "center",
  },
  label: {
    fontSize: responsiveFontSize(2),
    marginBottom: hp(0.7),
    color: "#000",
  },
  phoneInputContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    borderWidth: 1,
    borderRadius: wp(3),
    borderColor: "#E6E6E6",
    paddingVertical: hp(1),
    paddingHorizontal: wp(3.5),
    marginBottom: hp(2),
    backgroundColor: "#fff",
  },
  flagIcon: {
    width: wp(6),
    height: wp(4),
    resizeMode: "contain",
  },
  code: {
    fontSize: responsiveFontSize(1.9),
    marginHorizontal: wp(3),
  },
  input: {
    flex: 1,
    fontSize: responsiveFontSize(1.8),
    paddingVertical: hp(1), // ensures text isn’t clipped
    paddingHorizontal: wp(-1), // adds breathing space
    color: "#000", // text clearly visible
  },
  optionsRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: hp(2),
  },
  checkbox: {
    width: wp(5),
    height: wp(5),
    resizeMode: "contain",
    marginRight: wp(1.5),
  },
  optionText: {
    fontSize: responsiveFontSize(1.8),
  },
  forgotText: {
    fontSize: responsiveFontSize(1.8),
    color: "#838383",
  },
  primaryButton: {
    backgroundColor: "#003032",
    borderRadius: wp(3),
    paddingVertical: hp(1.5),
    marginTop: hp(1),
  },
  otptxt: {
    color: "#FFFFFF",
    fontSize: responsiveFontSize(2),
    fontWeight: "700",
    textAlign: "center",
  },
});
