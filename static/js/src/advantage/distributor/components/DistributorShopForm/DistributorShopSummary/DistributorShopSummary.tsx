import React, { useContext } from "react";
import { Chip, Col, Row, Select } from "@canonical/react-components";
// import { currencyFormatter } from "advantage/react/utils";
// import { FormContext } from "../../utils/FormContext";
// import { isMonthlyAvailable, Periods } from "../../utils/utils";
import PaymentButton from "../PaymentButton";

const DistributorShopSummary = () => {
  // const {
  //   productUser,
  //   quantity,
  //   period,
  //   setPeriod,
  //   product,
  //   productType,
  // } = useContext(FormContext);
  // const handlePeriodChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
  //   setPeriod(event.target.value as Periods);
  //   localStorage.setItem(
  //     "pro-selector-period",
  //     JSON.stringify(event.target.value as Periods)
  //   );
  // };
  // const isHidden =
  //   productUser === ProductUsers.organisation &&
  //   (!product ||
  //     !quantity ||
  //     +quantity < 1 ||
  //     isPublicCloud(productType) ||
  //     isIoTDevice(productType));
  return (
    <>
      <section
        className="p-strip--light is-shallow p-shop-cart u-hide--small u-hide--medium"
        id="summary-section"
        data-testid="summary-section"
      >
        <Row className="u-sv3">
          <Col size={4}>
            <h5>Total before discount</h5>
          </Col>
          <Col size={6}>
            <h5>Discounts</h5>
          </Col>
          <Col size={2} className="u-align--right">
            <h5>Total per year</h5>
          </Col>
          <hr />
          <Col size={4}>
            <p className="p-heading--2" data-testid="summary-product-name">
              $XXX
            </p>
          </Col>
          <Col size={6}>
            <Chip value="X% discount applied" appearance="information" style={{ marginTop: "0.5rem"}}/>
          </Col>
          <Col size={2} className="u-align--right">
            <p className="p-heading--2">
              {/* {currencyFormatter.format(
                    ((product?.price.value ?? 0) / 100) *
                      (Number(quantity) ?? 0)
                  )} */}
                  $500.00
            </p>{" "}
            <p className="p-text--small">
              Any applicable taxes are <br /> calculated at checkout
            </p>
          </Col>
          <Col
            className="u-align--right"
            size={4}
            emptyLarge={9}
            style={{ display: "flex", alignItems: "center" }}
          >
            <PaymentButton />
          </Col>
        </Row>
      </section>
    </>
  );
};

export default DistributorShopSummary;
