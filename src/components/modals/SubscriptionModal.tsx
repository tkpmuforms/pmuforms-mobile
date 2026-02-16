// import React, { useState } from 'react';
// import {
//   View,
//   Text,
//   Modal,
//   TouchableOpacity,
//   ScrollView,
//   StyleSheet,
//   Pressable,
// } from 'react-native';
// import { X } from 'lucide-react-native';
// import SelectPaymentMethodModal from '../payment/SelectPaymentMethodModal';
// import { Config } from 'react-native-config';
// import { colors } from '../../theme/colors';

// interface SubscriptionModalProps {
//   visible: boolean;
//   onClose: () => void;
//   onShowFeatures?: () => void;
//   onSubscribe?: () => void;
//   currentPriceId?: string;
// }

// const SubscriptionModal: React.FC<SubscriptionModalProps> = ({
//   visible,
//   onClose,
//   onShowFeatures,
//   onSubscribe,
//   currentPriceId,
// }) => {
//   const [showPaymentModal, setShowPaymentModal] = useState(false);
//   const [selectedPriceId, setSelectedPriceId] = useState<string>('');

//   const weeklyPrice = Number(Config.WEEKLY_PRICE || '0');
//   const monthlyPrice = Number(Config.MONTHLY_PRICE || '0');
//   const yearlyPrice = Number(Config.YEARLY_PRICE || '0');

//   const monthlyPricePerWeek = monthlyPrice / 4.33;
//   const yearlyPricePerWeek = yearlyPrice / 52;

//   const monthlyDiscount =
//     ((weeklyPrice * 4.33 - monthlyPrice) / (weeklyPrice * 4.33)) * 100;
//   const yearlyDiscount =
//     ((weeklyPrice * 52 - yearlyPrice) / (weeklyPrice * 52)) * 100;

//   const pricingPlans = [
//     {
//       name: '1 MONTH',
//       price: `$${weeklyPrice}`,
//       period: 'month',
//       subtitle: '(7days free trial)',
//       badge: '',
//       popular: false,
//       priceId: Config.WEEKLY_PRICE_ID || '',
//       freeTrialLabel: '7-day free trial',
//       specialOffer: false,
//     },
//     {
//       name: '6 MONTHS',
//       price: `$${monthlyPrice}`,
//       period: 'month',
//       subtitle: `(only $${monthlyPricePerWeek.toFixed(2)} / month)`,
//       badge: '-5%',
//       popular: false,
//       priceId: Config.MONTHLY_PRICE_ID || '',
//       freeTrialLabel: '7-day free trial',
//       specialOffer: false,
//     },
//     {
//       name: '12 MONTHS',
//       price: `$${yearlyPrice}`,
//       period: 'year',
//       subtitle: `(only $${yearlyPricePerWeek.toFixed(2)} / month)`,
//       badge: '-5%',
//       popular: false,
//       priceId: Config.YEARLY_PRICE_ID || '',
//       freeTrialLabel: '7-day free trial',
//       specialOffer: true,
//     },
//   ];

//   const handleSubscribeClick = (priceId: string) => {
//     setSelectedPriceId(priceId);
//     setShowPaymentModal(true);
//   };

//   const handlePaymentSuccess = () => {
//     setShowPaymentModal(false);
//     if (onSubscribe) {
//       onSubscribe();
//     }
//     onClose();
//   };

//   const isCurrentPlan = (priceId: string) => {
//     return currentPriceId === priceId;
//   };

//   return (
//     <>
//       <Modal
//         visible={visible}
//         transparent
//         animationType="fade"
//         onRequestClose={onClose}
//       >
//         <View style={styles.modalOverlay}>
//           <Pressable style={styles.backdrop} onPress={onClose} />
//           <View style={styles.modalContent}>
//             <TouchableOpacity style={styles.closeButton} onPress={onClose}>
//               <X size={20} color={colors.subtitleColor} />
//             </TouchableOpacity>

//             <ScrollView showsVerticalScrollIndicator={false}>
//               <View style={styles.header}>
//                 <View style={styles.logoContainer}>
//                   <View style={styles.logo}>
//                     <Text style={styles.logoText}>PMU{'\n'}Forms</Text>
//                   </View>
//                 </View>
//                 <Text style={styles.title}>
//                   {currentPriceId
//                     ? 'Change Your PMU Subscription'
//                     : 'Reactivate your PMU Subscription'}
//                 </Text>
//                 <Text style={styles.subtitle}>
//                   {currentPriceId
//                     ? 'Select a new plan to switch your subscription'
//                     : 'Subscribe to unlock and keep enjoying the ultimate experience on PMU Forms'}
//                 </Text>
//               </View>

//               <View style={styles.pricingSection}>
//                 <Text style={styles.sectionTitle}>SELECT YOUR PLAN</Text>
//                 {pricingPlans.map((plan, index) => {
//                   const isCurrent = isCurrentPlan(plan.priceId);
//                   const isPopular = plan.specialOffer && !currentPriceId;

//                   return (
//                     <TouchableOpacity
//                       key={index}
//                       style={[
//                         styles.pricingPlan,
//                         (isPopular || isCurrent) && styles.pricingPlanPopular,
//                       ]}
//                       onPress={() =>
//                         !isCurrent && handleSubscribeClick(plan.priceId)
//                       }
//                       disabled={isCurrent}
//                       activeOpacity={isCurrent ? 1 : 0.7}
//                     >
//                       {plan.badge !== '' && (
//                         <View style={styles.badge}>
//                           <Text style={styles.badgeText}>{plan.badge}</Text>
//                         </View>
//                       )}
//                       {plan.freeTrialLabel && (
//                         <View style={styles.freeTrialLabel}>
//                           <Text style={styles.freeTrialLabelText}>
//                             {plan.freeTrialLabel}
//                           </Text>
//                         </View>
//                       )}
//                       {isCurrent && (
//                         <View style={styles.currentLabel}>
//                           <Text style={styles.currentLabelText}>
//                             Current Plan
//                           </Text>
//                         </View>
//                       )}
//                       <Text style={styles.planName}>{plan.name}</Text>
//                       <View style={styles.priceRow}>
//                         <View style={styles.priceContainer}>
//                           <Text style={styles.priceAmount}>{plan.price}</Text>
//                           <Text style={styles.pricePeriod}>
//                             / {plan.period}
//                           </Text>
//                         </View>
//                         <Text style={styles.planSubtitle}>{plan.subtitle}</Text>
//                       </View>
//                       {plan.specialOffer && !isCurrent && (
//                         <View style={styles.specialOfferBadge}>
//                           <Text style={styles.specialOfferText}>
//                             Special Offer
//                           </Text>
//                         </View>
//                       )}
//                     </TouchableOpacity>
//                   );
//                 })}
//               </View>

//               <View style={styles.actions}>
//                 <TouchableOpacity
//                   style={styles.restoreButton}
//                   onPress={onShowFeatures}
//                 >
//                   <Text style={styles.restoreButtonText}>
//                     Restore Purchases
//                   </Text>
//                 </TouchableOpacity>
//               </View>
//             </ScrollView>
//           </View>
//         </View>
//       </Modal>

//       {showPaymentModal && (
//         <SelectPaymentMethodModal
//           visible={showPaymentModal}
//           cards={[]}
//           onClose={() => setShowPaymentModal(false)}
//           priceId={selectedPriceId}
//           onPaymentSuccess={handlePaymentSuccess}
//           hasActiveSubscription={!!currentPriceId}
//         />
//       )}
//     </>
//   );
// };

// const styles = StyleSheet.create({
//   modalOverlay: {
//     flex: 1,
//     justifyContent: 'flex-end',
//     backgroundColor: 'rgba(0, 0, 0, 0.5)',
//   },
//   backdrop: {
//     position: 'absolute',
//     top: 0,
//     left: 0,
//     right: 0,
//     bottom: 0,
//   },
//   modalContent: {
//     backgroundColor: 'white',
//     borderTopLeftRadius: 20,
//     borderTopRightRadius: 20,
//     padding: 16,
//     width: '100%',
//     maxHeight: '90%',
//   },
//   closeButton: {
//     position: 'absolute',
//     top: 8,
//     right: 8,
//     padding: 4,
//     borderRadius: 8,
//     backgroundColor: 'transparent',
//     zIndex: 10,
//   },
//   header: {
//     alignItems: 'center',
//     marginBottom: 12,
//   },
//   logoContainer: {
//     marginBottom: 6,
//   },
//   logo: {
//     backgroundColor: colors.primary,
//     paddingVertical: 6,
//     paddingHorizontal: 10,
//     borderRadius: 5,
//   },
//   logoText: {
//     color: 'white',
//     fontWeight: '600',
//     fontSize: 9,
//     lineHeight: 12,
//     textAlign: 'center',
//   },
//   title: {
//     fontSize: 16,
//     fontWeight: '600',
//     color: colors.black,
//     marginVertical: 6,
//     textAlign: 'center',
//   },
//   subtitle: {
//     color: colors.subtitleColor,
//     fontSize: 12,
//     textAlign: 'center',
//     lineHeight: 16,
//   },
//   pricingSection: {
//     marginBottom: 12,
//   },
//   sectionTitle: {
//     fontSize: 10,
//     fontWeight: '600',
//     color: colors.subtitleColor,
//     textAlign: 'center',
//     marginBottom: 10,
//     letterSpacing: 0.5,
//   },
//   pricingPlan: {
//     position: 'relative',
//     borderWidth: 2,
//     borderColor: colors.borderColor,
//     borderRadius: 10,
//     padding: 10,
//     marginBottom: 8,
//   },
//   pricingPlanPopular: {
//     borderColor: colors.primary,
//     backgroundColor: '#faf5ff',
//   },
//   badge: {
//     position: 'absolute',
//     top: 8,
//     left: 8,
//     backgroundColor: colors.primary,
//     paddingVertical: 2,
//     paddingHorizontal: 6,
//     borderRadius: 4,
//   },
//   badgeText: {
//     color: 'white',
//     fontSize: 9,
//     fontWeight: '600',
//   },
//   freeTrialLabel: {
//     position: 'absolute',
//     top: 8,
//     right: 8,
//     backgroundColor: colors.primary,
//     paddingVertical: 2,
//     paddingHorizontal: 6,
//     borderRadius: 4,
//   },
//   freeTrialLabelText: {
//     color: 'white',
//     fontSize: 9,
//     fontWeight: '600',
//   },
//   popularLabel: {
//     position: 'absolute',
//     top: -8,
//     left: 16,
//     backgroundColor: colors.primary,
//     paddingVertical: 4,
//     paddingHorizontal: 12,
//     borderRadius: 12,
//   },
//   popularLabelText: {
//     color: 'white',
//     fontSize: 12,
//     fontWeight: '600',
//   },
//   currentLabel: {
//     position: 'absolute',
//     top: 8,
//     right: 8,
//     backgroundColor: colors.primary,
//     paddingVertical: 2,
//     paddingHorizontal: 6,
//     borderRadius: 4,
//   },
//   currentLabelText: {
//     color: 'white',
//     fontSize: 9,
//     fontWeight: '600',
//   },
//   planName: {
//     fontSize: 13,
//     fontWeight: '700',
//     color: colors.black,
//     marginBottom: 4,
//     marginTop: 18,
//   },
//   priceRow: {
//     flexDirection: 'row',
//     alignItems: 'center',
//     justifyContent: 'space-between',
//   },
//   priceContainer: {
//     flexDirection: 'row',
//     alignItems: 'baseline',
//   },
//   priceAmount: {
//     fontSize: 20,
//     fontWeight: '700',
//     color: colors.black,
//   },
//   pricePeriod: {
//     fontSize: 11,
//     color: colors.subtitleColor,
//     marginLeft: 2,
//   },
//   planSubtitle: {
//     fontSize: 11,
//     color: colors.subtitleColor,
//   },
//   specialOfferBadge: {
//     alignSelf: 'flex-start',
//     backgroundColor: colors.primary,
//     paddingVertical: 2,
//     paddingHorizontal: 8,
//     borderRadius: 4,
//     marginTop: 6,
//   },
//   specialOfferText: {
//     color: 'white',
//     fontSize: 10,
//     fontWeight: '600',
//   },
//   actions: {
//     marginTop: 6,
//   },
//   restoreButton: {
//     width: '100%',
//     backgroundColor: 'transparent',
//     borderWidth: 1,
//     borderColor: colors.borderColor,
//     padding: 10,
//     borderRadius: 8,
//     alignItems: 'center',
//   },
//   restoreButtonText: {
//     color: colors.subtitleColor,
//     fontWeight: '500',
//     fontSize: 13,
//   },
// });

// export default SubscriptionModal;
