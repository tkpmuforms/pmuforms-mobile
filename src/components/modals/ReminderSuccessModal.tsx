import React from "react";
import {
  View,
  Text,
  Modal,
  TouchableOpacity,
  StyleSheet,
  Pressable,
} from "react-native";
import { CheckCircle } from "lucide-react-native";

interface ReminderSuccessModalProps {
  visible: boolean;
  onClose: () => void;
  clientName: string;
  reminderDate: string;
  onViewAppointments: () => void;
  onGoToDashboard: () => void;
}

const ReminderSuccessModal: React.FC<ReminderSuccessModalProps> = ({
  visible,
  onClose,
  clientName,
  reminderDate,
  onViewAppointments,
  onGoToDashboard,
}) => {
  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      onRequestClose={onClose}
    >
      <View style={styles.modalOverlay}>
        <Pressable style={styles.backdrop} onPress={onClose} />
        <View style={styles.modalContent}>
          <View style={styles.successIcon}>
            <View style={styles.iconCircle}>
              <CheckCircle size={48} color="#22C55E" />
            </View>
          </View>

          <Text style={styles.title}>Reminder Set Successfully</Text>
          <Text style={styles.message}>
            A Check-in Reminder for <Text style={styles.bold}>{clientName}</Text>{" "}
            has been set for <Text style={styles.bold}>{reminderDate}</Text>.
            You'll receive a notifications in future
          </Text>

          <View style={styles.actions}>
            <TouchableOpacity
              style={styles.secondaryButton}
              onPress={onViewAppointments}
            >
              <Text style={styles.secondaryButtonText}>
                View Client's Appointment
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.primaryButton}
              onPress={onGoToDashboard}
            >
              <Text style={styles.primaryButtonText}>Go to Dashboard</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  modalOverlay: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0.5)",
  },
  backdrop: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
  },
  modalContent: {
    backgroundColor: "white",
    borderRadius: 20,
    padding: 40,
    width: "90%",
    maxWidth: 500,
    alignItems: "center",
  },
  successIcon: {
    marginBottom: 24,
  },
  iconCircle: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: "#dcfce7",
    justifyContent: "center",
    alignItems: "center",
  },
  title: {
    fontSize: 24,
    fontWeight: "600",
    color: "#1e293b",
    marginBottom: 8,
    textAlign: "center",
  },
  message: {
    fontSize: 16,
    color: "#64748b",
    marginBottom: 32,
    lineHeight: 24,
    textAlign: "center",
  },
  bold: {
    fontWeight: "600",
    color: "#1e293b",
  },
  actions: {
    width: "100%",
    gap: 16,
  },
  secondaryButton: {
    width: "100%",
    backgroundColor: "transparent",
    borderWidth: 1,
    borderColor: "#e2e8f0",
    padding: 14,
    borderRadius: 12,
    alignItems: "center",
  },
  secondaryButtonText: {
    color: "#64748b",
    fontWeight: "500",
    fontSize: 16,
  },
  primaryButton: {
    width: "100%",
    backgroundColor: "#8e2d8e",
    padding: 14,
    borderRadius: 12,
    alignItems: "center",
  },
  primaryButtonText: {
    color: "white",
    fontWeight: "600",
    fontSize: 16,
  },
});

export default ReminderSuccessModal;
