import { X } from 'lucide-react-native';
import React from 'react';
import {
  Modal,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { colors } from '../../theme/colors';

interface FeaturesModalProps {
  visible: boolean;
  onClose: () => void;
}

const FeaturesModal: React.FC<FeaturesModalProps> = ({ visible, onClose }) => {
  return (
    <Modal
      visible={visible}
      transparent
      animationType="slide"
      onRequestClose={onClose}
    >
      <SafeAreaView style={styles.container}>
        <View style={styles.overlay}>
          <View style={styles.modal}>
            <TouchableOpacity style={styles.closeButton} onPress={onClose}>
              <X size={20} color={colors.subtitleColor} />
            </TouchableOpacity>

            <View style={styles.content}>
              <Text style={styles.title}>Subscription Required</Text>
              <Text style={styles.messageText}>
                To access all features, please subscribe to a plan.
              </Text>
              <Text style={styles.messageText}>
                You can manage your account and subscription at
              </Text>
              <Text style={styles.linkText}>artist.pmuforms.com</Text>
            </View>
          </View>
        </View>
      </SafeAreaView>
    </Modal>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'flex-end',
  },
  modal: {
    backgroundColor: colors.white,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    paddingTop: 10,
  },
  closeButton: {
    position: 'absolute',
    top: 20,
    right: 20,
    zIndex: 10,
    padding: 8,
    borderRadius: 8,
  },
  content: {
    alignItems: 'center',
    padding: 32,
    gap: 12,
  },
  title: {
    fontSize: 22,
    fontWeight: '700',
    color: '#000',
    marginBottom: 8,
    textAlign: 'center',
  },
  messageText: {
    fontSize: 15,
    color: colors.subtitleColor,
    lineHeight: 22,
    textAlign: 'center',
  },
  linkText: {
    fontSize: 15,
    fontWeight: '600',
    color: colors.primary,
    lineHeight: 22,
    textDecorationLine: 'underline',
  },
});

export default FeaturesModal;
