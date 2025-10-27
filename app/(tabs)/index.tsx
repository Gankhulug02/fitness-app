import { ThemedText } from "@/components/themed-text";
import { ThemedView } from "@/components/themed-view";
import { IconSymbol } from "@/components/ui/icon-symbol";
import { Colors } from "@/constants/theme";
import { useColorScheme } from "@/hooks/use-color-scheme";
import { supabase } from "@/lib/supabase";
import { useSupabase } from "@/lib/supabase-provider";
import { Alert, Pressable, ScrollView, StyleSheet, View } from "react-native";

export default function HomeScreen() {
  const { session } = useSupabase();
  const colorScheme = useColorScheme();
  const colors = Colors[colorScheme ?? "light"];

  // Get user's first name from email
  const userName = session?.user?.email?.split("@")[0] || "User";
  const displayName = userName.charAt(0).toUpperCase() + userName.slice(1);

  async function handleSignOut() {
    Alert.alert("Sign Out", "Are you sure you want to sign out?", [
      { text: "Cancel", style: "cancel" },
      {
        text: "Sign Out",
        style: "destructive",
        onPress: async () => {
          await supabase.auth.signOut();
        },
      },
    ]);
  }

  return (
    <ThemedView style={styles.container}>
      <ScrollView
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
      >
        {/* Header */}
        <ThemedView style={styles.header}>
          <View>
            <ThemedText type="title" style={styles.greeting}>
              Hello, {displayName}! 👋
            </ThemedText>
            <ThemedText style={styles.subtitle}>
              Ready for your workout?
            </ThemedText>
          </View>
          <Pressable
            onPress={handleSignOut}
            style={[styles.logoutButton, { borderColor: colors.icon }]}
          >
            <IconSymbol
              name="rectangle.portrait.and.arrow.right"
              size={24}
              color={colors.text}
            />
          </Pressable>
        </ThemedView>

        {/* Today's Goal Card */}
        <ThemedView style={[styles.goalCard, { backgroundColor: colors.tint }]}>
          <View style={styles.goalHeader}>
            <ThemedText style={styles.goalTitle}>Today's Goal</ThemedText>
            <IconSymbol name="target" size={32} color="#fff" />
          </View>
          <ThemedText style={styles.goalText}>
            30 minutes of exercise
          </ThemedText>
          <View style={styles.progressBar}>
            <View style={[styles.progressFill, { width: "0%" }]} />
          </View>
          <ThemedText style={styles.goalProgress}>0 / 30 minutes</ThemedText>
        </ThemedView>

        {/* Quick Actions */}
        <View style={styles.quickActions}>
          <Pressable
            style={[
              styles.actionCard,
              { backgroundColor: colors.cardBackground },
            ]}
          >
            <View
              style={[
                styles.actionIcon,
                { backgroundColor: `${colors.actionWorkout}20` },
              ]}
            >
              <IconSymbol
                name="figure.run"
                size={28}
                color={colors.actionWorkout}
              />
            </View>
            <ThemedText style={styles.actionText}>Start Workout</ThemedText>
          </Pressable>

          <Pressable
            style={[
              styles.actionCard,
              { backgroundColor: colors.cardBackground },
            ]}
          >
            <View
              style={[
                styles.actionIcon,
                { backgroundColor: `${colors.actionNutrition}20` },
              ]}
            >
              <IconSymbol
                name="fork.knife"
                size={28}
                color={colors.actionNutrition}
              />
            </View>
            <ThemedText style={styles.actionText}>Log Meal</ThemedText>
          </Pressable>

          <Pressable
            style={[
              styles.actionCard,
              { backgroundColor: colors.cardBackground },
            ]}
          >
            <View
              style={[
                styles.actionIcon,
                { backgroundColor: `${colors.actionStats}20` },
              ]}
            >
              <IconSymbol
                name="chart.bar.fill"
                size={28}
                color={colors.actionStats}
              />
            </View>
            <ThemedText style={styles.actionText}>View Stats</ThemedText>
          </Pressable>

          <Pressable
            style={[
              styles.actionCard,
              { backgroundColor: colors.cardBackground },
            ]}
          >
            <View
              style={[
                styles.actionIcon,
                { backgroundColor: `${colors.actionHealth}20` },
              ]}
            >
              <IconSymbol
                name="heart.fill"
                size={28}
                color={colors.actionHealth}
              />
            </View>
            <ThemedText style={styles.actionText}>Health</ThemedText>
          </Pressable>
        </View>

        {/* Stats Overview */}
        <ThemedView style={styles.statsSection}>
          <ThemedText type="subtitle" style={styles.sectionTitle}>
            This Week
          </ThemedText>
          <View style={styles.statsGrid}>
            <ThemedView
              style={[
                styles.statCard,
                { backgroundColor: colors.cardBackground },
              ]}
            >
              <IconSymbol
                name="flame.fill"
                size={24}
                color={colors.actionWorkout}
              />
              <ThemedText style={styles.statValue}>0</ThemedText>
              <ThemedText style={styles.statLabel}>Workouts</ThemedText>
            </ThemedView>

            <ThemedView
              style={[
                styles.statCard,
                { backgroundColor: colors.cardBackground },
              ]}
            >
              <IconSymbol
                name="clock.fill"
                size={24}
                color={colors.actionNutrition}
              />
              <ThemedText style={styles.statValue}>0h</ThemedText>
              <ThemedText style={styles.statLabel}>Duration</ThemedText>
            </ThemedView>

            <ThemedView
              style={[
                styles.statCard,
                { backgroundColor: colors.cardBackground },
              ]}
            >
              <IconSymbol
                name="bolt.fill"
                size={24}
                color={colors.actionHealth}
              />
              <ThemedText style={styles.statValue}>0</ThemedText>
              <ThemedText style={styles.statLabel}>Calories</ThemedText>
            </ThemedView>
          </View>
        </ThemedView>

        {/* Recent Activity */}
        <ThemedView style={styles.activitySection}>
          <ThemedText type="subtitle" style={styles.sectionTitle}>
            Recent Activity
          </ThemedText>
          <ThemedView
            style={[
              styles.emptyState,
              { backgroundColor: colors.cardBackground },
            ]}
          >
            <IconSymbol name="figure.walk" size={48} color={colors.icon} />
            <ThemedText style={styles.emptyText}>No workouts yet</ThemedText>
            <ThemedText style={[styles.emptySubtext, { color: colors.icon }]}>
              Start your first workout to see it here
            </ThemedText>
          </ThemedView>
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
    paddingTop: 60,
    paddingBottom: 40,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    marginBottom: 24,
  },
  greeting: {
    fontSize: 28,
    marginBottom: 4,
  },
  subtitle: {
    fontSize: 16,
    opacity: 0.7,
  },
  logoutButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    borderWidth: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  // Goal Card
  goalCard: {
    padding: 24,
    borderRadius: 20,
    marginBottom: 24,
  },
  goalHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 12,
  },
  goalTitle: {
    fontSize: 18,
    fontWeight: "700",
    color: "#fff",
  },
  goalText: {
    fontSize: 16,
    color: "#fff",
    opacity: 0.9,
    marginBottom: 16,
  },
  progressBar: {
    height: 8,
    backgroundColor: "rgba(255, 255, 255, 0.3)",
    borderRadius: 4,
    overflow: "hidden",
    marginBottom: 8,
  },
  progressFill: {
    height: "100%",
    backgroundColor: "#fff",
    borderRadius: 4,
  },
  goalProgress: {
    fontSize: 14,
    color: "#fff",
    opacity: 0.9,
  },
  // Quick Actions
  quickActions: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 12,
    marginBottom: 32,
  },
  actionCard: {
    width: "48%",
    padding: 20,
    borderRadius: 16,
    alignItems: "center",
    gap: 12,
  },
  actionIcon: {
    width: 56,
    height: 56,
    borderRadius: 28,
    justifyContent: "center",
    alignItems: "center",
  },
  actionText: {
    fontSize: 14,
    fontWeight: "600",
    textAlign: "center",
  },
  // Stats Section
  statsSection: {
    marginBottom: 32,
  },
  sectionTitle: {
    fontSize: 20,
    marginBottom: 16,
  },
  statsGrid: {
    flexDirection: "row",
    gap: 12,
  },
  statCard: {
    flex: 1,
    padding: 20,
    borderRadius: 16,
    alignItems: "center",
    gap: 8,
  },
  statValue: {
    fontSize: 24,
    fontWeight: "700",
  },
  statLabel: {
    fontSize: 12,
    opacity: 0.7,
  },
  // Activity Section
  activitySection: {
    marginBottom: 20,
  },
  emptyState: {
    padding: 40,
    borderRadius: 16,
    alignItems: "center",
    gap: 12,
  },
  emptyText: {
    fontSize: 16,
    fontWeight: "600",
  },
  emptySubtext: {
    fontSize: 14,
    textAlign: "center",
  },
});
