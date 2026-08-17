import {
   StyleSheet,
   Text,
   View,
   TouchableOpacity,
   FlatList,
   useWindowDimensions,
   Image,
   Modal,
   Pressable,
} from "react-native";
import React, { useState, useEffect } from "react";
import { rem } from "../constants/SizeScaler";
import { CustomTheme } from "../constants/CustomThemes";
import { Config } from "../constants/Config";
import InstructionsPanel from "./InstructionsPanel";

export type Game_Conversation = {
   game_name: string;
   game_appid: number;
   playtime_forever: number;
   playtime_2weeks: number;
   game_image: string | null;
};

type ConversationPanelProps = {
   onSelectConversation?: (conv: Game_Conversation) => void;
   isDrawerOpen?: boolean;
   onCloseDrawer?: () => void;
};

const ConversationPanel = ({
   onSelectConversation,
   isDrawerOpen,
   onCloseDrawer,
}: ConversationPanelProps) => {
   const [conversationId, setConversationId] = useState<number | null>(null);
   const [loading, setLoading] = useState(false);
   const [games, setGames] = useState<Game_Conversation[]>([]);
   const { width } = useWindowDimensions();
   const isMobile = width < 768;

   useEffect(() => {
      fetchGames();
   }, []);

   const fetchGames = () => {
      setLoading(true);
      fetch(`${Config.BACKEND_URL}/steam/user-game-library`, {
         credentials: "include",
      })
         .then((res) => res.json())
         .then((data) => {
            setGames(data.games);
            if (conversationId === null && data.games.length > 0) {
               setConversationId(data.games[0].game_appid);
               onSelectConversation && onSelectConversation(data.games[0]);
            }
            setLoading(false);
         })
         .catch(() => {
            setLoading(false);
            console.error("Failed to fetch games");
         });
   };

   const panelContent = (
      <View style={isMobile ? styles.mobilePanel : styles.panel}>
         <Text style={styles.heading}>Game Library</Text>
         {loading ? (
            <Text style={styles.loading}>Loading...</Text>
         ) : (
            <View style={styles.conversationListContainer}>
               <FlatList
                  data={games}
                  keyExtractor={(item) => item.game_appid.toString()}
                  showsVerticalScrollIndicator={false}
                  renderItem={({ item }) => (
                     <TouchableOpacity
                        style={
                           item.game_appid === conversationId
                              ? styles.conversationItemActive
                              : styles.conversationItem
                        }
                        onPress={() => {
                           setConversationId(item.game_appid);
                           onSelectConversation && onSelectConversation(item);
                           onCloseDrawer && onCloseDrawer();
                        }}
                     >
                        <View
                           style={{
                              flexDirection: "row",
                              alignItems: "center",
                           }}
                        >
                           {item.game_image && (
                              <Image
                                 source={{ uri: item.game_image }}
                                 style={{
                                    width: rem(1.5),
                                    height: rem(1.5),
                                    marginRight: rem(0.5),
                                 }}
                              />
                           )}
                           <Text style={styles.conversationItemText}>
                              {item.game_name}
                           </Text>
                        </View>
                     </TouchableOpacity>
                  )}
               />
            </View>
         )}
         <InstructionsPanel />
      </View>
   );

   // Return drawer for mobile, panel for desktop
   if (isMobile) {
      if (isDrawerOpen) {
         return (
            <Modal
               visible={true}
               transparent={true}
               animationType="fade"
               onRequestClose={onCloseDrawer}
            >
               <Pressable style={styles.modalOverlay} onPress={onCloseDrawer}>
                  <View style={styles.drawerPanel}>{panelContent}</View>
               </Pressable>
            </Modal>
         );
      } else {
         return (
            <Modal
               visible={false}
               transparent={true}
               animationType="fade"
               onRequestClose={onCloseDrawer}
            >
               <Pressable style={styles.modalOverlay} onPress={onCloseDrawer}>
                  <View style={styles.drawerPanel}>{panelContent}</View>
               </Pressable>
            </Modal>
         );
      }
   }

   return panelContent;
};

export default ConversationPanel;

const styles = StyleSheet.create({
   panel: {
      maxWidth: rem(15),
      minWidth: rem(5),
      flex: 1,
      backgroundColor: CustomTheme.colors.background,
      paddingVertical: rem(1),
      paddingRight: rem(1),
      marginHorizontal: rem(1),
      borderRightWidth: rem(0.1875),
      borderRightColor: CustomTheme.colors.border,
      height: "100%",
   },
   mobilePanel: {
      flex: 1,
      paddingVertical: rem(1),
      paddingRight: rem(1),
      marginHorizontal: rem(1),
   },
   heading: {
      fontSize: rem(1.5),
      fontWeight: "bold",
      marginBottom: rem(1),
      color: CustomTheme.colors.text,
      textShadowColor: CustomTheme.colors.borderSecondary, // outline color
      textShadowOffset: { width: rem(0.5), height: rem(0.25) },
      textShadowRadius: rem(0.5),
   },
   loading: {
      color: CustomTheme.colors.text,
      marginTop: rem(1),
   },
   conversationListContainer: {
      maxHeight: "75%",
      marginBottom: rem(1),
   },
   conversationItem: {
      paddingVertical: rem(1),
      paddingHorizontal: rem(1),
      borderRadius: rem(1),
      marginBottom: rem(1),
      backgroundColor: CustomTheme.colors.background,
      borderWidth: rem(0.0625),
      borderColor: CustomTheme.colors.borderSecondary,
      // 3D effect
      shadowColor: CustomTheme.colors.borderSecondary,
      shadowOffset: { width: 0, height: rem(0.125) },
      shadowOpacity: 0.25,
   },
   conversationItemActive: {
      paddingVertical: rem(1),
      paddingHorizontal: rem(1),
      borderRadius: rem(1),
      marginBottom: rem(1),
      backgroundColor: CustomTheme.colors.primary,
      borderWidth: rem(0.1875),
      borderColor: CustomTheme.colors.borderSecondary,
      // 3D effect
      shadowColor: CustomTheme.colors.borderSecondary,
      shadowOffset: { width: rem(0.125), height: rem(0.125) },
      shadowOpacity: 0.25,
      shadowRadius: rem(1.5),
      elevation: 5,
   },
   conversationItemText: {
      fontSize: rem(1.125),
      fontWeight: "bold",
      color: CustomTheme.colors.text,
   },
   drawerPanel: {
      width: "100%",
      marginTop: rem(4), // Adjust based on your header height
      backgroundColor: CustomTheme.colors.background,
      borderRightWidth: 0,
      marginHorizontal: 0,
   },
   modalOverlay: {
      flex: 1,
      justifyContent: "flex-start",
      backgroundColor: "rgba(20, 255, 236, 0.15)",
   },
});
