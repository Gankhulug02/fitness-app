import { ThemedText } from "@/components/themed-text";
import { ThemedView } from "@/components/themed-view";
import { IconSymbol } from "@/components/ui/icon-symbol";
import { Colors } from "@/constants/theme";
import { useColorScheme } from "@/hooks/use-color-scheme";
import { ScrollView, StyleSheet } from "react-native";

export default function ExploreScreen() {
  const colorScheme = useColorScheme();
  const colors = Colors[colorScheme ?? "light"];

  return (
    <ThemedView style={styles.container}>
      <ScrollView contentContainerStyle={styles.content}>
        <ThemedView style={styles.header}>
          <ThemedText type="title">Explore</ThemedText>
        </ThemedView>

        <ThemedView style={styles.card}>
          <IconSymbol
            size={48}
            name="figure.run"
            color={colors.tint}
            style={styles.icon}
          />
          <ThemedText type="subtitle">Workouts</ThemedText>
          <ThemedText style={styles.cardText}>
            Browse and create custom workout routines
          </ThemedText>
        </ThemedView>

        <ThemedView style={styles.card}>
          <IconSymbol
            size={48}
            name="chart.line.uptrend.xyaxis"
            color={colors.tint}
            style={styles.icon}
          />
          <ThemedText type="subtitle">Progress</ThemedText>
          <ThemedText style={styles.cardText}>
            Track your fitness journey and see your improvements
          </ThemedText>
        </ThemedView>

        <ThemedView style={styles.card}>
          <IconSymbol
            size={48}
            name="list.bullet.clipboard"
            color={colors.tint}
            style={styles.icon}
          />
          <ThemedText type="subtitle">Exercise Library</ThemedText>
          <ThemedText style={styles.cardText}>
            Discover new exercises and learn proper form
          </ThemedText>
        </ThemedView>
      </ScrollView>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    padding: 20,
    gap: 20,
  },
  header: {
    paddingVertical: 20,
  },
  card: {
    padding: 24,
    borderRadius: 16,
    gap: 12,
    alignItems: "center",
  },
  icon: {
    marginBottom: 8,
  },
  cardText: {
    opacity: 0.8,
    textAlign: "center",
  },
});
