import React, { useState, useEffect, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Modal,
  TouchableOpacity,
  ActivityIndicator,
  Alert,
  Dimensions,
  Image,
} from 'react-native';
import { X, Trash2, Check, Undo } from 'lucide-react-native';
import Svg, { Path } from 'react-native-svg';
import { GestureDetector, Gesture } from 'react-native-gesture-handler';
import { captureRef } from 'react-native-view-shot';
import { colors } from '../../theme/colors';

interface SignatureModalProps {
  visible: boolean;
  onClose: () => void;
  onSubmit: (signatureDataUrl: string) => Promise<void>;
  title: string;
  isSubmitting?: boolean;
  existingSignature?: string;
}

interface Point {
  x: number;
  y: number;
}

const { width: SCREEN_WIDTH } = Dimensions.get('window');
const CANVAS_WIDTH = SCREEN_WIDTH - 40;
const CANVAS_HEIGHT = 300;

const SignatureModal: React.FC<SignatureModalProps> = ({
  visible,
  onClose,
  onSubmit,
  title,
  isSubmitting = false,
  existingSignature,
}) => {
  const [paths, setPaths] = useState<Point[][]>([]);
  const [currentPath, setCurrentPath] = useState<Point[]>([]);
  const [hasSignature, setHasSignature] = useState(false);
  const canvasRef = useRef<View>(null);

  useEffect(() => {
    if (existingSignature) {
      setHasSignature(true);
    }
  }, [existingSignature]);

  const panGesture = Gesture.Pan()
    .onUpdate(event => {
      const { x, y } = event;
      setCurrentPath(prev => [...prev, { x, y }]);
      setHasSignature(true);
    })
    .onEnd(() => {
      if (currentPath.length > 0) {
        setPaths(prev => [...prev, currentPath]);
        setCurrentPath([]);
      }
    });

  const clearSignature = () => {
    setPaths([]);
    setCurrentPath([]);
    setHasSignature(!!existingSignature);
  };

  const undoLastStroke = () => {
    if (paths.length > 0) {
      const newPaths = [...paths];
      newPaths.pop();
      setPaths(newPaths);
      setHasSignature(newPaths.length > 0);
    }
  };

  const handleConfirm = async () => {
    if (!hasSignature && !existingSignature) {
      Alert.alert('Error', 'Please provide a signature before confirming');
      return;
    }

    try {
      if (paths.length > 0 && canvasRef.current) {
        const uri = await captureRef(canvasRef, {
          format: 'png',
          quality: 1,
          result: 'data-uri',
        });
        await onSubmit(uri);
      } else if (existingSignature) {
        await onSubmit(existingSignature);
      } else {
        throw new Error('No signature available');
      }
    } catch (error) {
      console.error('Error submitting signature:', error);
      Alert.alert('Error', 'Failed to submit signature');
    }
  };

  const renderPaths = () => {
    const allPaths = [...paths];
    if (currentPath.length > 0) {
      allPaths.push(currentPath);
    }

    return allPaths.map((path, pathIndex) => {
      if (path.length < 2) return null;

      let pathData = `M ${path[0].x} ${path[0].y}`;
      for (let i = 1; i < path.length; i++) {
        pathData += ` L ${path[i].x} ${path[i].y}`;
      }

      return (
        <Path
          key={pathIndex}
          d={pathData}
          stroke={colors.text}
          strokeWidth={2}
          fill="none"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      );
    });
  };

  return (
    <Modal
      visible={visible}
      animationType="slide"
      transparent={true}
      onRequestClose={onClose}
    >
      <View style={styles.modalOverlay}>
        <View style={styles.modalContent}>
          <View style={styles.modalHeader}>
            <Text style={styles.modalTitle}>{title}</Text>
            <TouchableOpacity onPress={onClose} style={styles.closeButton}>
              <X size={24} color={colors.text} />
            </TouchableOpacity>
          </View>

          <View style={styles.canvasContainer}>
            {existingSignature && paths.length === 0 ? (
              <View style={styles.canvas}>
                <Image
                  source={{ uri: existingSignature }}
                  style={styles.existingSignature}
                  resizeMode="contain"
                />
                <View style={styles.existingBadge}>
                  <Text style={styles.existingBadgeText}>
                    Existing Signature
                  </Text>
                </View>
              </View>
            ) : (
              <GestureDetector gesture={panGesture}>
                <View style={styles.canvas} ref={canvasRef} collapsable={false}>
                  <Svg width={CANVAS_WIDTH} height={CANVAS_HEIGHT}>
                    {renderPaths()}
                  </Svg>
                  {!hasSignature && (
                    <View style={styles.placeholderContainer}>
                      <Text style={styles.placeholderText}>Sign here</Text>
                    </View>
                  )}
                </View>
              </GestureDetector>
            )}
          </View>

          <View style={styles.buttonContainer}>
            <TouchableOpacity
              style={styles.actionButton}
              onPress={undoLastStroke}
              disabled={paths.length === 0}
            >
              <Undo
                size={20}
                color={paths.length === 0 ? colors.textLight : colors.text}
              />
              <Text
                style={[
                  styles.actionButtonText,
                  paths.length === 0 && styles.actionButtonTextDisabled,
                ]}
              >
                Undo
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.actionButton}
              onPress={clearSignature}
              disabled={!hasSignature}
            >
              <Trash2
                size={20}
                color={!hasSignature ? colors.textLight : colors.error}
              />
              <Text
                style={[
                  styles.actionButtonText,
                  !hasSignature && styles.actionButtonTextDisabled,
                ]}
              >
                Clear
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[
                styles.confirmButton,
                (!hasSignature || isSubmitting) && styles.confirmButtonDisabled,
              ]}
              onPress={handleConfirm}
              disabled={!hasSignature || isSubmitting}
            >
              {isSubmitting ? (
                <ActivityIndicator size="small" color={colors.white} />
              ) : (
                <>
                  <Check size={20} color={colors.white} />
                  <Text style={styles.confirmButtonText}>Confirm</Text>
                </>
              )}
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
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    width: SCREEN_WIDTH - 32,
    backgroundColor: colors.white,
    borderRadius: 16,
    padding: 20,
    maxHeight: '80%',
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: colors.text,
    flex: 1,
  },
  closeButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: colors.background,
    justifyContent: 'center',
    alignItems: 'center',
  },
  canvasContainer: {
    borderWidth: 2,
    borderColor: colors.border,
    borderRadius: 8,
    overflow: 'hidden',
    backgroundColor: '#f8fafc',
  },
  canvas: {
    width: CANVAS_WIDTH,
    height: CANVAS_HEIGHT,
    position: 'relative',
  },
  placeholderContainer: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    justifyContent: 'center',
    alignItems: 'center',
    pointerEvents: 'none',
  },
  placeholderText: {
    fontSize: 16,
    color: colors.textLight,
    opacity: 0.5,
  },
  existingSignature: {
    width: '100%',
    height: '100%',
  },
  existingBadge: {
    position: 'absolute',
    top: 8,
    right: 8,
    backgroundColor: colors.primary,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 12,
  },
  existingBadgeText: {
    color: colors.white,
    fontSize: 12,
    fontWeight: '600',
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 20,
    gap: 12,
  },
  actionButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
    borderRadius: 8,
    backgroundColor: colors.background,
    gap: 8,
  },
  actionButtonText: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.text,
  },
  actionButtonTextDisabled: {
    color: colors.textLight,
  },
  confirmButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
    borderRadius: 8,
    backgroundColor: colors.primary,
    gap: 8,
  },
  confirmButtonDisabled: {
    opacity: 0.5,
  },
  confirmButtonText: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.white,
  },
});

export default SignatureModal;
