import React from "react";
import { Col, Row, Strip } from "@canonical/react-components";
import OrderSummary from "./components/Order/OrderSummary/OrderSummary";
import OrderDetail from "./components/Order/OrderDetail/OrderDetail";

const Order = () => {
  const channelOfferData = localStorage.getItem("channel-offer-data") || "";
  const parsedChannelOfferData = JSON.parse(channelOfferData);
  const offer = parsedChannelOfferData?.offer;

  if (!parsedChannelOfferData || !offer) {
    return (
      <Strip className="u-no-padding--top">
        <h1>Somethinig is wrong.</h1>
        <p className="p-heading--4">
          Initiate order again at <a href="/pro/distributor">this page</a>.
        </p>
      </Strip>
    );
  }

  return (
    <Strip style={{ overflow: "unset" }}>
      <div className="p-section">
        <h1>Your order</h1>
      </div>
      <Row>
        <Col size={7}>
          <OrderSummary />
        </Col>
        <Col size={5}>
          <OrderDetail />
        </Col>
      </Row>
    </Strip>
  );
};

export default Order;
