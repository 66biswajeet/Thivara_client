import Btn from "@/elements/buttons/Btn";
import { Href } from "@/utils/constants";
import { obscureEmail } from "@/utils/customFunctions/EmailFormats";
import Cookies from "js-cookie";
import { useState } from "react";
import { useTranslation } from "react-i18next";
import { Input } from "reactstrap";
import useFirebasePhoneAuth from "@/utils/hooks/useFirebasePhoneAuth";
import { toast } from "react-toastify";

const OTPVerificationForm = ({ setState }) => {
  const mobileNumber = Cookies.get("up");
  const email = Cookies.get("ue");
  const [otp, setOtp] = useState("");
  const { t } = useTranslation("common");
  const { verifyOTP, loading, resendOTP } = useFirebasePhoneAuth();

  const handleChange = (e) => {
    if (e.target.value.length <= 6 && !isNaN(Number(e.target.value))) {
      setOtp(e.target.value);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (otp.length !== 6) {
      toast.error("Please enter a valid 6-digit OTP");
      return;
    }

    try {
      const result = await verifyOTP(otp);
      if (result?.success) {
        // Success is handled in the hook (redirect, etc.)
        console.log("OTP verified successfully");
        // Reset OTP input
        setOtp("");
      }
    } catch (err) {
      console.error("OTP verify error:", err);
    }
  };

  const handleResendOTP = async () => {
    try {
      const result = await resendOTP();
      if (result.success) {
        setOtp(""); // Clear OTP input
      }
    } catch (err) {
      console.error("Resend OTP error:", err);
    }
  };

  return (
    <>
      <form className="auth-form-box" onSubmit={handleSubmit}>
        <div className="log-in-title">
          <h5>
            {t("CodeSend") + " "}
            <span>{mobileNumber || obscureEmail(email)}</span>
          </h5>
        </div>
        <div className="auth-box mb-3 outer-otp">
          <div className="inner-otp" id="otp">
            <Input
              type="text"
              className="no-background"
              maxLength={6}
              onChange={handleChange}
              value={otp}
              placeholder="Enter 6-digit OTP"
            />
          </div>
        </div>
        <Btn
          type="submit"
          loading={loading}
          disabled={loading || otp.length !== 6}
        >
          {t("VerifyOtp")}
        </Btn>
        <div className="resend-otp mt-3 text-center">
          <button
            type="button"
            onClick={handleResendOTP}
            className="btn btn-link"
            disabled={loading}
          >
            {t("ResendOTP") || "Resend OTP"}
          </button>
        </div>
        <a
          onClick={() => setState("forgot")}
          href={Href}
          className="modal-back"
        >
          <i className="ri-arrow-left-line"></i>
        </a>
      </form>
      {/* reCAPTCHA container - required for Firebase Phone Auth */}
      <div id="recaptcha-container"></div>
    </>
  );
};

export default OTPVerificationForm;
