import FontAwesome from '@expo/vector-icons/FontAwesome';
import { DarkTheme, DefaultTheme, ThemeProvider } from '@react-navigation/native';
import { useFonts } from 'expo-font';
import { SplashScreen, Stack, router } from 'expo-router';
import { useContext, useEffect, useState } from 'react';
import { useColorScheme } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import UserProvider, { UserContext } from '../context/UserContext';

export {
  // Catch any errors thrown by the Layout component.
  ErrorBoundary,
} from 'expo-router';

export const unstable_settings = {
  // Ensure that reloading on `/modal` keeps a back button present.
  initialRouteName: '(tabs)',
};

// Prevent the splash screen from auto-hiding before asset loading is complete.
SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  const [loaded, error] = useFonts({
    SpaceMono: require('../assets/fonts/SpaceMono-Regular.ttf'),
    ...FontAwesome.font,
  });

  // Expo Router uses Error Boundaries to catch errors in the navigation tree.
  useEffect(() => {
    if (error) throw error;
  }, [error]);

  useEffect(() => {
    if (loaded) {
      SplashScreen.hideAsync();
    }
  }, [loaded]);

  if (!loaded) {
    return null;
  }

  return (
    <UserProvider>
      <RootLayoutNav />
    </UserProvider>
  );
}

function RootLayoutNav() {
  const [isUserLoaded, setIsUserLoaded] = useState(false);
  const colorScheme = useColorScheme();

  const {
    token,
    username,
    setToken,
    setUsername,
  } = useContext(UserContext);

  useEffect(() => {
    (async () => {
      if (!isUserLoaded) {
        const user = JSON.parse(await AsyncStorage.getItem('user') || "{}")
        setIsUserLoaded(true);
        if (user.token && user.username) {
          setToken(user.token);
          setUsername(user.username);
        }
      }
    })()
  }, [isUserLoaded])

  useEffect(() => {
    if (isUserLoaded) {
      if (token && username) {
        router.replace('/(tabs)');
      } else {
        router.replace('/login');
      }
    }
  }, [isUserLoaded, token, username])

  if (!isUserLoaded) return null;

  return (
    <ThemeProvider value={colorScheme === 'dark' ? DarkTheme : DefaultTheme}>
        <Stack>
          <Stack.Screen name="login" options={{ headerShown: false }} />
          <Stack.Screen name="register" options={{ headerShown: false }} />
          <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
          <Stack.Screen name="modal" options={{ presentation: 'modal' }} />
        </Stack>
    </ThemeProvider>
  );
}
