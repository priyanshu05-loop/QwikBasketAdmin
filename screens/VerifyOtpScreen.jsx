import { useNavigation } from "@react-navigation/native";
import React, { useRef, useState } from "react";
import {
  Image,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import {
  responsiveFontSize
} from "react-native-responsive-dimensions";
import {
  heightPercentageToDP as hp,
  widthPercentageToDP as wp,
} from "react-native-responsive-screen";
import { colors } from "../constants/theme"; // Import your theme

const VerifyOtpScreen = () => {
  const navigation = useNavigation();
  const [otp, setOtp] = useState(["", "", "", "", "", ""]);
  const inputs = useRef([]);

  const handleChange = (text, index) => {
    if (/^\d*$/.test(text)) {
      // Only allow numbers
      const newOtp = [...otp];
      newOtp[index] = text;
      setOtp(newOtp);
      if (text && index < 5) {
        inputs.current[index + 1].focus();
      }
    }
  };

  const handleKeyPress = (e, index) => {
    if (e.nativeEvent.key === "Backspace" && otp[index] === "" && index > 0) {
      inputs.current[index - 1].focus();
    }
  };

  return (
    <View style={styles.container}>
      {/* ---------- HEADER ---------- */}
      <View style={styles.header}>
        <Image
          source={require("../assets/images/Ellipse 45.png")}
          style={styles.ellipse}
        />
        <Text style={styles.title}>Verify OTP</Text>

        <TouchableOpacity style={styles.backbutton} onPress={()=>naviagtion.goBack()}>
          <Image source={require("../assets/images/backbutton.png")} style={{width:responsiveFontSize(7),height:responsiveFontSize(7)}} />
        </TouchableOpacity> 
      </View>
      {/* Description */}
      <View style={styles.txtContainer}>
        <Text style={[styles.description, { color: "#838383" }]}>
          Enter your OTP which has been sent to your phone number and completely
          verify your account.
        </Text>
        {/* OTP Inputs
      <View style={styles.otpInputContainer}>
        {[...Array(6)].map((_, i) => (
          <View style={styles.otpBox} key={i}></View>
        ))}
      </View> */}
        <View style={styles.otpInputContainer}>
          {otp.map((digit, i) => (
            <TextInput
              key={i}
              ref={(ref) => (inputs.current[i] = ref)}
              style={styles.otpBox}
              keyboardType="number-pad"
              maxLength={1}
              value={digit}
              onChangeText={(text) => handleChange(text, i)}
              onKeyPress={(e) => handleKeyPress(e, i)}
              textAlign="center"
              returnKeyType="next"
              autoFocus={i === 0}
            />
          ))}
        </View>
        {/* Resend OTP */}
        <View style={styles.resendContainer}>
          <Text style={styles.resendText}>
            A code has been sent to your phone
          </Text>
          <Text style={styles.resendTimer}>Resend in 00:30</Text>
        </View>
        {/* Confirm Button */}
        <TouchableOpacity
          style={styles.confirmButton}
          onPress={() => navigation.navigate("MainApp")}
        >
          <Text style={styles.buttonText}>Confirm</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default VerifyOtpScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    backgroundColor: "#fff",
    paddingHorizontal: wp(5),
  },

  // ---------- HEADER ----------
  header: {
  width: wp(100),
  height: hp(18),
  flexDirection: "row", // put backbutton + title in one row
  alignItems: "center",
  justifyContent: "center", // centers title
  paddingHorizontal: wp(5),
  position: "relative",
},
  ellipse: {
    position: "absolute",
    top: 0,
    left: 0,
    width: wp(100),
    height: hp(16),
    resizeMode: "stretch",
  },
  title: {
    alignSelf: "center",
    marginTop: hp(2.5),
    fontSize: responsiveFontSize(3),
    fontWeight: "600",
    color: "#fff",
  },
  backbutton: {
  position: "absolute",  // keep it inside header but aligned left
  left: wp(5),
  top:hp(8.8)
},

  txtContainer: {
    flex: 1,
    width: wp(90),
    alignSelf: "center",
    justifyContent: "flex-start", // keeps everything stacked from top
    paddingVertical: hp(2),
  },

  // ---------- DESCRIPTION ----------
  description: {
    marginTop: hp(2),
    fontSize: responsiveFontSize(1.9),
    color: "#838383",
    textAlign: "center",
    lineHeight: hp(3),
    paddingHorizontal: wp(5),
    alignSelf: "center",
    width: "100%", // take full txtContainer width, not screen width
  },

  // ---------- OTP BOX ----------
  otpInputContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: hp(2),
    width: wp(80),
    alignSelf: "center",
  },

  otpBox: {
    width: wp(12),
    height: hp(6),
    borderBottomWidth: 2,
    borderBottomColor: "#838383",
    fontSize: responsiveFontSize(2.5),
    textAlign: "center",
  },

  // ---------- RESEND ----------
  resendContainer: {
    marginTop: hp(4),
    alignItems: "center",
  },
  resendText: {
    fontSize: responsiveFontSize(1.9),
    color: "#838383",
    marginBottom: hp(1),
  },
  resendTimer: {
    fontSize: responsiveFontSize(2.2),
    fontWeight: "bold",
    color: colors.primaryDark,
  },

  // ---------- BUTTON ----------
  confirmButton: {
    marginTop: hp(5),
    backgroundColor: colors.primaryDark,
    width: "100%", // take full width of txtContainer
    height: hp(7),
    borderRadius: wp(3),
    alignSelf: "center",
    justifyContent: "center",
    alignItems: "center",
  },
  buttonText: {
    fontSize: responsiveFontSize(2.2),
    fontWeight: "700",
    color: "#fff",
  },
});
