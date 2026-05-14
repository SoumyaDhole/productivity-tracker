import { Ionicons } from "@expo/vector-icons";
import React, { useCallback, useEffect, useState } from "react";
import {
  ActivityIndicator,
  KeyboardAvoidingView,
  Modal,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import type { GoalRow, TaskInsert, TaskPriority } from "@/src/types/database";
import { localTodayYmd } from "@/src/utils/dateYmd";

const PRIORITIES: TaskPriority[] = ["High", "Med", "Low"];

const DUE_PRESETS: readonly string[] = [
  "8am",
  "10am",
  "12pm",
  "2pm",
  "5pm",
  "7pm",
  "9pm",
] as const;

interface AddTaskSheetProps {
  visible: boolean;
  onClose: () => void;
  userId: string;
  goals: GoalRow[];
  onSave: (insert: TaskInsert) => Promise<void>;
}

const AddTaskSheet: React.FC<AddTaskSheetProps> = ({
  visible,
  onClose,
  userId,
  goals,
  onSave,
}) => {
  const [title, setTitle] = useState("");
  const [selectedGoalId, setSelectedGoalId] = useState<string | null>(null);
  const [priority, setPriority] = useState<TaskPriority>("Med");
  const [dueTime, setDueTime] = useState<string | null>(null);
  const [validationError, setValidationError] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (!visible) {
      setTitle("");
      setSelectedGoalId(null);
      setPriority("Med");
      setDueTime(null);
      setValidationError(null);
      setSaving(false);
    }
  }, [visible]);

  const handleSave = useCallback(async () => {
    const trimmed = title.trim();
    if (trimmed.length === 0) {
      setValidationError("Please enter a task title.");
      return;
    }
    if (trimmed.length > 200) {
      setValidationError("Title must be 200 characters or less.");
      return;
    }
    setValidationError(null);
    setSaving(true);
    const insert: TaskInsert = {
      user_id: userId,
      title: trimmed,
      goal_id: selectedGoalId,
      priority,
      due_time: dueTime ?? null,
      date: localTodayYmd(),
      completed: false,
    };
    try {
      await onSave(insert);
      onClose();
    } catch {
      setValidationError("Could not save task. Try again.");
    } finally {
      setSaving(false);
    }
  }, [title, userId, selectedGoalId, priority, dueTime, onSave, onClose]);

  return (
    <Modal
      visible={visible}
      animationType="slide"
      transparent
      onRequestClose={onClose}
    >
      <KeyboardAvoidingView
        style={styles.overlay}
        behavior={Platform.OS === "ios" ? "padding" : undefined}
      >
        <Pressable style={styles.backdrop} onPress={onClose} />
        <View style={styles.sheet}>
          <View style={styles.handleRow}>
            <View style={styles.handle} />
          </View>
          <View style={styles.sheetHeader}>
            <Text style={styles.sheetTitle}>New task</Text>
            <TouchableOpacity onPress={onClose} hitSlop={12}>
              <Ionicons name="close" size={22} color="#888888" />
            </TouchableOpacity>
          </View>

          <ScrollView
            keyboardShouldPersistTaps="handled"
            showsVerticalScrollIndicator={false}
            contentContainerStyle={styles.sheetBody}
          >
            {validationError ? (
              <Text style={styles.validationText}>{validationError}</Text>
            ) : null}

            <Text style={styles.fieldLabel}>Title</Text>
            <TextInput
              style={styles.input}
              placeholder="What needs to be done?"
              placeholderTextColor="#555555"
              value={title}
              onChangeText={setTitle}
              editable={!saving}
              maxLength={200}
            />

            <Text style={styles.fieldLabel}>Goal</Text>
            <ScrollView
              horizontal
              showsHorizontalScrollIndicator={false}
              style={styles.chipScroll}
            >
              <TouchableOpacity
                style={[
                  styles.chip,
                  selectedGoalId === null && styles.chipActive,
                ]}
                onPress={() => setSelectedGoalId(null)}
                disabled={saving}
              >
                <Text
                  style={[
                    styles.chipText,
                    selectedGoalId === null && styles.chipTextActive,
                  ]}
                >
                  No goal
                </Text>
              </TouchableOpacity>
              {goals.map((g) => (
                <TouchableOpacity
                  key={g.id}
                  style={[
                    styles.chip,
                    selectedGoalId === g.id && styles.chipActive,
                  ]}
                  onPress={() => setSelectedGoalId(g.id)}
                  disabled={saving}
                >
                  <Text
                    style={[
                      styles.chipText,
                      selectedGoalId === g.id && styles.chipTextActive,
                    ]}
                  >
                    {g.title}
                  </Text>
                </TouchableOpacity>
              ))}
            </ScrollView>

            <Text style={styles.fieldLabel}>Priority</Text>
            <View style={styles.priorityRow}>
              {PRIORITIES.map((p) => (
                <TouchableOpacity
                  key={p}
                  style={[
                    styles.priorityBtn,
                    priority === p && styles.priorityBtnActive,
                  ]}
                  onPress={() => setPriority(p)}
                  disabled={saving}
                >
                  <Text
                    style={[
                      styles.priorityBtnText,
                      priority === p && styles.priorityBtnTextActive,
                    ]}
                  >
                    {p}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>

            <Text style={styles.fieldLabel}>Due time</Text>
            <ScrollView
              horizontal
              showsHorizontalScrollIndicator={false}
              style={styles.chipScroll}
            >
              <TouchableOpacity
                style={[styles.chip, dueTime === null && styles.chipActive]}
                onPress={() => setDueTime(null)}
                disabled={saving}
              >
                <Text
                  style={[
                    styles.chipText,
                    dueTime === null && styles.chipTextActive,
                  ]}
                >
                  None
                </Text>
              </TouchableOpacity>
              {DUE_PRESETS.map((preset) => (
                <TouchableOpacity
                  key={preset}
                  style={[
                    styles.chip,
                    dueTime === preset && styles.chipActive,
                  ]}
                  onPress={() => setDueTime(preset)}
                  disabled={saving}
                >
                  <Text
                    style={[
                      styles.chipText,
                      dueTime === preset && styles.chipTextActive,
                    ]}
                  >
                    {preset}
                  </Text>
                </TouchableOpacity>
              ))}
            </ScrollView>

            <TouchableOpacity
              style={[styles.saveBtn, saving && styles.saveBtnDisabled]}
              onPress={() => void handleSave()}
              disabled={saving}
            >
              {saving ? (
                <ActivityIndicator color="#FFFFFF" />
              ) : (
                <Text style={styles.saveBtnText}>Save task</Text>
              )}
            </TouchableOpacity>
          </ScrollView>
        </View>
      </KeyboardAvoidingView>
    </Modal>
  );
};

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    justifyContent: "flex-end",
  },
  backdrop: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: "rgba(0,0,0,0.55)",
  },
  sheet: {
    backgroundColor: "#111118",
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    paddingBottom: 28,
    maxHeight: "88%",
  },
  handleRow: {
    alignItems: "center",
    paddingTop: 10,
  },
  handle: {
    width: 40,
    height: 4,
    borderRadius: 2,
    backgroundColor: "#2a2a3a",
  },
  sheetHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 20,
    paddingTop: 8,
    paddingBottom: 12,
  },
  sheetTitle: {
    fontSize: 18,
    fontWeight: "700",
    color: "#FFFFFF",
  },
  sheetBody: {
    paddingHorizontal: 20,
    paddingBottom: 16,
  },
  validationText: {
    color: "#F87171",
    fontSize: 13,
    marginBottom: 10,
    textAlign: "center",
  },
  fieldLabel: {
    fontSize: 11,
    fontWeight: "600",
    color: "#555555",
    textTransform: "uppercase",
    letterSpacing: 0.5,
    marginBottom: 8,
    marginTop: 4,
  },
  input: {
    backgroundColor: "#0D0D18",
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "#1E1E2A",
    paddingHorizontal: 14,
    paddingVertical: 12,
    fontSize: 15,
    color: "#FFFFFF",
    marginBottom: 4,
  },
  chipScroll: {
    marginBottom: 4,
    maxHeight: 40,
  },
  chip: {
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 99,
    backgroundColor: "#0D0D18",
    marginRight: 8,
    borderWidth: 1,
    borderColor: "#1E1E2A",
  },
  chipActive: {
    backgroundColor: "#7C3AED",
    borderColor: "#7C3AED",
  },
  chipText: {
    fontSize: 12,
    fontWeight: "600",
    color: "#888888",
  },
  chipTextActive: {
    color: "#FFFFFF",
  },
  priorityRow: {
    flexDirection: "row",
    gap: 8,
    marginBottom: 8,
  },
  priorityBtn: {
    flex: 1,
    paddingVertical: 10,
    borderRadius: 10,
    backgroundColor: "#0D0D18",
    borderWidth: 1,
    borderColor: "#1E1E2A",
    alignItems: "center",
  },
  priorityBtnActive: {
    borderColor: "#7C3AED",
    backgroundColor: "#1E1030",
  },
  priorityBtnText: {
    fontSize: 13,
    fontWeight: "600",
    color: "#777777",
  },
  priorityBtnTextActive: {
    color: "#FFFFFF",
  },
  saveBtn: {
    marginTop: 20,
    backgroundColor: "#7C3AED",
    borderRadius: 14,
    paddingVertical: 14,
    alignItems: "center",
  },
  saveBtnDisabled: {
    opacity: 0.7,
  },
  saveBtnText: {
    fontSize: 15,
    fontWeight: "700",
    color: "#FFFFFF",
  },
});

export default AddTaskSheet;
