import { StyleSheet, View, Animated, Image } from "react-native";
import React, { useRef, useEffect } from "react";
import { CustomTheme } from "@/constants/CustomThemes";
import { rem } from "../constants/SizeScaler";

type TypingIndicatorProps = {
   messageBubbleStyle?: object | {};
   messageLogoStyle?: object | {};
};

const TypingIndicator = ({
   messageBubbleStyle,
   messageLogoStyle,
}: TypingIndicatorProps) => {
   const dot1 = useRef(new Animated.Value(0)).current;
   const dot2 = useRef(new Animated.Value(0)).current;
   const dot3 = useRef(new Animated.Value(0)).current;

   useEffect(() => {
      const animate = (dot: Animated.Value, delay: number) => {
         Animated.loop(
            Animated.sequence([
               Animated.delay(delay),
               Animated.timing(dot, {
                  toValue: 1,
                  duration: 400,
                  useNativeDriver: true,
               }),
               Animated.timing(dot, {
                  toValue: 0,
                  duration: 400,
                  useNativeDriver: true,
               }),
            ])
         ).start();
      };

      animate(dot1, 0);
      animate(dot2, 200);
      animate(dot3, 400);
   }, []);

   const dotStyle = (animatedValue: Animated.Value) => ({
      opacity: animatedValue,
      transform: [
         {
            translateY: animatedValue.interpolate({
               inputRange: [0, 1],
               outputRange: [0, -5],
            }),
         },
      ],
   });

   return (
      <View
         style={{
            flexDirection: "column",
            alignItems: "flex-start",
            marginLeft: rem(0.5),
         }}
      >
         <View style={messageBubbleStyle}>
            <View style={styles.typingContainer}>
               <Animated.View style={[styles.typingDot, dotStyle(dot1)]} />
               <Animated.View style={[styles.typingDot, dotStyle(dot2)]} />
               <Animated.View style={[styles.typingDot, dotStyle(dot3)]} />
            </View>
         </View>
         <Image
            source={require("../assets/images/requestai_logo.png")}
            style={messageLogoStyle}
            resizeMode="contain"
         />
      </View>
   );
};

const styles = StyleSheet.create({
   typingContainer: {
      flexDirection: "row",
      alignItems: "center",
      gap: rem(0.25),
      paddingVertical: rem(0.25),
   },
   typingDot: {
      width: rem(0.5),
      height: rem(0.5),
      borderRadius: rem(0.25),
      backgroundColor: CustomTheme.colors.textSecondary,
   },
});

export default TypingIndicator;
