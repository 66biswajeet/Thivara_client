import NoDataFound from "@/components/widgets/NoDataFound";
import CartContext from "@/context/cartContext";
import SettingContext from "@/context/settingContext";
import Loader from "@/layout/loader";
import React, { useContext, useMemo } from "react";
import { useTranslation } from "react-i18next";
import ApplyCoupon from "./ApplyCoupon";
import PlaceOrder from "./PlaceOrder";
import PointWallet from "./PointWallet";

const BillingSummary = ({
  data,
  values,
  setFieldValue,
  isLoading,
  mutate,
  storeCoupon,
  setStoreCoupon,
  errorCoupon,
  appliedCoupon,
  setAppliedCoupon,
  errors,
}) => {
  const { convertCurrency } = useContext(SettingContext);
  const { cartProducts } = useContext(CartContext);
  const { t } = useTranslation("common");

  // Calculate subtotal from cart products
  const subtotal = useMemo(() => {
    return cartProducts.reduce((total, item) => {
      const price = item?.variation
        ? item?.variation?.sale_price
        : item?.product?.sale_price;
      return total + (parseFloat(price) || 0) * (item?.quantity || 1);
    }, 0);
  }, [cartProducts]);

  // Get tax and shipping from API response or fallback to 0
  const taxAmount = data?.data?.total?.tax_total || 0;
  const shippingAmount = data?.data?.total?.shipping_total || 0;
  const discountAmount = data?.data?.total?.coupon_total_discount || 0;
  const total =
    data?.data?.total?.grand_total ||
    subtotal + taxAmount + shippingAmount - discountAmount;

  return (
    <div className="checkout-details ">
      {cartProducts?.length > 0 ? (
        <div className="order-box">
          <div className="title-box">
            <h4>{t("BillingSummary")}</h4>
            <ApplyCoupon
              values={values}
              setFieldValue={setFieldValue}
              data={data}
              storeCoupon={storeCoupon}
              setStoreCoupon={setStoreCoupon}
              errorCoupon={errorCoupon}
              appliedCoupon={appliedCoupon}
              setAppliedCoupon={setAppliedCoupon}
              mutate={mutate}
              isLoading={isLoading}
            />
          </div>
          <div>
            <div className="custom-box-loader">
              {isLoading && (
                <div className="box-loader">
                  <Loader />
                </div>
              )}
              <ul className="sub-total">
                <li>
                  {t("Subtotal")}
                  <span className="count">{convertCurrency(subtotal)}</span>
                </li>
                <li>
                  {t("Shipping")}
                  <span className="count">
                    {convertCurrency(shippingAmount)}
                  </span>
                </li>
                <li>
                  {t("Tax")}
                  <span className="count">{convertCurrency(taxAmount)}</span>
                </li>

                <PointWallet
                  values={values}
                  setFieldValue={setFieldValue}
                  data={data}
                />
              </ul>
              <ul className="total">
                {appliedCoupon == "applied" && discountAmount ? (
                  <li className="list-total">
                    {t("YouSave")}
                    <span className="count">
                      {convertCurrency(discountAmount - taxAmount)}
                    </span>
                  </li>
                ) : null}
                <li className="list-total">
                  {t("Total")}
                  <span className="count">{convertCurrency(total)}</span>
                </li>
              </ul>
              <PlaceOrder values={values} errors={errors} />
            </div>
          </div>
        </div>
      ) : (
        <NoDataFound
          customClass="no-data-added"
          height={156}
          width={180}
          imageUrl={`/assets/svg/empty-items.svg`}
          title="EmptyCart"
        />
      )}
    </div>
  );
};

export default BillingSummary;
