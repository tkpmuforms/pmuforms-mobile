import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  Modal,
  ScrollView,
  TouchableOpacity,
  Linking,
} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import { SafeAreaView } from 'react-native-safe-area-context';
import {
  X,
  Edit,
  FileText,
  Link as LinkIcon,
  PenTool,
  StickyNote,
  BookTemplate,
  Mail,
  Users,
  Crown,
} from 'lucide-react-native';
import { colors } from '../../theme/colors';

interface FeaturesModalProps {
  visible: boolean;
  onClose: () => void;
}

const FeaturesModal: React.FC<FeaturesModalProps> = ({ visible, onClose }) => {
  const features = [
    {
      icon: Edit,
      title: 'Edit Forms',
      description: 'Edit form templates to better match your business',
    },
    {
      icon: FileText,
      title: 'Print Forms',
      description: 'Edit form templates to better match your business',
    },
    {
      icon: LinkIcon,
      title: 'Personal Business Link',
      description:
        'A link to your forms page to send to clients so they can begin filling out forms immediately',
    },
    {
      icon: PenTool,
      title: 'Sign Forms',
      description:
        'Signing forms in person at the appointment using the iOS App',
    },
    {
      icon: StickyNote,
      title: 'Make Notes',
      description: 'Make notes about client appointments for future references',
    },
    // {
    //   icon: BookTemplate,
    //   title: 'Templates Access',
    //   description: 'Access to dozens of free PMU form templates',
    // },
  ];

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

            <ScrollView
              contentContainerStyle={styles.scrollContent}
              showsVerticalScrollIndicator={false}
            >
              <View style={styles.header}>
                <Crown size={48} color={colors.primary} />
                <Text style={styles.title}>Your First 7 days is on us</Text>
                <Text style={styles.subtitle}>
                  Subscribe to unlock the ultimate experience and enjoy free 7
                  days on us
                </Text>
              </View>

              <View style={styles.featuresContainer}>
                {features.map((feature, index) => (
                  <View key={index} style={styles.featureItem}>
                    <View style={styles.featureIcon}>
                      <feature.icon size={20} color={colors.primary} />
                    </View>
                    <View style={styles.featureContent}>
                      <Text style={styles.featureTitle}>{feature.title}</Text>
                      <Text style={styles.featureDescription}>
                        {feature.description}
                      </Text>
                    </View>
                  </View>
                ))}
              </View>

              <TouchableOpacity
                onPress={() => Linking.openURL('https://artist.pmuforms.com')}
              >
                <LinearGradient
                  colors={[colors.primary, '#A654CD']}
                  start={{ x: 0, y: 0 }}
                  end={{ x: 1, y: 0 }}
                  style={styles.subscribeButton}
                >
                  <Text style={styles.subscribeButtonText}>
                    Subscribe on Website
                  </Text>
                </LinearGradient>
              </TouchableOpacity>
            </ScrollView>
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
  scrollContent: {
    padding: 14,
  },
  header: {
    alignItems: 'center',
    marginBottom: 32,
  },
  title: {
    fontSize: 24,
    fontWeight: '600',
    color: colors.black,
    marginTop: 16,
    marginBottom: 8,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 14,
    color: colors.subtitleColor,
    textAlign: 'center',
    lineHeight: 20,
  },
  featuresContainer: {
    gap: 16,
    marginBottom: 32,
  },
  featureItem: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    padding: 16,
    backgroundColor: '#f5f5f5',
    borderRadius: 12,
    gap: 12,
  },
  featureIcon: {
    width: 40,
    height: 40,
    backgroundColor: '#f1f5f9',
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
  },
  featureContent: {
    flex: 1,
  },
  featureTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.black,
    marginBottom: 4,
  },
  featureDescription: {
    fontSize: 14,
    color: colors.subtitleColor,
    lineHeight: 20,
  },
  subscribeButton: {
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: 'center',
  },
  subscribeButtonText: {
    height: 44,
    color: colors.white,
    fontSize: 16,
    fontWeight: '600',
  },
});

export default FeaturesModal;
