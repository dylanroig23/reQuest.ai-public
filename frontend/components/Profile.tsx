import {
   StyleSheet,
   Text,
   TouchableOpacity,
   View,
   Pressable,
   Modal,
   useWindowDimensions,
} from "react-native";
import React, { useState } from "react";
import { rem } from "../constants/SizeScaler";
import { CustomTheme } from "../constants/CustomThemes";
import FontAwesomeIcon from "@/components/FontAwesomeIcon";
import { useAuth } from "@/contexts/AuthContext";
import InstructionsModal from "./InstructionsModal";

const Profile = () => {
   const { loggedIn, username, logout } = useAuth();
   const [showDropdown, setShowDropdown] = useState(false);
   const [showInstructions, setShowInstructions] = useState(false);
   const { width } = useWindowDimensions();
   const isMobile = width < 768;

   const handleLogout = async () => {
      try {
         await logout();
         setShowDropdown(false);
      } catch (error) {
         console.error("Logout failed:", error);
      }
   };

   const dropdownContent = (
      <Modal
         visible={showDropdown}
         transparent={true}
         animationType="fade"
         onRequestClose={() => setShowDropdown(false)}
      >
         <Pressable
            style={styles.modalOverlay}
            onPress={() => setShowDropdown(false)}
         >
            <View style={styles.dropdownContainer}>
               {isMobile && (
                  <View style={styles.dropdownItem}>
                     <View style={styles.profileIcon}>
                        <FontAwesomeIcon
                           name="user"
                           color={CustomTheme.colors.text}
                        />
                     </View>
                     <Text style={styles.profileText}>{username}</Text>
                  </View>
               )}
               <TouchableOpacity
                  style={styles.dropdownItem}
                  onPress={handleLogout}
               >
                  <Text style={styles.dropdownText}>Logout</Text>
                  <FontAwesomeIcon
                     name="sign-out"
                     color={CustomTheme.colors.text}
                  />
               </TouchableOpacity>
               <TouchableOpacity
                  style={styles.dropdownItem}
                  onPress={() => {
                     setShowDropdown(false);
                     setShowInstructions(true);
                  }}
               >
                  <Text style={styles.dropdownText}>Info Guide</Text>
                  <FontAwesomeIcon
                     name="info-circle"
                     color={CustomTheme.colors.text}
                  />
               </TouchableOpacity>
            </View>
         </Pressable>
      </Modal>
   );

   if (loggedIn) {
      return (
         <View>
            <TouchableOpacity
               onPress={() => setShowDropdown(!showDropdown)}
               style={styles.profileContainer}
            >
               {!isMobile && (
                  <View style={styles.profileContainer}>
                     <View style={styles.profileIcon}>
                        <FontAwesomeIcon
                           name="user"
                           color={CustomTheme.colors.text}
                        />
                     </View>
                     <Text style={styles.profileText}>{username}</Text>
                  </View>
               )}
               <FontAwesomeIcon
                  name={showDropdown ? "chevron-up" : "chevron-down"}
                  color={CustomTheme.colors.text}
               />
            </TouchableOpacity>
            {dropdownContent}
            <InstructionsModal
               visible={showInstructions}
               onClose={() => setShowInstructions(false)}
            />
         </View>
      );
   } else {
      // TODO: Could add additional login button here in the future?
      return <View></View>;
   }
};

export default Profile;

const styles = StyleSheet.create({
   profileContainer: {
      flexDirection: "row",
      alignItems: "center",
   },
   profileIcon: {
      marginRight: rem(0.5),
   },
   profileText: {
      fontSize: rem(1.5),
      color: CustomTheme.colors.text,
      fontWeight: "bold",
      textShadowColor: CustomTheme.colors.border,
      textShadowOffset: {
         width: rem(0.5),
         height: rem(0.25),
      },
      textShadowRadius: rem(0.5),
      marginRight: rem(0.75),
   },
   modalOverlay: {
      flex: 1,
      justifyContent: "flex-start",
      alignItems: "flex-end",
      paddingTop: rem(3),
      paddingRight: rem(2),
   },
   dropdownContainer: {
      backgroundColor: CustomTheme.colors.background,
      borderWidth: 1,
      borderColor: CustomTheme.colors.border,
      borderRadius: rem(0.5),
      marginTop: rem(0.5),
      minWidth: rem(10),
      shadowColor: CustomTheme.colors.border,
      shadowOffset: {
         width: rem(0.5),
         height: rem(0.25),
      },
      shadowOpacity: 0.25,
      shadowRadius: rem(0.5),
      elevation: 5,
   },
   dropdownItem: {
      flexDirection: "row",
      alignItems: "center",
      padding: rem(1),
   },
   dropdownText: {
      fontSize: rem(1.25),
      color: CustomTheme.colors.text,
      marginRight: rem(0.5),
   },
});
