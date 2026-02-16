// import { useNavigation } from '@react-navigation/native';
// import React, { useState } from 'react';
// import {
//   ActivityIndicator,
//   Keyboard,
//   KeyboardAvoidingView,
//   Platform,
//   ScrollView,
//   StyleSheet,
//   Text,
//   TextInput,
//   TouchableOpacity,
//   TouchableWithoutFeedback,
//   View,
// } from 'react-native';
// import { SafeAreaView } from 'react-native-safe-area-context';
// import { CardField, useStripe } from '@stripe/stripe-react-native';
// import Toast from 'react-native-toast-message';
// import ScreenHeader from '../../components/layout/ScreenHeader';
// import { colors } from '../../theme/colors';
// import { addPaymentMethod } from '../../services/artistServices';

// const AddCardScreen: React.FC = () => {
//   const navigation = useNavigation();
//   const { createPaymentMethod } = useStripe();

//   const [cardholderName, setCardholderName] = useState('');
//   const [cardComplete, setCardComplete] = useState(false);
//   const [loading, setLoading] = useState(false);
//   const [error, setError] = useState('');

//   const handleAddCard = async () => {
//     if (!cardholderName.trim()) {
//       setError('Please enter the cardholder name');
//       return;
//     }

//     if (!cardComplete) {
//       setError('Please enter valid card details');
//       return;
//     }

//     setLoading(true);
//     setError('');

//     try {
//       const { paymentMethod, error: stripeError } =
//         await createPaymentMethod({
//           paymentMethodType: 'Card',
//           paymentMethodData: {
//             billingDetails: {
//               name: cardholderName.trim(),
//             },
//           },
//         });

//       if (stripeError) {
//         setError(stripeError.message || 'Failed to process card');
//         return;
//       }

//       if (!paymentMethod?.id) {
//         setError('Failed to create payment method');
//         return;
//       }

//       await addPaymentMethod(paymentMethod.id);

//       Toast.show({
//         type: 'success',
//         text1: 'Success',
//         text2: 'Card added successfully',
//       });

//       navigation.goBack();
//     } catch (err: any) {
//       const errorMessage =
//         err?.response?.data?.error ||
//         err?.message ||
//         'Failed to add card. Please try again.';
//       setError(errorMessage);
//       console.error('Error adding card:', err);
//     } finally {
//       setLoading(false);
//     }
//   };

//   return (
//     <SafeAreaView style={styles.container} edges={['bottom']}>
//       <ScreenHeader
//         title="Add New Card"
//         subtitle="Enter your card details"
//         onBack={() => navigation.goBack()}
//       />
//       <KeyboardAvoidingView
//         behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
//         style={styles.keyboardView}
//       >
//         <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
//           <View style={styles.content}>
//             <ScrollView
//               style={styles.scrollView}
//               contentContainerStyle={styles.scrollContent}
//               showsVerticalScrollIndicator={false}
//               keyboardShouldPersistTaps="handled"
//             >
//               {error !== '' && (
//                 <View style={styles.errorContainer}>
//                   <Text style={styles.errorText}>{error}</Text>
//                 </View>
//               )}

//               <View style={styles.formGroup}>
//                 <Text style={styles.label}>Cardholder Name</Text>
//                 <TextInput
//                   style={styles.input}
//                   value={cardholderName}
//                   onChangeText={setCardholderName}
//                   placeholder="John Doe"
//                   placeholderTextColor="#9ca3af"
//                   autoCapitalize="words"
//                 />
//               </View>

//               <View style={styles.formGroup}>
//                 <Text style={styles.label}>Card Details</Text>
//                 <CardField
//                   postalCodeEnabled={false}
//                   placeholders={{ number: '4242 4242 4242 4242' }}
//                   cardStyle={cardFieldStyles}
//                   style={styles.cardField}
//                   onCardChange={details => {
//                     setCardComplete(details.complete);
//                     if (error) setError('');
//                   }}
//                 />
//               </View>
//             </ScrollView>

//             <View style={styles.footer}>
//               <View style={styles.actions}>
//                 <TouchableOpacity
//                   style={styles.cancelButton}
//                   onPress={() => navigation.goBack()}
//                   disabled={loading}
//                 >
//                   <Text style={styles.cancelButtonText}>Cancel</Text>
//                 </TouchableOpacity>
//                 <TouchableOpacity
//                   style={[
//                     styles.confirmButton,
//                     (loading || !cardComplete) && styles.confirmButtonDisabled,
//                   ]}
//                   onPress={handleAddCard}
//                   disabled={loading || !cardComplete}
//                 >
//                   {loading ? (
//                     <ActivityIndicator color="white" />
//                   ) : (
//                     <Text style={styles.confirmButtonText}>Add Card</Text>
//                   )}
//                 </TouchableOpacity>
//               </View>
//             </View>
//           </View>
//         </TouchableWithoutFeedback>
//       </KeyboardAvoidingView>
//     </SafeAreaView>
//   );
// };

// const cardFieldStyles = {
//   backgroundColor: '#BCBBC133',
//   textColor: '#000000',
//   fontSize: 16,
//   placeholderColor: '#9ca3af',
//   borderWidth: 1,
//   borderColor: '#e5e7eb',
//   borderRadius: 12,
// };

// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//   },
//   keyboardView: {
//     flex: 1,
//   },
//   content: {
//     flex: 1,
//   },
//   scrollView: {
//     flex: 1,
//   },
//   scrollContent: {
//     padding: 16,
//     paddingBottom: 32,
//   },
//   errorContainer: {
//     backgroundColor: '#fee2e2',
//     padding: 12,
//     borderRadius: 8,
//     marginBottom: 16,
//   },
//   errorText: {
//     color: '#dc2626',
//     fontSize: 14,
//   },
//   formGroup: {
//     marginBottom: 16,
//   },
//   label: {
//     fontSize: 14,
//     fontWeight: '500',
//     color: '#374151',
//     marginBottom: 8,
//   },
//   input: {
//     width: '100%',
//     padding: 12,
//     borderWidth: 1,
//     borderColor: '#e5e7eb',
//     borderRadius: 12,
//     fontSize: 16,
//     color: colors.black,
//     backgroundColor: '#BCBBC133',
//   },
//   cardField: {
//     width: '100%',
//     height: 50,
//   },
//   footer: {
//     padding: 16,
//     backgroundColor: colors.white,
//     borderTopWidth: 1,
//     borderTopColor: '#E5E5E5',
//   },
//   actions: {
//     flexDirection: 'row',
//     gap: 12,
//   },
//   cancelButton: {
//     flex: 1,
//     backgroundColor: 'transparent',
//     borderWidth: 1,
//     borderColor: colors.borderColor,
//     padding: 14,
//     borderRadius: 12,
//     alignItems: 'center',
//   },
//   cancelButtonText: {
//     color: colors.subtitleColor,
//     fontWeight: '500',
//     fontSize: 16,
//   },
//   confirmButton: {
//     flex: 1,
//     backgroundColor: colors.primary,
//     padding: 14,
//     borderRadius: 12,
//     alignItems: 'center',
//   },
//   confirmButtonDisabled: {
//     opacity: 0.5,
//   },
//   confirmButtonText: {
//     color: 'white',
//     fontWeight: '600',
//     fontSize: 16,
//   },
// });

// export default AddCardScreen;
