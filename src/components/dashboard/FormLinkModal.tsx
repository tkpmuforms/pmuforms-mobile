import { Check, Copy, X } from 'lucide-react-native';
import React, { useState } from 'react';
import {
  Modal,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Clipboard from '@react-native-clipboard/clipboard';

interface FormLinkModalProps {
  visible: boolean;
  onClose: () => void;
  businessUri: string;
}

const FormLinkModal: React.FC<FormLinkModalProps> = ({
  visible,
  onClose,
  businessUri,
}) => {
  const [copied, setCopied] = useState(false);

  const formLink = `https://business.pmuforms.com/#/${businessUri}`;

  const handleCopyLink = () => {
    Clipboard.setString(formLink);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

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
            <View style={styles.header}>
              <Text style={styles.title}>Your Business Form Link</Text>
              <TouchableOpacity style={styles.closeButton} onPress={onClose}>
                <X size={24} color="#6b7280" />
              </TouchableOpacity>
            </View>

            <View style={styles.content}>
              <Text style={styles.subtitle}>
                Share this link with your Clients
              </Text>

              <Text style={styles.description}>
                The Link to your business's form page that you can share with
                your clients is:
              </Text>

              <View style={styles.linkContainer}>
                <TextInput
                  style={styles.linkInput}
                  value={formLink}
                  editable={false}
                  multiline
                />
                <TouchableOpacity
                  style={styles.copyIconButton}
                  onPress={handleCopyLink}
                >
                  {copied ? (
                    <Check size={16} color={colors.primary} />
                  ) : (
                    <Copy size={16} color="#6b7280" />
                  )}
                </TouchableOpacity>
              </View>

              <Text style={styles.instruction}>
                Copy and paste this link into your appointment confirmation
                email.
              </Text>

              <View style={styles.divider} />

              <TouchableOpacity
                style={styles.copyButton}
                onPress={handleCopyLink}
              >
                <Text style={styles.copyButtonText}>
                  {copied ? 'Copied!' : 'Copy to Clipboard'}
                </Text>
              </TouchableOpacity>
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
    maxHeight: '90%',
    overflow: 'hidden',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 24,
    paddingVertical: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#e5e7eb',
  },
  title: {
    fontSize: 20,
    fontWeight: '600',
    color: '#111827',
    flex: 1,
  },
  closeButton: {
    padding: 8,
    marginLeft: 12,
  },
  content: {
    padding: 24,
  },
  subtitle: {
    fontSize: 14,
    color: '#6b7280',
    marginBottom: 16,
    textAlign: 'center',
  },
  description: {
    fontSize: 14,
    color: '#374151',
    marginBottom: 20,
    lineHeight: 20,
  },
  linkContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#F4EAF4',
    borderRadius: 8,
    backgroundColor: '#F4EAF4',
    marginBottom: 16,
    paddingRight: 12,
  },
  linkInput: {
    flex: 1,
    padding: 12,
    fontSize: 14,
    color: colors.primary,
    fontFamily: 'monospace',
  },
  copyIconButton: {
    padding: 8,
  },
  instruction: {
    fontSize: 14,
    color: '#6b7280',
    marginBottom: 24,
    lineHeight: 20,
  },
  divider: {
    height: 1,
    backgroundColor: '#e5e7eb',
    marginBottom: 24,
  },
  copyButton: {
    backgroundColor: colors.primary,
    paddingVertical: 16,
    paddingHorizontal: 32,
    borderRadius: 12,
    alignItems: 'center',
    shadowColor: colors.primary,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 15,
    elevation: 4,
  },
  copyButtonText: {
    color: colors.white,
    fontSize: 16,
    fontWeight: '600',
  },
});

export default FormLinkModal;
