import React, { useRef, useState, useEffect, useCallback } from 'react';
import {
  View,
  Image,
  StyleSheet,
  Dimensions,
  ScrollView,
  Text,
  Animated,
  TouchableOpacity,
} from 'react-native';
import { ArrowRight } from 'lucide-react-native';
import { colors } from '../theme/colors';

const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get('window');

interface ImageSliderProps {
  onComplete: () => void;
}

interface Slide {
  image: any;
  title: string;
  description: string;
}

const slides: Slide[] = [
  {
    image: require('../../assets/images/artistauth3.jpg'),
    title: 'Welcome to PMU Forms',
    description:
      'Streamline your consent form management with our easy-to-use app.',
  },
  {
    image: require('../../assets/images/artistauth5.png'),
    title: 'Create and Manage Consent Forms',
    description: 'Quickly create, customize, and track your consent forms.',
  },
  {
    image: require('../../assets/images/artistauth1.jpg'),
    title: 'Stay Organized with Clients',
    description:
      'Manage client details and appointments easily. Keep everything at your fingertips.',
  },
];

const ImageSlider: React.FC<ImageSliderProps> = ({ onComplete }) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const scrollViewRef = useRef<ScrollView>(null);
  const fadeAnim = useRef(new Animated.Value(1)).current;

  const isLastSlide = currentIndex === slides.length - 1;

  const goToSlide = useCallback(
    (index: number) => {
      // Fade out
      Animated.timing(fadeAnim, {
        toValue: 0.7,
        duration: 200,
        useNativeDriver: true,
      }).start(() => {
        // Scroll to slide
        scrollViewRef.current?.scrollTo({
          x: index * SCREEN_WIDTH,
          animated: true,
        });

        // Fade back in
        Animated.timing(fadeAnim, {
          toValue: 1,
          duration: 200,
          useNativeDriver: true,
        }).start();
      });

      setCurrentIndex(index);
    },
    [fadeAnim],
  );

  useEffect(() => {
    const interval = setInterval(() => {
      if (currentIndex < slides.length - 1) {
        const nextIndex = currentIndex + 1;
        goToSlide(nextIndex);
      }
    }, 4000);

    return () => clearInterval(interval);
  }, [currentIndex, goToSlide]);

  const handleNext = () => {
    if (currentIndex < slides.length - 1) {
      goToSlide(currentIndex + 1);
    }
  };

  const handleSkip = () => {
    onComplete();
  };

  const handleScroll = (event: any) => {
    const contentOffsetX = event.nativeEvent.contentOffset.x;
    const index = Math.round(contentOffsetX / SCREEN_WIDTH);
    setCurrentIndex(index);
  };

  return (
    <View style={styles.container}>
      <Animated.ScrollView
        ref={scrollViewRef}
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        onMomentumScrollEnd={handleScroll}
        scrollEventThrottle={16}
        scrollEnabled={false}
        style={{ opacity: fadeAnim }}
      >
        {slides.map((slide, index) => (
          <View key={index} style={styles.slide}>
            <Image
              source={slide.image}
              style={styles.image}
              resizeMode="cover"
            />

            <View style={styles.gradientOverlay}>
              <View style={styles.textContainer}>
                <Text style={styles.title}>{slide.title}</Text>
                <Text style={styles.description}>{slide.description}</Text>
              </View>
            </View>

            {!isLastSlide && (
              <>
                <TouchableOpacity
                  style={styles.skipButton}
                  onPress={handleSkip}
                >
                  <Text style={styles.skipText}>Skip</Text>
                </TouchableOpacity>

                <TouchableOpacity
                  style={styles.nextButton}
                  onPress={handleNext}
                >
                  <View style={styles.nextButtonCircle}>
                    <ArrowRight size={24} color={colors.white} />
                  </View>
                </TouchableOpacity>
              </>
            )}

            {isLastSlide && (
              <View style={styles.lastSlideActions}>
                <TouchableOpacity
                  style={styles.getStartedButton}
                  onPress={onComplete}
                >
                  <Text style={styles.getStartedButtonText}>Get Started</Text>
                  <View style={styles.getStartedArrowCircle}>
                    <ArrowRight size={12} color={colors.white} />
                  </View>
                </TouchableOpacity>
                <Text style={styles.termsText}>
                  By proceeding, you agree to our{' '}
                  <Text style={styles.termsLink}>Terms and conditions</Text> and
                  our <Text style={styles.termsLink}>Privacy policy</Text>
                </Text>
              </View>
            )}
          </View>
        ))}
      </Animated.ScrollView>

      {/* Pagination Dots */}
      <View style={styles.pagination}>
        {slides.map((_, index) => (
          <View
            key={index}
            style={[
              styles.dot,
              currentIndex === index ? styles.activeDot : styles.inactiveDot,
            ]}
          />
        ))}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    width: SCREEN_WIDTH,
    height: SCREEN_HEIGHT,
    position: 'relative',
  },
  slide: {
    width: SCREEN_WIDTH,
    height: SCREEN_HEIGHT,
    position: 'relative',
  },
  image: {
    width: SCREEN_WIDTH,
    height: SCREEN_HEIGHT,
  },
  gradientOverlay: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    height: '50%',
    backgroundColor: 'transparent',
    justifyContent: 'flex-end',
    paddingBottom: 200,
    paddingHorizontal: 30,
  },
  textContainer: {
    marginBottom: 20,
  },
  title: {
    fontSize: 36,
    fontWeight: '700',
    fontFamily: 'RedditSans-Bold',
    color: '#ffffff',
    marginBottom: 12,
    lineHeight: 36,
    letterSpacing: 0,
    textAlign: 'center',
    textShadowColor: 'rgba(0, 0, 0, 0.8)',
    textShadowOffset: { width: 0, height: 2 },
    textShadowRadius: 8,
  },
  description: {
    fontSize: 16,
    fontWeight: '400',
    fontFamily: 'RedditSans-Regular',
    color: '#ffffff',
    lineHeight: 24,
    letterSpacing: 0,
    textAlign: 'center',
    opacity: 0.95,
    textShadowColor: 'rgba(0, 0, 0, 0.8)',
    textShadowOffset: { width: 0, height: 2 },
    textShadowRadius: 8,
  },
  skipButton: {
    position: 'absolute',
    bottom: 100,
    left: 24,
    zIndex: 10,
  },
  skipText: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: '600',
    textShadowColor: 'rgba(0, 0, 0, 0.5)',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 3,
  },
  nextButton: {
    position: 'absolute',
    bottom: 100,
    right: 24,
    zIndex: 10,
  },
  nextButtonCircle: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: '#D764D7',
    borderWidth: 2,
    borderColor: '#ffffff',
    alignItems: 'center',
    justifyContent: 'center',
    elevation: 5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
  },
  lastSlideActions: {
    position: 'absolute',
    bottom: 80,
    left: 24,
    right: 24,
    alignItems: 'center',
    zIndex: 10,
  },
  getStartedButton: {
    width: 380,
    height: 56,
    backgroundColor: '#D764D7',
    paddingVertical: 16,
    paddingHorizontal: 16,
    borderRadius: 16,
    elevation: 5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    marginBottom: 16,
  },
  getStartedArrowCircle: {
    width: 20,
    height: 20,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#ffffff',
    alignItems: 'center',
    justifyContent: 'center',
  },
  getStartedButtonText: {
    color: colors.white,
    fontSize: 14,
    fontWeight: '700',
    fontFamily: 'RedditSans-Bold',
    lineHeight: 20,
    letterSpacing: 0,
    textAlign: 'center',
  },
  termsText: {
    color: '#ffffff',
    fontSize: 12,
    textAlign: 'center',
    lineHeight: 18,
    paddingHorizontal: 20,
    textShadowColor: 'rgba(0, 0, 0, 0.8)',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 3,
  },
  termsLink: {
    textDecorationLine: 'underline',
    fontWeight: '600',
  },
  pagination: {
    position: 'absolute',
    bottom: 60,
    left: 0,
    right: 0,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    gap: 8,
  },
  dot: {
    height: 4,
    borderRadius: 2,
  },
  inactiveDot: {
    width: 10,
    backgroundColor: 'rgba(255, 255, 255, 0.4)',
  },
  activeDot: {
    width: 32,
    backgroundColor: '#D764D7',
  },
});

export default ImageSlider;
