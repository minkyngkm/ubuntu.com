import React from "react";
import { Row, Col, Strip, Card } from "@canonical/react-components";
import { Offer as OfferType } from "../../../../offers/types";
import DistributorBuyButton from "../../DistributorBuyButton/DistributorBuyButton";

type Prop = {
  offer: OfferType;
};

const OrderDetail = () => {
  return (
    <Card className="order-detail-card">
      <div>Details</div>
      <div className="order-field">
        <div className="order-field-product">
          <div className="order-label">Ubuntu Pro Desktop</div>
          <div className="order-value">Self support, 1 machine, 3 years</div>
          <div className="order-value">CQC1X1902</div>
        </div>
        <div className="order-value">$885.00</div>
      </div>
      <div className="order-field">
        <div>
          <div className="order-label">Ubuntu Pro Physical</div>
          <div className="order-value">
            Self support, infra, 1 machine, 3 years
          </div>
          <div className="order-value">CQC1X1902</div>
        </div>
        <div className="order-value">$885.00</div>
      </div>
      <hr />
      <div className="order-field">
        <div className="order-label">Subtotal</div>
        <div className="order-value">$XXX</div>
      </div>
      <hr />
      <div className="order-field">
        <div className="order-label">Discount (15% off subtotal) </div>
        <div className="order-value">$XXX</div>
      </div>
      <hr />
      <div className="order-field">
        <div className="order-label">VAT(7% on subtotal)</div>
        <div className="order-value">$XX</div>
      </div>
      <hr />
      <div className="order-total-field">
        <div className="order-label">Total per year</div>
        <div className="order-value">$XX</div>
      </div>
      <DistributorBuyButton />
    </Card>
  );
};

export default OrderDetail;
