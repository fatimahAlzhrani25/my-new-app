import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { DismissalProvider } from '../src/store/dismissalStore';
import { colors } from '../src/theme/colors';

export default function RootLayout() {
  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <SafeAreaProvider>
        <DismissalProvider>
          <StatusBar style="dark" />
          <Stack
            screenOptions={{
              headerStyle: { backgroundColor: colors.card },
              headerTintColor: colors.text,
              headerTitleStyle: { fontWeight: '700' },
              headerBackTitle: '',
              contentStyle: { backgroundColor: colors.background },
            }}
          >
            <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
            <Stack.Screen name="group/[id]" options={{ title: 'الدفعة' }} />
            <Stack.Screen name="student/[id]" options={{ title: 'بيانات الطالب' }} />
          </Stack>
        </DismissalProvider>
      </SafeAreaProvider>
    </GestureHandlerRootView>
  );
}
