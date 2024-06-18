import React, { useContext } from "react";
import { Button } from "@canonical/react-components";
import { Offer as OfferType } from "../../../offers/types";
import { FormContext } from "advantage/distributor/utils/FormContext";

type Prop = {
  offer: OfferType;
};

export default function InitiateButton({ offer }: Prop) {
  const { setOffer } = useContext(FormContext);
  const actionButton = offer.purchase ? (
    <Button
      className="u-no-margin--bottom"
      disabled
      style={{ backgroundColor: "#262626", color: "#fff" }}
    >
      Already used
    </Button>
  ) : offer.actionable ? (
    <Button
      className="u-no-margin--bottom"
      onClick={(e) => {
        e.preventDefault();
        setOffer(offer);
        localStorage.setItem("channel-offer-data", JSON.stringify(offer));
        location.href = "/pro/distributor/shop";
      }}
    >
      Initiate order
    </Button>
  ) : (
    <Button
      className="u-no-margin--bottom"
      appearance="negative"
      onClick={() => (location.href = "/pro/help")}
    >
      Report issue
    </Button>
  );

  return <div className="distributor-initiate-button">{actionButton}</div>;
}
