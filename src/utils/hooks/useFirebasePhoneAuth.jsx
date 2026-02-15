import { useState, useCallback, useEffect, useContext } from "react";
import { useMutation } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import Cookies from "js-cookie";
import { toast } from "react-toastify";
import firebasePhoneAuthService from "@/utils/firebase/phoneAuthService";
import request from "@/utils/axiosUtils";
import { LoginPhnAPI, SyncCart, CompareAPI } from "@/utils/axiosUtils/API";
import useCreate from "./useCreate";
import AccountContext from "@/context/accountContext";
import CartContext from "@/context/cartContext";
import CompareContext from "@/context/compareContext";
import ThemeOptionContext from "@/context/themeOptionsContext";
import WishlistContext from "@/context/wishlistContext";

/**
 * Transform local storage cart data for syncing
 */
const transformLocalStorageData = (items) => {
  return items?.map((item) => ({
    product_id: item.product_id || item.id,
    variation_id: item.variation_id,
    quantity: item.quantity,
  }));
};

/**
 * Handle login after Firebase authentication
 */
const handleFirebaseLogin = async (
  firebaseUser,
  router,
  refetch,
  compareRefetch,
  callbackUrl,
  mutate,
  cartRefetch,
  addToWishlist,
  compareCartMutate,
  setOpenAuthModal
) => {
  try {
    // Get Firebase ID token
    const idToken = await firebaseUser.getIdToken();

    // Send token to backend for verification and session creation
    const response = await request({
      url: LoginPhnAPI,
      method: "post",
      data: {
        firebaseToken: idToken,
        phoneNumber: firebaseUser.phoneNumber,
        uid: firebaseUser.uid,
      },
    });

    if (response.status === 200 || response.status === 201) {
      // Extract data from response (backend returns { success, message, data: {...} })
      const userData = response.data?.data || response.data;

      // Set authentication cookie
      Cookies.set("uat", userData?.access_token, {
        path: "/",
        expires: new Date(Date.now() + 24 * 60 * 60000),
      });

      // Store account data
      if (typeof window !== "undefined") {
        Cookies.set("account", JSON.stringify(userData));
        localStorage.setItem("account", JSON.stringify(userData));
      }

      // Sync local cart to server
      const oldCartValue = JSON.parse(localStorage.getItem("cart"))?.items;
      if (oldCartValue?.length > 0) {
        mutate(transformLocalStorageData(oldCartValue));
      }

      // Refetch user data
      refetch();
      compareRefetch();
      cartRefetch();

      // Handle wishlist and compare
      const wishListID = Cookies.get("wishListID");
      const CompareId = Cookies.get("compareId");

      if (CompareId) {
        compareCartMutate({ product_id: CompareId });
      }

      if (wishListID) {
        addToWishlist({ id: wishListID });
      }

      // Clean up
      Cookies.remove("wishListID");
      Cookies.remove("compareId");
      Cookies.remove("up"); // Remove phone number cookie
      localStorage.removeItem("cart");

      // Close modal and redirect
      setOpenAuthModal(false);

      // Small delay to ensure modal closes before redirect
      setTimeout(() => {
        router.push(callbackUrl || "/account/dashboard");
      }, 100);

      toast.success("Login successful!");
      return { success: true };
    } else {
      throw new Error(response.response?.data?.message || "Login failed");
    }
  } catch (error) {
    console.error("Login error:", error);
    toast.error(error.message || "Login failed. Please try again.");
    return { success: false, error };
  }
};

/**
 * Custom hook for Firebase phone authentication
 */
const useFirebasePhoneAuth = () => {
  const [phoneNumber, setPhoneNumber] = useState("");
  const [otpCode, setOtpCode] = useState("");
  const [step, setStep] = useState("phone"); // 'phone' | 'otp'
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const router = useRouter();
  const { setOpenAuthModal } = useContext(ThemeOptionContext);
  const { mutate } = useCreate(SyncCart, false, false, "No");
  const { addToWishlist } = useContext(WishlistContext);
  const { mutate: compareCartMutate } = useCreate(
    CompareAPI,
    false,
    false,
    "Added to Compare List"
  );
  const callbackUrl = Cookies.get("CallBackUrl") || "/";
  const { refetch } = useContext(AccountContext);
  const { refetch: cartRefetch } = useContext(CartContext);
  const { refetch: compareRefetch } = useContext(CompareContext);

  // Initialize reCAPTCHA on mount
  useEffect(() => {
    if (typeof window !== "undefined") {
      // Wait for DOM to be ready
      const initRecaptcha = () => {
        try {
          const container = document.getElementById("recaptcha-container");
          if (container) {
            firebasePhoneAuthService.initializeRecaptcha("recaptcha-container");
            console.log("reCAPTCHA initialized successfully");
          } else {
            console.warn("reCAPTCHA container not found, retrying...");
            // Retry after a short delay
            setTimeout(initRecaptcha, 100);
          }
        } catch (error) {
          console.error("Failed to initialize reCAPTCHA:", error);
        }
      };

      // Initialize after a small delay to ensure DOM is ready
      setTimeout(initRecaptcha, 100);
    }

    // DON'T cleanup on unmount - preserve confirmationResult across component transitions
    // Cleanup only happens when user explicitly resets or completes authentication
    return () => {
      // Only clear reCAPTCHA verifier, keep confirmationResult
      if (firebasePhoneAuthService.recaptchaVerifier) {
        try {
          firebasePhoneAuthService.recaptchaVerifier.clear();
        } catch (e) {
          console.log("Recaptcha already cleared");
        }
      }
    };
  }, []);

  /**
   * Send OTP to phone number
   */
  const sendOTP = useCallback(async (phone) => {
    setLoading(true);
    setError(null);

    try {
      // Ensure phone number has country code
      const formattedPhone = phone.startsWith("+") ? phone : `+${phone}`;

      const result = await firebasePhoneAuthService.sendOTP(formattedPhone);

      if (result.success) {
        setPhoneNumber(formattedPhone);
        setStep("otp");
        toast.success("OTP sent successfully!");
        return { success: true };
      }
    } catch (error) {
      console.error("Send OTP error:", error);
      setError(error.message);
      toast.error(error.message || "Failed to send OTP");
      return { success: false, error };
    } finally {
      setLoading(false);
    }
  }, []);

  /**
   * Verify OTP and login
   */
  const verifyOTP = useCallback(
    async (otp) => {
      setLoading(true);
      setError(null);

      try {
        const result = await firebasePhoneAuthService.verifyOTP(otp);

        if (result.success && result.user) {
          // Handle login with backend
          await handleFirebaseLogin(
            result.user,
            router,
            refetch,
            compareRefetch,
            callbackUrl,
            mutate,
            cartRefetch,
            addToWishlist,
            compareCartMutate,
            setOpenAuthModal
          );

          return { success: true };
        }
      } catch (error) {
        console.error("Verify OTP error:", error);
        setError(error.message);
        toast.error(error.message || "Failed to verify OTP");
        return { success: false, error };
      } finally {
        setLoading(false);
      }
    },
    [
      router,
      refetch,
      compareRefetch,
      callbackUrl,
      mutate,
      cartRefetch,
      addToWishlist,
      compareCartMutate,
      setOpenAuthModal,
    ]
  );

  /**
   * Resend OTP
   */
  const resendOTP = useCallback(async () => {
    if (!phoneNumber) {
      toast.error("Phone number not found. Please start over.");
      return { success: false };
    }

    return await sendOTP(phoneNumber);
  }, [phoneNumber, sendOTP]);

  /**
   * Reset to phone step
   */
  const resetToPhoneStep = useCallback(() => {
    setStep("phone");
    setPhoneNumber("");
    setOtpCode("");
    setError(null);
    Cookies.remove("up"); // Clear phone number cookie
    firebasePhoneAuthService.cleanup(true); // Clear both recaptcha and confirmation
  }, []);

  return {
    phoneNumber,
    otpCode,
    step,
    loading,
    error,
    sendOTP,
    verifyOTP,
    resendOTP,
    resetToPhoneStep,
    setPhoneNumber,
    setOtpCode,
  };
};

export default useFirebasePhoneAuth;
