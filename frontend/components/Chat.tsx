import {
   FlatList,
   KeyboardAvoidingView,
   Platform,
   StyleSheet,
   Text,
   TextInput,
   TouchableOpacity,
   View,
   Image,
   useWindowDimensions,
} from "react-native";
import { rem } from "../constants/SizeScaler";
import FontAwesomeIcon from "@/components/FontAwesomeIcon";
import TypingIndicator from "@/components/TypingIndicator";
import { CustomTheme } from "@/constants/CustomThemes";
import React, { useState, useRef, useEffect } from "react";
import { Config } from "../constants/Config";

type ChatProps = {
   game_appid?: number | null;
   game_name?: string | null;
   game_image?: string;
   playtime_forever?: number | null;
   setIsDrawerOpen?: () => void;
};

const Chat = ({
   game_appid,
   game_name,
   game_image,
   playtime_forever,
   setIsDrawerOpen,
}: ChatProps) => {
   const [messages, setMessages] = useState<
      { id: number; text: string; isUser: boolean }[]
   >([]);
   const [input, setInput] = useState("");
   const [isLoading, setIsLoading] = useState(false);
   const flatListRef = useRef<FlatList>(null);
   const { width } = useWindowDimensions();
   const isMobile = width < 768;

   useEffect(() => {
      if (game_appid === null) {
         return;
      }

      fetch(`${Config.BACKEND_URL}/chat_history?game_appid=${game_appid}`, {
         method: "GET",
         credentials: "include",
         headers: { "Content-Type": "application/json" },
      })
         .then((res) => res.json())
         .then((data) => {
            // console.log(JSON.stringify(data, null, 3));
            if (data.messages && data.messages.length > 0) {
               setMessages(data.messages.reverse());
            } else {
               setMessages([]);
            }
         })
         .catch(() => console.log("Error loading chat history"));
   }, [game_appid]);

   const handleSend = async () => {
      const text = input.trim();
      if (!text) return;

      // Show user message immediately
      setMessages((prev) => [{ id: Date.now(), text, isUser: true }, ...prev]);
      setInput("");
      setIsLoading(true);
      setTimeout(() => {
         flatListRef.current?.scrollToOffset({ offset: 0, animated: true });
      }, 100);

      try {
         const res = await fetch(`${Config.BACKEND_URL}/chat`, {
            method: "POST",
            credentials: "include",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
               message: text,
               game_appid: game_appid,
               game_name: game_name,
               playtime_forever: playtime_forever,
            }),
         });
         if (!res.ok) {
            setIsLoading(false);
            setMessages((prev) => [
               {
                  id: Date.now() + 1,
                  text: "Error: failed to get reply",
                  isUser: false,
               },
               ...prev,
            ]);
            return;
         }
         const data = await res.json();
         const replyText = data.reply ?? "No reply";
         setIsLoading(false);
         setMessages((prev) => [
            { id: Date.now() + 2, text: replyText, isUser: false },
            ...prev,
         ]);
      } catch (err) {
         setIsLoading(false);
         setMessages((prev) => [
            { id: Date.now() + 3, text: "Network error", isUser: false },
            ...prev,
         ]);
      }
   };

   const renderChatMessage = ({
      item,
   }: {
      item: { id: number; text: string; isUser: boolean };
   }) => {
      if (item.isUser) {
         return (
            <View
               style={{
                  flexDirection: "column",
                  alignItems: "flex-end",
                  marginRight: rem(0.5),
               }}
            >
               <View style={styles.userMessageBubble}>
                  <Text style={styles.userMessageText}>{item.text}</Text>
               </View>
               <FontAwesomeIcon name="user" color={CustomTheme.colors.text} />
            </View>
         );
      } else {
         return (
            <View
               style={{
                  flexDirection: "column",
                  alignItems: "flex-start",
                  marginLeft: rem(0.5),
               }}
            >
               <View style={styles.botMessageBubble}>
                  <Text style={styles.botMessageText}>{item.text}</Text>
               </View>
               <Image
                  source={require("../assets/images/requestai_logo.png")}
                  style={styles.logoImage}
                  resizeMode="contain"
               />
            </View>
         );
      }
   };

   return (
      <View style={styles.container}>
         <KeyboardAvoidingView
            style={{ flex: 1, backgroundColor: CustomTheme.colors.background }}
            behavior={Platform.OS === "ios" ? "padding" : undefined}
            keyboardVerticalOffset={80}
         >
            <View
               style={
                  isMobile
                     ? styles.chatTitleContainerMobile
                     : styles.chatTitleContainer
               }
            >
               <Image
                  source={{ uri: game_image }}
                  style={styles.chatTitleImage}
                  resizeMode="contain"
               />
               <Text style={styles.chatTitleText}>{game_name}</Text>
               {isMobile && (
                  <TouchableOpacity
                     onPress={setIsDrawerOpen}
                     style={{ marginLeft: rem(1) }}
                  >
                     <FontAwesomeIcon
                        name={"bars"}
                        color={CustomTheme.colors.text}
                     />
                  </TouchableOpacity>
               )}
            </View>
            <FlatList
               ref={flatListRef}
               data={messages}
               renderItem={renderChatMessage}
               keyExtractor={(item) => item.id.toString()}
               inverted
               ListHeaderComponent={
                  isLoading ? (
                     <TypingIndicator
                        messageBubbleStyle={styles.botMessageBubble}
                        messageLogoStyle={styles.logoImage}
                     />
                  ) : null
               }
               contentContainerStyle={{
                  flexGrow: 1,
                  justifyContent: "flex-end",
               }}
               showsVerticalScrollIndicator={false}
            />
            <View style={styles.inputContainer}>
               <TextInput
                  style={styles.input}
                  value={input}
                  onChangeText={setInput}
                  placeholder="Send reQuest.ai a message..."
                  placeholderTextColor={CustomTheme.colors.text}
                  onSubmitEditing={handleSend}
                  returnKeyType="send"
               />
               <TouchableOpacity style={styles.sendButton} onPress={handleSend}>
                  <Text>
                     <FontAwesomeIcon
                        name="arrow-up"
                        color={CustomTheme.colors.text}
                     />
                  </Text>
               </TouchableOpacity>
            </View>
         </KeyboardAvoidingView>
      </View>
   );
};

export default Chat;

const styles = StyleSheet.create({
   container: {
      flex: 1,
      width: "100%",
      maxWidth: rem(64),
      marginHorizontal: "auto",
      marginVertical: rem(1),
      backgroundColor: CustomTheme.colors.background,
   },
   chatTitleContainer: {
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "center",
      marginBottom: rem(1),
      paddingHorizontal: rem(1),
   },
   chatTitleContainerMobile: {
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "space-between",
      marginBottom: rem(1),
      paddingHorizontal: rem(1),
   },
   chatTitleText: {
      fontSize: rem(2),
      fontWeight: "bold",
      color: CustomTheme.colors.text,
      textShadowColor: CustomTheme.colors.borderSecondary,
      textShadowOffset: {
         width: rem(0.5),
         height: rem(0.25),
      },
      textShadowRadius: rem(0.5),
      marginLeft: rem(0.5),
   },
   chatTitleImage: {
      width: rem(2),
      height: rem(2),
   },
   userMessageBubble: {
      backgroundColor: CustomTheme.colors.secondary,
      alignSelf: "flex-end",
      padding: rem(0.75),
      borderRadius: rem(1),
      maxWidth: "80%",
      borderWidth: rem(0.1875),
      borderColor: CustomTheme.colors.borderSecondary,
   },
   botMessageBubble: {
      backgroundColor: CustomTheme.colors.primary,
      alignSelf: "flex-start",
      padding: rem(0.75),
      borderRadius: rem(1),
      maxWidth: "80%",
      borderWidth: rem(0.1875),
      borderColor: CustomTheme.colors.border,
   },
   userMessageText: {
      fontSize: rem(1.25),
      color: CustomTheme.colors.text,
   },
   botMessageText: {
      fontSize: rem(1.25),
      color: CustomTheme.colors.textSecondary,
   },
   inputContainer: {
      flexDirection: "row",
      alignItems: "center",
      padding: 8,
      backgroundColor: CustomTheme.colors.background,
   },
   input: {
      flex: 1,
      fontSize: 16,
      padding: rem(1),
      paddingHorizontal: rem(1.5),
      backgroundColor: CustomTheme.colors.primary,
      borderRadius: rem(1.25),
      borderWidth: rem(0.1875),
      borderColor: CustomTheme.colors.borderSecondary,
      marginRight: rem(1),
      color: CustomTheme.colors.text,
   },
   sendButton: {
      backgroundColor: CustomTheme.colors.primary,
      borderBlockColor: CustomTheme.colors.borderSecondary,
      borderWidth: rem(0.1875),
      borderColor: CustomTheme.colors.borderSecondary,
      paddingVertical: rem(0.9),
      paddingHorizontal: rem(1.125),
      borderRadius: rem(1.25),
   },
   logoImage: {
      width: rem(2),
      height: rem(2),
   },
});
