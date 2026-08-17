import { StyleSheet, Text, Modal, Pressable } from "react-native";
import React from "react";
import { rem } from "../constants/SizeScaler";
import { CustomTheme } from "../constants/CustomThemes";

interface InstructionsModalProps {
   visible: boolean;
   onClose: () => void;
}

const InstructionsModal = ({ visible, onClose }: InstructionsModalProps) => {
   return (
      <Modal
         visible={visible}
         transparent={true}
         animationType="fade"
         onRequestClose={onClose}
      >
         <Pressable style={styles.overlay} onPress={onClose}>
            <Pressable
               style={styles.modalContent}
               onPress={(e) => e.stopPropagation()}
            >
               {/* X button */}
               <Pressable style={styles.closeButton} onPress={onClose}>
                  <Text style={styles.closeButtonText}>✕</Text>
               </Pressable>

               {/* Modal content */}
               <Text style={styles.title}>What is reQuest.ai?</Text>
               <Text style={styles.content}>
                  reQuest.ai is your AI-powered gaming companion that leverages
                  advanced language models to provide personalized insights,
                  recommendations, and engaging conversations about your Steam
                  game library. Simply select a game from your library to start
                  chatting and exploring all that reQuest.ai has to offer!
               </Text>
            </Pressable>
         </Pressable>
      </Modal>
   );
};

export default InstructionsModal;

const styles = StyleSheet.create({
   overlay: {
      flex: 1,
      backgroundColor: "rgba(20, 255, 236, 0.075)",
      justifyContent: "center",
      alignItems: "center",
   },
   modalContent: {
      backgroundColor: CustomTheme.colors.primary,
      borderColor: CustomTheme.colors.border,
      borderRadius: rem(1.25),
      borderWidth: rem(0.1875),
      padding: rem(1),
      maxWidth: rem(40),
      margin: rem(0.5),
   },
   closeButton: {
      position: "absolute",
      top: rem(0.25),
      right: rem(0.75),
      zIndex: 1,
   },
   closeButtonText: {
      fontSize: rem(2),
      color: CustomTheme.colors.text,
      fontWeight: CustomTheme.fonts.secondary.fontWeight,
   },
   title: {
      color: CustomTheme.colors.text,
      fontSize: rem(2),
      fontWeight: CustomTheme.fonts.secondary.fontWeight,
      marginBottom: rem(0.5),
      alignSelf: "center",
   },
   content: {
      color: CustomTheme.colors.textSecondary,
      fontSize: rem(1.5),
      fontWeight: CustomTheme.fonts.regular.fontWeight,
   },
});
