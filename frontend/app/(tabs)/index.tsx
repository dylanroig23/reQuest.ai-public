import React, { useState } from "react";
import { View, StyleSheet } from "react-native";
import Login from "@/components/Login";
import Chat from "@/components/Chat";
import ConversationPanel from "@/components/ConversationPanel";
import type { Game_Conversation } from "@/components/ConversationPanel";
import { useAuth } from "@/contexts/AuthContext";

export default function reQuestChat() {
   const { loggedIn } = useAuth();
   const [selectedConversation, setSelectedConversation] =
      useState<Game_Conversation | null>(null);
   const [isDrawerOpen, setIsDrawerOpen] = useState(false);

   if (!loggedIn) {
      return <Login />;
   }
   return (
      <View style={styles.container}>
         <ConversationPanel
            onSelectConversation={setSelectedConversation}
            isDrawerOpen={isDrawerOpen}
            onCloseDrawer={() => setIsDrawerOpen(false)}
         />
         <View style={styles.chatArea}>
            <Chat
               game_appid={selectedConversation?.game_appid ?? null}
               game_name={selectedConversation?.game_name ?? null}
               game_image={selectedConversation?.game_image ?? ""}
               playtime_forever={selectedConversation?.playtime_forever ?? null}
               setIsDrawerOpen={() => setIsDrawerOpen(!isDrawerOpen)}
            />
         </View>
      </View>
   );
}

const styles = StyleSheet.create({
   container: {
      flex: 1,
      flexDirection: "row",
      height: "100%",
   },
   chatArea: {
      flex: 1,
      height: "100%",
   },
});
