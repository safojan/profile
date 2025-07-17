import React, { useState, useEffect } from 'react';
import { StatusBar } from 'expo-status-bar';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { 
  useFonts,
  SpaceGrotesk_400Regular,
  SpaceGrotesk_500Medium,
  SpaceGrotesk_700Bold,
} from '@expo-google-fonts/space-grotesk';
import * as SplashScreen from 'expo-splash-screen';

import { LoginScreen } from './app/screens/LoginScreen';
import { GuidelinesScreen } from './app/screens/GuidelinesScreen';
import { GuidelineDetailScreen } from './app/screens/GuidelineDetailScreen';
import { AdminDashboardScreen } from './app/screens/AdminDashboardScreen';
import { isAuthenticated, getStoredUserData } from './app/utils/storage';
import { Guideline, User } from './app/types';
import { theme } from './app/theme';

// Keep the splash screen visible while we fetch resources
SplashScreen.preventAutoHideAsync();

// Create a client for React Query
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 2,
      staleTime: 5 * 60 * 1000, // 5 minutes
    },
  },
});

const Stack = createNativeStackNavigator();

export default function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedGuideline, setSelectedGuideline] = useState<Guideline | null>(null);
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [showAdminDashboard, setShowAdminDashboard] = useState(false);

  // Load fonts
  const [fontsLoaded] = useFonts({
    'SpaceGrotesk-Regular': SpaceGrotesk_400Regular,
    'SpaceGrotesk-Medium': SpaceGrotesk_500Medium,
    'SpaceGrotesk-Bold': SpaceGrotesk_700Bold,
  });

  useEffect(() => {
    async function prepare() {
      try {
        // Check if user is authenticated
        const authenticated = await isAuthenticated();
        setIsLoggedIn(authenticated);
        
        if (authenticated) {
          const userData = await getStoredUserData();
          setCurrentUser(userData);
        }
      } catch (e) {
        console.warn(e);
      } finally {
        setIsLoading(false);
      }
    }

    prepare();
  }, []);

  useEffect(() => {
    if (fontsLoaded && !isLoading) {
      SplashScreen.hideAsync();
    }
  }, [fontsLoaded, isLoading]);

  if (!fontsLoaded || isLoading) {
    return null;
  }

  const handleLoginSuccess = () => {
    setIsLoggedIn(true);
  };

  const handleGuidelinePress = (guideline: Guideline) => {
    setSelectedGuideline(guideline);
  };

  const handleBackToGuidelines = () => {
    setSelectedGuideline(null);
    setShowAdminDashboard(false);
  };

  const handleShowAdminDashboard = () => {
    setShowAdminDashboard(true);
    setSelectedGuideline(null);
  };

  return (
    <QueryClientProvider client={queryClient}>
      <NavigationContainer>
        <StatusBar style="auto" backgroundColor={theme.colors.primary} />
        
        <Stack.Navigator
          screenOptions={{
            headerShown: false,
            contentStyle: { backgroundColor: theme.colors.background },
          }}
        >
          {!isLoggedIn ? (
            <Stack.Screen name="Login">
              {() => <LoginScreen onLoginSuccess={handleLoginSuccess} />}
            </Stack.Screen>
          ) : selectedGuideline ? (
            <Stack.Screen name="GuidelineDetail">
              {() => (
                <GuidelineDetailScreen
                  guideline={selectedGuideline}
                  onBack={handleBackToGuidelines}
                />
              )}
            </Stack.Screen>
          ) : showAdminDashboard ? (
            <Stack.Screen name="AdminDashboard">
              {() => <AdminDashboardScreen onBack={handleBackToGuidelines} />}
            </Stack.Screen>
          ) : (
            <Stack.Screen name="Guidelines">
              {() => (
                <GuidelinesScreen
                  onGuidelinePress={handleGuidelinePress}
                  onShowAdminDashboard={
                    currentUser?.role === 'admin' ? handleShowAdminDashboard : undefined
                  }
                />
              )}
            </Stack.Screen>
          )}
        </Stack.Navigator>
      </NavigationContainer>
    </QueryClientProvider>
  );
}

export default App;
