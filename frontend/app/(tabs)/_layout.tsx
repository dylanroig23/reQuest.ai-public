import React from "react";
import { Tabs } from "expo-router";
import {
   View,
   Text,
   Image,
   StyleSheet,
   useWindowDimensions,
} from "react-native";
import { rem } from "../../constants/SizeScaler";
import { useClientOnlyValue } from "@/components/useClientOnlyValue";
import { CustomTheme } from "@/constants/CustomThemes";
import Profile from "@/components/Profile";

// You can explore the built-in icon families and icons on the web at https://icons.expo.fyi/

export default function TabLayout() {
   const { width } = useWindowDimensions();
   const isMobile = width < 768;

   return (
      <Tabs
         screenOptions={{
            tabBarActiveTintColor: CustomTheme.colors.border,
            headerShown: useClientOnlyValue(false, true),
            headerStyle: {
               backgroundColor: CustomTheme.colors.background,
               borderBottomColor: CustomTheme.colors.border,
               borderBottomWidth: rem(0.125),
            },
            headerTitle: () => (
               <View style={styles.titleSection}>
                  <Text style={styles.titleText}>reQuest.ai</Text>
                  <Image
                     source={require("../../assets/images/requestai_logo.png")}
                     style={styles.titleLogo}
                     resizeMode="contain"
                  />
               </View>
            ),
            headerRight: () => (
               <View
                  style={
                     isMobile
                        ? styles.profileSectionMobile
                        : styles.profileSection
                  }
               >
                  <Profile />
               </View>
            ),
            headerTitleAlign: "center",
            tabBarStyle: {
               display: "none",
            },
         }}
      >
         <Tabs.Screen name="index" />
         <Tabs.Screen name="TestPage" />
      </Tabs>
   );
}

const styles = StyleSheet.create({
   headerContainer: {
      flexDirection: "row",
      justifyContent: "center",
   },
   titleSection: {
      flexDirection: "row",
      justifyContent: "center",
   },
   titleText: {
      fontWeight: "bold",
      fontSize: rem(2.5),
      color: CustomTheme.colors.text,
      textShadowColor: CustomTheme.colors.border,
      textShadowOffset: {
         width: rem(0.5),
         height: rem(0.25),
      },
      textShadowRadius: rem(0.5),
   },
   titleLogo: {
      width: rem(4),
      height: rem(4),
      marginLeft: rem(0.75),
   },
   profileSection: {
      flexDirection: "row",
      justifyContent: "center",
      marginRight: rem(2.5),
   },
   profileSectionMobile: {
      flexDirection: "row",
      justifyContent: "center",
      marginRight: rem(0.75),
   },
});
