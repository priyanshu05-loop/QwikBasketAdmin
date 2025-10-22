import { useNavigation } from '@react-navigation/native';
import { height, Image, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import {
  heightPercentageToDP as hp,
  widthPercentageToDP as wp,
} from "react-native-responsive-screen";

import { Ionicons } from '@expo/vector-icons';
import { SafeAreaView } from "react-native-safe-area-context";
import PendingVerificationList from "../components/PendingVerificationList ";
import { colors, typography } from '../constants/Admintheme';

const DashboardScreen = () => {
  const navigation = useNavigation();
  return (

    <SafeAreaView style={styles.safeArea}>
    <View style={styles.container}>
     
          {/*Header*/}
              <View style={styles.header}>
                    <TouchableOpacity onPress={() => navigation.openDrawer()}>
                        <Ionicons name="menu" size={28} color={colors.textDark} />
                    </TouchableOpacity>
                    <Text style={styles.headerTitle}>Dashboard</Text>
                    <View style={styles.headerIcons}>
                        <TouchableOpacity><Ionicons name="notifications-outline" size={24} color={colors.textDark} /></TouchableOpacity>
                        <TouchableOpacity><Image source={{ uri: 'https://cdn.mos.cms.futurecdn.net/v2/t:0,l:280,cw:720,ch:720,q:80,w:720/ZyiBw5xgHMWSEikFkK3mH8.jpg' }} style={styles.profilePic} /></TouchableOpacity>
                    </View>
                </View>
      
      <PendingVerificationList navigation={navigation} />
    </View>
    </SafeAreaView>
  );
};

export default DashboardScreen;

const styles = StyleSheet.create({
   safeArea: { flex: 1, backgroundColor: colors.background },

header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingVertical: hp(2), paddingHorizontal: wp(4), backgroundColor: colors.surface, borderBottomWidth: 1, borderBottomColor: colors.border },
        headerTitle: { ...typography.titleBold(height), color: colors.textDark, textAlign: 'center' },
        headerIcons: { flexDirection: 'row', alignItems: 'center', gap: wp(4) },
        
        profilePic: {  marginLeft:10, width: wp(9),   height: wp(9),
            borderRadius: wp(8),
            resizeMode: "cover", },

  container: {
    flex: 1,
    backgroundColor: "#fff",
 
  },
});
