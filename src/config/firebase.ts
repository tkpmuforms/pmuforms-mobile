import auth from '@react-native-firebase/auth';
import firestore from '@react-native-firebase/firestore';
import storage from '@react-native-firebase/storage';

// Note: @react-native-firebase automatically reads from native config files
// No need to initialize with JS config object

export { auth, firestore, storage };

// For Google Sign-In (you already have the package)
export { GoogleSignin } from '@react-native-google-signin/google-signin';
