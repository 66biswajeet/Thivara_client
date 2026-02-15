import SearchableSelectInput from "@/components/widgets/inputFields/SearchableSelectInput";
import { AllCountryCode } from "@/data/CountryCode";
import Btn from "@/elements/buttons/Btn";
import { Href } from "@/utils/constants";
import useFirebasePhoneAuth from "@/utils/hooks/useFirebasePhoneAuth";
import Cookies from "js-cookie";
import { YupObject, nameSchema } from "@/utils/validation/ValidationSchema";
import { ErrorMessage, Field, Form, Formik } from "formik";
import { useState } from "react";
import { useTranslation } from "react-i18next";
import { Col } from "reactstrap";
import { toast } from "react-toastify";

const NumberLoginForm = ({ setState }) => {
  const { t } = useTranslation("common");
  const [showBoxMessage, setShowBoxMessage] = useState();
  const { sendOTP, loading } = useFirebasePhoneAuth();

  return (
    <Formik
      initialValues={{
        country_code: "91",
        phone: "",
      }}
      validationSchema={YupObject({
        phone: nameSchema,
      })}
      onSubmit={async (values, actions) => {
        try {
          // Format phone number with country code
          const phoneString = `+${values.country_code}${values.phone}`.replace(
            /\s+/g,
            ""
          );

          // Send OTP via Firebase
          const result = await sendOTP(phoneString);

          if (result.success) {
            // Store phone info in cookies for OTP verification step
            Cookies.set("uc", values.country_code, { path: "/" });
            Cookies.set("up", values.phone, { path: "/" });

            // Move to OTP verification step
            setState("otp");
          }
        } catch (err) {
          console.error("Firebase sendOtp error:", err);
          setShowBoxMessage(err.message || "Failed to send OTP");
          toast.error(err.message || "Failed to send OTP");
        } finally {
          actions.setSubmitting(false);
        }
      }}
    >
      {({ errors, touched, setFieldValue }) => (
        <div className="auth-form-box ">
          {showBoxMessage && (
            <div role="alert" className="alert alert-danger login-alert">
              <i className="ri-error-warning-line"></i> {showBoxMessage}
            </div>
          )}
          <Form>
            <Col xs="12" className="phone-field mb-3">
              <div className="form-box">
                <SearchableSelectInput
                  nameList={[
                    {
                      name: "country_code",
                      notitle: "true",
                      inputprops: {
                        name: "country_code",
                        id: "country_code",
                        options: AllCountryCode,
                      },
                    },
                  ]}
                />
                <Field
                  className="form-control"
                  name="phone"
                  placeholder={t("EnterPhoneNumber")}
                  type="number"
                />
                {errors.phone && touched?.phone && (
                  <ErrorMessage
                    render={() => (
                      <div className="invalid-feedback">{errors.phone}</div>
                    )}
                  />
                )}
              </div>
            </Col>
            {/* reCAPTCHA container - required for Firebase Phone Auth */}
            <div
              id="recaptcha-container"
              style={{ marginBottom: "1rem" }}
            ></div>
            <Btn type="submit" loading={loading} disabled={loading}>
              {t("SendOtp")}
            </Btn>
            <a
              onClick={() => setState("login")}
              href={Href}
              className="modal-back"
            >
              <i className="ri-arrow-left-line"></i>
            </a>
          </Form>
        </div>
      )}
    </Formik>
  );
};

export default NumberLoginForm;
