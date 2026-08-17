import { StyleSheet, Text, View } from "react-native";
import { CustomTheme } from "@/constants/CustomThemes";
import { rem } from "@/constants/SizeScaler";
import React from "react";

const InstructionsPanel = () => {
   return (
      <View>
         <Text style={styles.text}>
            All of the games in your Steam library are listed above. Select one
            of your games to start a chat with reQuest.ai about that game. If
            you already have a chat history for that game, it will be loaded
            automatically.
         </Text>
      </View>
   );
};

export default InstructionsPanel;

const styles = StyleSheet.create({
   text: {
      color: CustomTheme.colors.textSecondary,
      fontSize: rem(0.875),
      fontWeight: CustomTheme.fonts.secondary.fontWeight,
      lineHeight: rem(1.25),
      paddingVertical: rem(1),
      paddingHorizontal: rem(1),
      borderRadius: rem(1),
      marginBottom: rem(1),
      backgroundColor: CustomTheme.colors.background,
      borderWidth: rem(0.0625),
      borderColor: CustomTheme.colors.border,
      // 3D effect
      shadowColor: CustomTheme.colors.border,
      shadowOffset: { width: 0, height: rem(0.125) },
      shadowOpacity: 0.25,
   },
});
