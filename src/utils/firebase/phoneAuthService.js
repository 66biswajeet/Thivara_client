import {
  RecaptchaVerifier,
  signInWithPhoneNumber,
  PhoneAuthProvider,
  signInWithCredential,
} from "firebase/auth";
import { auth } from "@/lib/firebase/config";

/**
 * Firebase Phone Authentication Service
 * Handles phone number authentication with OTP verification
 */
class FirebasePhoneAuthService {
  constructor() {
    this.recaptchaVerifier = null;
    this.confirmationResult = null;
  }

  /**
   * Initialize reCAPTCHA verifier
   * @param {string} containerId - ID of the reCAPTCHA container element
   * @param {Function} onSuccess - Callback for successful verification
   * @param {Function} onError - Callback for error
   */
  initializeRecaptcha(containerId = "recaptcha-container", onSuccess, onError) {
    try {
      // Clear existing verifier if any
      if (this.recaptchaVerifier) {
        try {
          this.recaptchaVerifier.clear();
        } catch (e) {
          console.log("Error clearing old verifier:", e);
        }
      }

      // Make sure the container exists
      const container = document.getElementById(containerId);
      if (!container) {
        console.error(`Container element with id '${containerId}' not found`);
        throw new Error(
          `reCAPTCHA container '${containerId}' not found in DOM`
        );
      }

      // Initialize with correct syntax for Firebase v9+
      this.recaptchaVerifier = new RecaptchaVerifier(
        containerId,
        {
          size: "invisible",
          callback: (response) => {
            console.log("reCAPTCHA verified successfully");
            if (onSuccess) onSuccess(response);
          },
          "expired-callback": () => {
            console.log("reCAPTCHA expired");
            if (onError) onError(new Error("reCAPTCHA expired"));
          },
        },
        auth
      );

      return this.recaptchaVerifier;
    } catch (error) {
      console.error("Error initializing reCAPTCHA:", error);
      if (onError) onError(error);
      throw error;
    }
  }

  /**
   * Send OTP to phone number
   * @param {string} phoneNumber - Phone number with country code (e.g., +911234567890)
   * @returns {Promise<Object>} Confirmation result
   */
  async sendOTP(phoneNumber) {
    try {
      // Validate phone number format
      if (!phoneNumber || !phoneNumber.startsWith("+")) {
        throw new Error(
          "Phone number must include country code (e.g., +911234567890)"
        );
      }

      // Initialize reCAPTCHA if not already initialized
      if (!this.recaptchaVerifier) {
        this.initializeRecaptcha();
      }

      // Send OTP
      console.log("Sending OTP to:", phoneNumber);
      this.confirmationResult = await signInWithPhoneNumber(
        auth,
        phoneNumber,
        this.recaptchaVerifier
      );

      console.log("OTP sent successfully");
      return {
        success: true,
        message: "OTP sent successfully",
        confirmationResult: this.confirmationResult,
      };
    } catch (error) {
      console.error("Error sending OTP:", error);

      // Handle specific Firebase errors
      let errorMessage = "Failed to send OTP";

      if (error.code === "auth/invalid-phone-number") {
        errorMessage = "Invalid phone number format";
      } else if (error.code === "auth/too-many-requests") {
        errorMessage = "Too many requests. Please try again later";
      } else if (error.code === "auth/quota-exceeded") {
        errorMessage = "SMS quota exceeded. Please try again later";
      } else if (error.message) {
        errorMessage = error.message;
      }

      throw new Error(errorMessage);
    }
  }

  /**
   * Verify OTP code
   * @param {string} otpCode - 6-digit OTP code
   * @returns {Promise<Object>} User credential
   */
  async verifyOTP(otpCode) {
    try {
      if (!this.confirmationResult) {
        throw new Error("No OTP request found. Please request OTP first");
      }

      // Verify the OTP code
      console.log("Verifying OTP...");
      const result = await this.confirmationResult.confirm(otpCode);

      console.log("OTP verified successfully");
      return {
        success: true,
        message: "Phone number verified successfully",
        user: result.user,
        credential: result,
      };
    } catch (error) {
      console.error("Error verifying OTP:", error);

      let errorMessage = "Failed to verify OTP";

      if (error.code === "auth/invalid-verification-code") {
        errorMessage = "Invalid OTP code. Please check and try again";
      } else if (error.code === "auth/code-expired") {
        errorMessage = "OTP code has expired. Please request a new one";
      } else if (error.message) {
        errorMessage = error.message;
      }

      throw new Error(errorMessage);
    }
  }

  /**
   * Get ID token from current user
   * @returns {Promise<string>} ID token
   */
  async getIdToken() {
    try {
      const user = auth.currentUser;
      if (!user) {
        throw new Error("No user is currently signed in");
      }

      const idToken = await user.getIdToken();
      return idToken;
    } catch (error) {
      console.error("Error getting ID token:", error);
      throw error;
    }
  }

  /**
   * Sign out current user
   */
  async signOut() {
    try {
      await auth.signOut();
      console.log("User signed out successfully");
    } catch (error) {
      console.error("Error signing out:", error);
      throw error;
    }
  }

  /**
   * Clean up reCAPTCHA verifier (but preserve confirmationResult)
   * @param {boolean} clearConfirmation - Whether to also clear confirmation result
   */
  cleanup(clearConfirmation = false) {
    if (this.recaptchaVerifier) {
      try {
        this.recaptchaVerifier.clear();
        this.recaptchaVerifier = null;
      } catch (error) {
        console.error("Error cleaning up reCAPTCHA:", error);
      }
    }

    // Only clear confirmation result if explicitly requested
    if (clearConfirmation) {
      this.confirmationResult = null;
    }
  }

  /**
   * Get current user
   */
  getCurrentUser() {
    return auth.currentUser;
  }

  /**
   * Listen to auth state changes
   * @param {Function} callback - Callback function
   */
  onAuthStateChanged(callback) {
    return auth.onAuthStateChanged(callback);
  }
}

// Create and export a singleton instance
const firebasePhoneAuthService = new FirebasePhoneAuthService();

export default firebasePhoneAuthService;
