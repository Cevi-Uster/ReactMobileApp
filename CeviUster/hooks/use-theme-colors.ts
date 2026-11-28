import { useColorScheme } from 'react-native';
import { Colors, ThemeColors } from '@/constants/Colors';

export function useThemeColors(): ThemeColors {
  return useColorScheme() === 'dark' ? Colors.dark : Colors.light;
}
