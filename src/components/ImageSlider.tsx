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
import { ChevronRight } from 'lucide-react-native';

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
    image: require('../../assets/images/artistauth1.jpg'),
    title: 'Welcome to PMU Forms',
    description:
      'Streamline your consent form management with our easy-to-use app.',
  },
  {
    image: require('../../assets/images/artistauth3.jpg'),
    title: 'Create and Manage Consent Forms',
    description: 'Quickly create, customize, and track your consent forms.',
  },
  {
    image: require('../../assets/images/artistauth5.png'),
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

            {/* Text overlay - no background, just white text */}
            <View style={styles.gradientOverlay}>
              <View style={styles.textContainer}>
                <Text style={styles.title}>{slide.title}</Text>
                <Text style={styles.description}>{slide.description}</Text>
              </View>
            </View>

            {/* Skip and Next buttons for first two slides */}
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
                    <ChevronRight size={24} color="#fff" />
                  </View>
                </TouchableOpacity>
              </>
            )}

            {/* Get Started button and terms text only on last slide */}
            {isLastSlide && (
              <View style={styles.lastSlideActions}>
                <TouchableOpacity
                  style={styles.getStartedButton}
                  onPress={onComplete}
                >
                  <Text style={styles.getStartedButtonText}>Get Started</Text>
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
    paddingBottom: 100,
    paddingHorizontal: 30,
  },
  textContainer: {
    marginBottom: 20,
  },
  title: {
    fontSize: 32,
    fontWeight: '700',
    color: '#ffffff',
    marginBottom: 12,
    lineHeight: 38,
    textShadowColor: 'rgba(0, 0, 0, 0.8)',
    textShadowOffset: { width: 0, height: 2 },
    textShadowRadius: 8,
  },
  description: {
    fontSize: 18,
    fontWeight: '400',
    color: '#ffffff',
    lineHeight: 27,
    opacity: 0.95,
    textShadowColor: 'rgba(0, 0, 0, 0.8)',
    textShadowOffset: { width: 0, height: 2 },
    textShadowRadius: 8,
  },
  skipButton: {
    position: 'absolute',
    top: 60,
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
    bottom: 150,
    right: 24,
    zIndex: 10,
  },
  nextButtonCircle: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: '#8e2d8e',
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
    backgroundColor: '#8e2d8e',
    paddingVertical: 16,
    paddingHorizontal: 60,
    borderRadius: 30,
    elevation: 5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    minWidth: 200,
    alignItems: 'center',
    marginBottom: 16,
  },
  getStartedButtonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: '700',
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
    backgroundColor: '#8e2d8e', // var(--pmu-primary)
  },
});

export default ImageSlider;
