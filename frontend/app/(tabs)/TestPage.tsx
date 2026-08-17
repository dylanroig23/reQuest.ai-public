import React, { useEffect, useState } from "react";
import { View, Text, ActivityIndicator } from "react-native";

export default function TestPage() {
   const [recentGame, setRecentGame] = useState<string | null>(null);
   const [loading, setLoading] = useState(true);

   useEffect(() => {
      fetch("http://127.0.0.1:5000/steam/recently-played", {
         credentials: "include", // Important for session cookies
      })
         .then((res) => {
            return res.json();
         })
         .then((data) => {
            console.log(JSON.stringify(data, null, 2));
            let recent = data.recent_game ? data.recent_game : data.error;
            setRecentGame(recent);
            setLoading(false);
         })
         .catch(() => {
            setRecentGame("Error fetching game. Please start the backend.");
            setLoading(false);
         });
   }, []);

   if (loading) {
      return (
         <View style={{ padding: 20 }}>
            <ActivityIndicator />
            <Text>Loading...</Text>
         </View>
      );
   }

   return (
      <View style={{ padding: 20 }}>
         <Text>Most Recently Played Game:</Text>
         <Text style={{ fontWeight: "bold", fontSize: 18 }}>{recentGame}</Text>
      </View>
   );
}
