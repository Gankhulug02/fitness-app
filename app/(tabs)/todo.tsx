import { ThemedText } from "@/components/themed-text";
import { ThemedView } from "@/components/themed-view";
import { IconSymbol } from "@/components/ui/icon-symbol";
import { Colors } from "@/constants/theme";
import { useColorScheme } from "@/hooks/use-color-scheme";
import { LinearGradient } from "expo-linear-gradient";
import { useState } from "react";
import {
  Alert,
  FlatList,
  Pressable,
  ScrollView,
  StyleSheet,
  TextInput,
  View,
} from "react-native";

type WorkoutSet = {
  reps: number;
  completed: boolean;
};

type Workout = {
  id: string;
  name: string;
  emoji: string;
  completed: boolean;
  date: string; // YYYY-MM-DD format
  sets: WorkoutSet[];
};

type WeekDay = {
  date: Date;
  dayName: string;
  dayNumber: number;
  month: string;
  isToday: boolean;
  dateString: string;
};

export default function TodoScreen() {
  const colorScheme = useColorScheme();
  const colors = Colors[colorScheme ?? "light"];

  const today = new Date();
  const todayString = today.toISOString().split("T")[0];

  const [selectedDate, setSelectedDate] = useState<string>(todayString);
  const [workouts, setWorkouts] = useState<Workout[]>([
    {
      id: "1",
      name: "Workout",
      emoji: "🏋️",
      completed: false,
      date: todayString,
      sets: [
        { reps: 10, completed: false },
        { reps: 10, completed: false },
        { reps: 10, completed: false },
      ],
    },
  ]);
  const [showInput, setShowInput] = useState(false);
  const [newWorkout, setNewWorkout] = useState("");
  const [numSets, setNumSets] = useState("3");
  const [numReps, setNumReps] = useState("10");
  const [collapsed, setCollapsed] = useState(false);

  // Generate week days
  const getWeekDays = (): WeekDay[] => {
    const days: WeekDay[] = [];
    const startOfWeek = new Date(today);
    startOfWeek.setDate(today.getDate() - today.getDay() + 1); // Start from Monday

    for (let i = 0; i < 7; i++) {
      const date = new Date(startOfWeek);
      date.setDate(startOfWeek.getDate() + i);
      const dateString = date.toISOString().split("T")[0];

      days.push({
        date,
        dayName: date.toLocaleDateString("en-US", { weekday: "short" }),
        dayNumber: date.getDate(),
        month: date.toLocaleDateString("en-US", { month: "short" }),
        isToday: dateString === todayString,
        dateString,
      });
    }

    return days;
  };

  const weekDays = getWeekDays();

  const addWorkout = () => {
    if (newWorkout.trim()) {
      const sets = parseInt(numSets) || 3;
      const reps = parseInt(numReps) || 10;

      const newItem: Workout = {
        id: Date.now().toString(),
        name: newWorkout.trim(),
        emoji: "💪",
        completed: false,
        date: selectedDate,
        sets: Array(sets)
          .fill(null)
          .map(() => ({
            reps,
            completed: false,
          })),
      };
      setWorkouts([...workouts, newItem]);
      setNewWorkout("");
      setNumSets("3");
      setNumReps("10");
      setShowInput(false);
    }
  };

  const toggleWorkout = (id: string) => {
    setWorkouts(
      workouts.map((workout) => {
        if (workout.id === id) {
          const allCompleted = workout.sets.every((set) => set.completed);
          const newSets = workout.sets.map((set) => ({
            ...set,
            completed: !allCompleted,
          }));
          return {
            ...workout,
            completed: !allCompleted,
            sets: newSets,
          };
        }
        return workout;
      })
    );
  };

  const completeNextSet = (workoutId: string) => {
    setWorkouts(
      workouts.map((workout) => {
        if (workout.id === workoutId) {
          // Check if all sets are already completed
          const allCompleted = workout.sets.every((set) => set.completed);

          if (allCompleted) {
            // Reset all sets to uncompleted
            const newSets = workout.sets.map((set) => ({
              ...set,
              completed: false,
            }));
            return {
              ...workout,
              sets: newSets,
              completed: false,
            };
          } else {
            // Find the first uncompleted set and complete it
            const nextSetIndex = workout.sets.findIndex(
              (set) => !set.completed
            );

            if (nextSetIndex !== -1) {
              const newSets = workout.sets.map((set, idx) =>
                idx === nextSetIndex ? { ...set, completed: true } : set
              );
              const allNowCompleted = newSets.every((set) => set.completed);
              return {
                ...workout,
                sets: newSets,
                completed: allNowCompleted,
              };
            }
          }
        }
        return workout;
      })
    );
  };

  const deleteWorkout = (id: string) => {
    Alert.alert(
      "Delete Workout",
      "Are you sure you want to delete this workout?",
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Delete",
          style: "destructive",
          onPress: () =>
            setWorkouts(workouts.filter((workout) => workout.id !== id)),
        },
      ]
    );
  };

  const todaysWorkouts = workouts.filter((w) => w.date === selectedDate);

  return (
    <View style={styles.container}>
      {/* Gradient Header */}
      <LinearGradient
        colors={
          colorScheme === "dark"
            ? ["#2C2C2E", "#1C1C1E"]
            : ["#FFC9A8", "#FFB088", "#FF9D6F"]
        }
        style={styles.gradientHeader}
      >
        <View style={styles.headerContent}>
          <View>
            <ThemedText style={styles.todayTitle}>
              {selectedDate === todayString
                ? "Today"
                : new Date(selectedDate + "T00:00:00").toLocaleDateString(
                    "en-US",
                    { weekday: "long" }
                  )}
            </ThemedText>
            <ThemedText style={styles.dateSubtitle}>
              {new Date(selectedDate + "T00:00:00").toLocaleDateString(
                "en-US",
                {
                  month: "long",
                  day: "numeric",
                }
              ) + "th"}
            </ThemedText>
          </View>
          <View style={styles.headerIcons}>
            <IconSymbol
              name="calendar"
              size={28}
              color={colorScheme === "dark" ? "#fff" : "#fff"}
            />
          </View>
        </View>

        {/* Week Calendar */}
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          style={styles.calendarScroll}
          contentContainerStyle={styles.calendarContent}
        >
          {weekDays.map((day, index) => {
            const isSelected = day.dateString === selectedDate;
            const isToday = day.isToday;

            return (
              <Pressable
                key={day.dateString}
                style={[
                  styles.dayCard,
                  isToday && styles.dayCardToday,
                  isSelected && !isToday && styles.dayCardSelected,
                  {
                    backgroundColor: isToday
                      ? "#fff"
                      : isSelected
                      ? colorScheme === "dark"
                        ? "rgba(255,255,255,0.25)"
                        : "rgba(255,255,255,0.5)"
                      : colorScheme === "dark"
                      ? "rgba(255,255,255,0.1)"
                      : "rgba(0,0,0,0.15)",
                    borderWidth: isSelected && !isToday ? 2 : 0,
                    borderColor:
                      isSelected && !isToday ? "#fff" : "transparent",
                  },
                ]}
                onPress={() => setSelectedDate(day.dateString)}
              >
                {index === 0 && !isToday && (
                  <ThemedText style={styles.monthLabel}>{day.month}</ThemedText>
                )}
                <ThemedText
                  style={[styles.dayName, { color: isToday ? "#000" : "#fff" }]}
                >
                  {day.dayName}
                </ThemedText>
                <ThemedText
                  style={[
                    styles.dayNumber,
                    { color: isToday ? "#000" : "#fff" },
                  ]}
                >
                  {day.dayNumber}
                </ThemedText>
              </Pressable>
            );
          })}
        </ScrollView>
      </LinearGradient>

      {/* Content */}
      <ThemedView style={styles.content}>
        {/* WORKOUTS Header */}
        <View style={styles.sectionHeaderRow}>
          <Pressable
            style={styles.sectionHeader}
            onPress={() => setCollapsed(!collapsed)}
          >
            <ThemedText style={styles.sectionTitle}>WORKOUTS</ThemedText>
            <IconSymbol
              name={collapsed ? "chevron.down" : "chevron.up"}
              size={20}
              color={colors.text}
            />
          </Pressable>

          <Pressable
            style={[styles.addNewButton, { backgroundColor: colors.tint }]}
            onPress={() => setShowInput(!showInput)}
          >
            <IconSymbol
              name={showInput ? "xmark" : "plus"}
              size={20}
              color="#fff"
            />
          </Pressable>
        </View>

        {/* Add Workout Input */}
        {showInput && !collapsed && (
          <ThemedView
            style={[
              styles.inputContainer,
              { backgroundColor: colors.cardBackground },
            ]}
          >
            <TextInput
              style={[
                styles.input,
                {
                  color: colors.text,
                  borderColor: colors.icon,
                },
              ]}
              placeholder="Exercise name..."
              placeholderTextColor={colors.icon}
              value={newWorkout}
              onChangeText={setNewWorkout}
              autoFocus
            />
            <View style={styles.setsRepsRow}>
              <View style={styles.inputGroup}>
                <ThemedText style={styles.inputLabel}>Sets</ThemedText>
                <TextInput
                  style={[
                    styles.smallInput,
                    {
                      color: colors.text,
                      borderColor: colors.icon,
                      backgroundColor: colors.background,
                    },
                  ]}
                  placeholder="3"
                  placeholderTextColor={colors.icon}
                  value={numSets}
                  onChangeText={setNumSets}
                  keyboardType="number-pad"
                  maxLength={2}
                />
              </View>
              <View style={styles.inputGroup}>
                <ThemedText style={styles.inputLabel}>Reps</ThemedText>
                <TextInput
                  style={[
                    styles.smallInput,
                    {
                      color: colors.text,
                      borderColor: colors.icon,
                      backgroundColor: colors.background,
                    },
                  ]}
                  placeholder="10"
                  placeholderTextColor={colors.icon}
                  value={numReps}
                  onChangeText={setNumReps}
                  keyboardType="number-pad"
                  maxLength={3}
                />
              </View>
              <Pressable
                style={[styles.submitButton, { backgroundColor: colors.tint }]}
                onPress={addWorkout}
              >
                <IconSymbol name="checkmark" size={20} color="#fff" />
              </Pressable>
            </View>
          </ThemedView>
        )}

        {/* Workout List */}
        {!collapsed && (
          <FlatList
            data={todaysWorkouts}
            keyExtractor={(item) => item.id}
            contentContainerStyle={styles.listContent}
            showsVerticalScrollIndicator={false}
            renderItem={({ item }) => {
              const completedSets = item.sets.filter((s) => s.completed).length;
              const totalSets = item.sets.length;

              return (
                <Pressable
                  style={[
                    styles.workoutCard,
                    {
                      backgroundColor:
                        colorScheme === "dark" ? "#2C2C2E" : "#3A3A3C",
                    },
                  ]}
                  onPress={() => completeNextSet(item.id)}
                  onLongPress={() => deleteWorkout(item.id)}
                >
                  {/* Progress Bar - Full Width */}
                  <View style={styles.progressBarContainer}>
                    <View
                      style={[
                        styles.progressBar,
                        {
                          width: `${(completedSets / totalSets) * 100}%`,
                          backgroundColor: item.completed
                            ? "#4CD964"
                            : "#FF9500",
                        },
                      ]}
                    />
                  </View>

                  <View style={styles.workoutContent}>
                    <View style={styles.workoutMainRow}>
                      <View style={styles.workoutLeft}>
                        <Pressable
                          style={[
                            styles.checkbox,
                            {
                              borderColor: item.completed
                                ? "#4CD964"
                                : "#8E8E93",
                              backgroundColor: item.completed
                                ? "#4CD964"
                                : "transparent",
                            },
                          ]}
                          onPress={(e) => {
                            e.stopPropagation();
                            toggleWorkout(item.id);
                          }}
                        >
                          {item.completed && (
                            <IconSymbol
                              name="checkmark"
                              size={16}
                              color="#fff"
                            />
                          )}
                        </Pressable>

                        <ThemedText style={styles.emoji}>
                          {item.emoji}
                        </ThemedText>

                        <View style={styles.workoutInfo}>
                          <ThemedText
                            style={[
                              styles.workoutName,
                              { color: "#fff" },
                              item.completed && styles.workoutNameCompleted,
                            ]}
                          >
                            {item.name}
                          </ThemedText>
                          <ThemedText
                            style={[styles.setsInfo, { color: "#8E8E93" }]}
                          >
                            {item.sets[0]?.reps} reps × {totalSets} sets
                          </ThemedText>
                        </View>
                      </View>

                      <View style={styles.workoutRight}>
                        <ThemedText
                          style={[styles.progress, { color: "#8E8E93" }]}
                        >
                          {completedSets}/{totalSets}
                        </ThemedText>
                    </View>
                  </View>
                  </View>
                </Pressable>
              );
            }}
            ListEmptyComponent={
              <ThemedView
                style={[
                  styles.emptyState,
                  { backgroundColor: colors.cardBackground },
                ]}
              >
                <IconSymbol name="figure.walk" size={64} color={colors.icon} />
                <ThemedText style={styles.emptyText}>
                  No workouts yet
                </ThemedText>
                <ThemedText
                  style={[styles.emptySubtext, { color: colors.icon }]}
                >
                  Tap the calendar icon to add your first workout
                </ThemedText>
              </ThemedView>
            }
          />
        )}
      </ThemedView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  gradientHeader: {
    paddingTop: 60,
    paddingBottom: 20,
    paddingHorizontal: 20,
  },
  headerContent: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    marginBottom: 24,
  },
  todayTitle: {
    fontSize: 36,
    fontWeight: "700",
    color: "#fff",
    marginBottom: 4,
  },
  dateSubtitle: {
    fontSize: 18,
    color: "rgba(255,255,255,0.8)",
  },
  headerIcons: {
    flexDirection: "row",
    gap: 16,
  },
  calendarScroll: {
    marginHorizontal: -20,
  },
  calendarContent: {
    paddingHorizontal: 20,
    gap: 8,
  },
  dayCard: {
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 16,
    alignItems: "center",
    justifyContent: "center",
    minWidth: 70,
    position: "relative",
  },
  dayCardToday: {
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 4,
  },
  dayCardSelected: {
    shadowColor: "#fff",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 4,
  },
  monthLabel: {
    position: "absolute",
    top: 4,
    fontSize: 10,
    color: "#fff",
    fontWeight: "600",
  },
  dayName: {
    fontSize: 13,
    fontWeight: "500",
    marginBottom: 4,
  },
  dayNumber: {
    fontSize: 20,
    fontWeight: "700",
  },
  content: {
    flex: 1,
    paddingTop: 20,
  },
  sectionHeaderRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 20,
    paddingVertical: 12,
  },
  sectionHeader: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    flex: 1,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: "700",
    letterSpacing: 1,
  },
  addNewButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    justifyContent: "center",
    alignItems: "center",
  },
  inputContainer: {
    marginHorizontal: 20,
    marginBottom: 16,
    padding: 16,
    borderRadius: 16,
    gap: 12,
  },
  input: {
    height: 40,
    fontSize: 16,
    paddingHorizontal: 0,
  },
  setsRepsRow: {
    flexDirection: "row",
    alignItems: "flex-end",
    gap: 12,
  },
  inputGroup: {
    flex: 1,
    gap: 6,
  },
  inputLabel: {
    fontSize: 12,
    fontWeight: "600",
    opacity: 0.7,
  },
  smallInput: {
    height: 40,
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 12,
    fontSize: 16,
    textAlign: "center",
  },
  submitButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: "center",
    alignItems: "center",
  },
  listContent: {
    paddingHorizontal: 20,
    paddingBottom: 20,
    gap: 12,
  },
  workoutCard: {
    borderRadius: 16,
    overflow: "hidden",
  },
  progressBarContainer: {
    height: 4,
    backgroundColor: "rgba(142, 142, 147, 0.3)",
    width: "100%",
  },
  progressBar: {
    height: "100%",
  },
  workoutContent: {
    padding: 16,
    gap: 12,
  },
  workoutMainRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  workoutLeft: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
  },
  workoutInfo: {
    flex: 1,
    gap: 4,
  },
  checkbox: {
    width: 28,
    height: 28,
    borderRadius: 14,
    borderWidth: 2,
    justifyContent: "center",
    alignItems: "center",
  },
  emoji: {
    fontSize: 24,
  },
  workoutName: {
    fontSize: 16,
    fontWeight: "500",
  },
  workoutNameCompleted: {
    textDecorationLine: "line-through",
    opacity: 0.5,
  },
  setsInfo: {
    fontSize: 13,
  },
  workoutRight: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
  },
  progress: {
    fontSize: 14,
    fontWeight: "500",
  },
  emptyState: {
    padding: 48,
    borderRadius: 16,
    alignItems: "center",
    gap: 12,
    marginTop: 32,
  },
  emptyText: {
    fontSize: 18,
    fontWeight: "600",
  },
  emptySubtext: {
    fontSize: 14,
    textAlign: "center",
  },
});
