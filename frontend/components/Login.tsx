import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import React from "react";
import { rem } from "../constants/SizeScaler";
import * as Linking from "expo-linking";
import { CustomTheme } from "../constants/CustomThemes";
import { Image } from "react-native";
import { Config } from "../constants/Config";

const Login = () => {
   const handleSteamLogin = () => {
      Linking.openURL(`${Config.BACKEND_URL}/steam/auth`);
   };

   return (
      <View style={styles.container}>
         <Image
            source={require("../assets/images/requestai_logo.png")}
            style={styles.logoImage}
            resizeMode="contain"
         />
         <Text style={styles.loginText}>
            Providing help on your quest, one reQuest at a time.
         </Text>
         <Text style={styles.loginText}>
            Login to embark on your adventure!
         </Text>
         <TouchableOpacity
            style={styles.loginButton}
            onPress={handleSteamLogin}
            activeOpacity={0.5}
         >
            <View
               style={{
                  flexDirection: "row",
                  justifyContent: "center",
               }}
            >
               <Image
                  source={require("../assets/images/steam_logo.png")}
                  style={styles.steamLogo}
                  resizeMode="contain"
               />
               <Text style={styles.loginButtonText}>Login with Steam</Text>
            </View>
         </TouchableOpacity>
         <Image
            source={require("../assets/images/sits_01.png")}
            style={styles.sitsImage}
            resizeMode="contain"
         />
      </View>
   );
};

export default Login;

const styles = StyleSheet.create({
   container: {
      flex: 1,
      width: "100%",
      maxWidth: rem(64),
      marginHorizontal: "auto",
      marginVertical: rem(2),
      backgroundColor: CustomTheme.colors.background,
      justifyContent: "center",
      alignItems: "center",
   },
   logoImage: {
      width: rem(8),
      height: rem(8),
      marginBottom: rem(0.5),
   },
   loginText: {
      fontSize: rem(1.5),
      fontWeight: "bold",
      color: CustomTheme.colors.text,
      textAlign: "center",
   },
   loginButton: {
      marginTop: rem(2),
      width: "65%",
      height: rem(4),
      backgroundColor: CustomTheme.colors.secondary,
      borderColor: CustomTheme.colors.border,
      borderWidth: rem(0.1875),
      borderRadius: rem(0.5),
      justifyContent: "center",
      alignItems: "center",
      shadowColor: "#000",
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.2,
      shadowRadius: 2,
      elevation: 2,
   },
   loginButtonText: {
      color: "#fff",
      fontWeight: "bold",
      fontSize: rem(1.25),
      letterSpacing: 0.5,
   },
   steamLogo: {
      width: rem(1.75),
      height: rem(1.75),
      marginRight: rem(0.5),
   },
   sitsImage: {
      width: rem(15),
      marginTop: rem(1),
   },
});
