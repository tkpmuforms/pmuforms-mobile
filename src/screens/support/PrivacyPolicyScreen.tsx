import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Linking,
  TouchableOpacity,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import ScreenHeader from '../../components/layout/ScreenHeader';

const PrivacyPolicyScreen: React.FC = () => {
  const navigation = useNavigation();

  const handleEmailPress = () => {
    Linking.openURL('mailto:contact@pmuforms.com');
  };

  return (
    <SafeAreaView style={styles.container} edges={[]}>
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <ScreenHeader
          title="PMU Forms Privacy Policy"
          onBack={() => navigation.goBack()}
        />

        <Text style={styles.paragraph}>
          Dephyned built the PMU Forms app as a Freemium app. This SERVICE is
          provided by Dephyned at no cost and is intended for use as is.
        </Text>

        <Text style={styles.paragraph}>
          This page is used to inform visitors regarding our policies with the
          collection, use, and disclosure of Personal Information if anyone
          decided to use our Service.
        </Text>

        <Text style={styles.paragraph}>
          If you choose to use our Service, then you agree to the collection and
          use of information in relation to this policy. The Personal
          Information that we collect is used for providing and improving the
          Service. We will not use or share your information with anyone except
          as described in this Privacy Policy.
        </Text>

        <Text style={styles.paragraph}>
          The terms used in this Privacy Policy have the same meanings as in our
          Terms and Conditions, which is accessible at PMU Forms unless
          otherwise defined in this Privacy Policy.
        </Text>

        <Text style={styles.sectionTitle}>Information Collection and Use</Text>
        <Text style={styles.paragraph}>
          For a better experience, while using our Service, we may require you
          to provide us with certain personally identifiable information,
          including but not limited to email. The information that we request
          will be retained by us and used as described in this privacy policy.
        </Text>

        <Text style={styles.paragraph}>
          The app does use third-party services that may collect information
          used to identify you.
        </Text>

        <View style={styles.list}>
          <Text style={styles.listItem}>• Firebase Analytics</Text>
          <Text style={styles.listItem}>• Firebase Crashlytics</Text>
        </View>

        <Text style={styles.sectionTitle}>Log Data</Text>
        <Text style={styles.paragraph}>
          We want to inform you that whenever you use our Service, in a case of
          an error in the app we collect data and information (through third
          party products) on your phone called Log Data. This Log Data may
          include information such as your device Internet Protocol ("IP")
          address, device name, operating system version, the configuration of
          the app when utilizing our Service, the time and date of your use of
          the Service, and other statistics.
        </Text>

        <Text style={styles.sectionTitle}>Cookies</Text>
        <Text style={styles.paragraph}>
          Cookies are files with a small amount of data that are commonly used
          as anonymous unique identifiers. These are sent to your browser from
          the websites that you visit and are stored on your device's internal
          memory.
        </Text>

        <Text style={styles.paragraph}>
          This Service does not use these "cookies" explicitly. However, the app
          may use third-party code and libraries that use "cookies" to collect
          information and improve their services. You have the option to either
          accept or refuse these cookies and know when a cookie is being sent to
          your device. If you choose to refuse our cookies, you may not be able
          to use some portions of this Service.
        </Text>

        <Text style={styles.sectionTitle}>Service Providers</Text>
        <Text style={styles.paragraph}>
          We may employ third-party companies and individuals due to the
          following reasons:
        </Text>

        <View style={styles.list}>
          <Text style={styles.listItem}>• To facilitate our Service;</Text>
          <Text style={styles.listItem}>
            • To provide the Service on our behalf;
          </Text>
          <Text style={styles.listItem}>
            • To perform Service-related services;
          </Text>
          <Text style={styles.listItem}>
            • To assist us in analyzing how our Service is used.
          </Text>
        </View>

        <Text style={styles.paragraph}>
          We want to inform users of this Service that these third parties have
          access to your Personal Information. The reason is to perform the
          tasks assigned to them on our behalf. However, they are obligated not
          to disclose or use the information for any other purpose.
        </Text>

        <Text style={styles.sectionTitle}>Security</Text>
        <Text style={styles.paragraph}>
          We value your trust in providing us your Personal Information, thus we
          are striving to use commercially acceptable means of protecting it.
          But remember that no method of transmission over the internet, or
          method of electronic storage is 100% secure and reliable, and we
          cannot guarantee its absolute security.
        </Text>

        <Text style={styles.sectionTitle}>Links to Other Sites</Text>
        <Text style={styles.paragraph}>
          This Service may contain links to other sites. If you click on a
          third-party link, you will be directed to that site. Note that these
          external sites are not operated by us. Therefore, we strongly advise
          you to review the Privacy Policy of these websites. We have no control
          over and assume no responsibility for the content, privacy policies,
          or practices of any third-party sites or services.
        </Text>

        <Text style={styles.sectionTitle}>Children's Privacy</Text>
        <Text style={styles.paragraph}>
          These Services do not address anyone under the age of 13. We do not
          knowingly collect personally identifiable information from children
          under 13. In the case we discover that a child under 13 has provided
          us with personal information, we immediately delete this from our
          servers. If you are a parent or guardian and you are aware that your
          child has provided us with personal information, please contact us so
          that we will be able to do necessary actions.
        </Text>

        <Text style={styles.sectionTitle}>Changes to This Privacy Policy</Text>
        <Text style={styles.paragraph}>
          We may update our Privacy Policy from time to time. Thus, you are
          advised to review this page periodically for any changes. We will
          notify you of any changes by posting the new Privacy Policy on this
          page. These changes are effective immediately after they are posted on
          this page.
        </Text>

        <Text style={styles.sectionTitle}>Contact Us</Text>
        <Text style={styles.paragraph}>
          If you have any questions or suggestions about our Privacy Policy, do
          not hesitate to contact us at{' '}
          <TouchableOpacity onPress={handleEmailPress}>
            <Text style={styles.link}>contact@pmuforms.com</Text>
          </TouchableOpacity>
          .
        </Text>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollContent: {
    padding: 15,
    paddingBottom: 20,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#000000',
    marginTop: 24,
    marginBottom: 12,
  },
  paragraph: {
    fontSize: 15,
    color: '#4a5568',
    lineHeight: 24,
    marginBottom: 16,
  },
  list: {
    marginBottom: 16,
    paddingLeft: 8,
  },
  listItem: {
    fontSize: 15,
    color: '#4a5568',
    lineHeight: 24,
    marginBottom: 8,
  },
  link: {
    color: '#8e2d8e',
    textDecorationLine: 'underline',
  },
});

export default PrivacyPolicyScreen;
