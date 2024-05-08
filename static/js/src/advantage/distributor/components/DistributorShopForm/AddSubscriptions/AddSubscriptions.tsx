import React, { useContext } from "react";
import { Button, Col, Row, Select } from "@canonical/react-components";
import { FormContext } from "../../../utils/FormContext";
import {
  DistributorProductTypes as ProductTypes,
  SubscriptionItem,
  generateUniqueId,
  Support as SupportEnum,
  SLA as SLAEnum,
} from "advantage/distributor/utils/utils";
import SubscriptionCard from "./SubscriptionCard.tsx/SubscriptionCard";

const AddSubscriptions = () => {
  const {
    productType,
    setProductType,
    subscriptionList,
    setSubscriptionList,
  } = useContext(FormContext);

  const handleProductTypeChange = (
    event: React.ChangeEvent<HTMLSelectElement>
  ) => {
    setProductType(event.target.value as ProductTypes);
    localStorage.setItem(
      "distributor-selector-productType",
      JSON.stringify(event.target.value as ProductTypes)
    );
  };

  const handleAddProduct = (event: React.MouseEvent<HTMLElement>) => {
    event.preventDefault();
    const id = generateUniqueId();
    const subscriptionItem: SubscriptionItem = {
      id: id,
      type: productType,
      sla: SLAEnum.none,
      support: SupportEnum.none,
      quantity: 1,
    };
    setSubscriptionList([...subscriptionList, subscriptionItem]);
    localStorage.setItem(
      "distributor-selector-subscriptionList",
      JSON.stringify([...subscriptionList, subscriptionItem])
    );
  };

  const products = [
    { label: "Ubuntu Pro Physical", value: ProductTypes.physical },
    { label: "Ubuntu Pro Desktop", value: ProductTypes.desktop },
    { label: "Ubuntu Pro Virtual", value: ProductTypes.virtual },
  ];

  return (
    <div data-testid="wrapper">
      <p>Ubuntu Pro is avaiable for Ubuntu 14.04 and higher:</p>
      {subscriptionList?.length > 0 &&
        subscriptionList.map((subscription: SubscriptionItem) => {
          return (
            <SubscriptionCard
              key={subscription.id}
              subscription={subscription}
            />
          );
        })}
      <Row>
        <Col size={6}>
          <div style={{ display: "flex", alignItems: "end" }}>
            <div>
              <Select
                label="Select a subscription:"
                name="subscription-select"
                defaultValue={productType}
                options={
                  products &&
                  products.map((product) => {
                    return {
                      label: product.label,
                      value: product.value,
                    };
                  })
                }
                onChange={handleProductTypeChange}
              />
            </div>
            <div>
              <Button
                className="p-button"
                style={{
                  backgroundColor: "#262626",
                  color: "#fff",
                  marginLeft: "0.5rem",
                }}
                onClick={handleAddProduct}
              >
                Add
              </Button>
            </div>
          </div>
        </Col>
      </Row>
    </div>
  );
};

export default AddSubscriptions;
