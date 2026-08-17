// Configuration file for environment variables
// In Expo, environment variables must be prefixed with EXPO_PUBLIC_ to be accessible

export const Config = {
   BACKEND_URL: process.env.EXPO_PUBLIC_BACKEND_URL || "http://127.0.0.1:5000",
};
