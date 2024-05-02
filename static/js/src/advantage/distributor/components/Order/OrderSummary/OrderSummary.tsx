import React from "react";
import { Row, Col } from "@canonical/react-components";
import { Offer as OfferType } from "../../../../offers/types";

// type Prop = {
//   offer: OfferType;
// };

const OrderSummary = () => {
  return (
    <>
      <div className="p-section--shallow">
        <div className="order-summary-label">Order ID</div>
        <div className="order-summary-value">12345</div>
        <div className="order-summary-label">Deal registreation ID</div>
        <div className="order-summary-value">DR12345</div>
        <div>
          <hr className="p-rule u-sv3" />
        </div>
      </div>
      <div className="p-section--shallow">
        <Row>
          <Col size={3}>
            <div className="p-text--small-caps">Reseller's contact</div>
            <div>John Doe</div>
            <div className="order-summary-value">John.doe@acne.com</div>
            <div>Acne Inc. United States</div>
            <div className="u-text--muted">123 Address place,</div>
            <div className="u-text--muted">San Francisco</div>
            <div className="u-text--muted">California, 94016</div>
            <div className="u-text--muted">United States</div>
          </Col>
          <Col size={3}>
            <div className="p-text--small-caps">Techinical user's contact</div>
            <div>Maya Sardegna</div>
            <div className="order-summary-value">Maya.sardegna@tuc.com</div>
            <div>TechUserCorp. Germany</div>
            <div className="u-text--muted">456 Address place,</div>
            <div className="u-text--muted">Berlin</div>
            <div className="u-text--muted">Branderburg 10115,</div>
            <div className="u-text--muted">Germany</div>
          </Col>
        </Row>
      </div>
    </>
  );
};

export default OrderSummary;
