// post /pro/purchase/preview${window.location.search}
export const previewWithTaxResponse = {
  "currency": "usd",
  "end_of_cycle": "",
  "id": "",
  "items": null,
  "payment_status": null,
  "reason": "subscription_create",
  "start_of_cycle": "",
  "status": "draft",
  "tax_amount": 9500,
  "total": 59500,
  "url": null
}

// post /pro/purchase/preview${window.location.search}
export const previewResponse = {
  "currency": "usd",
  "end_of_cycle": "",
  "id": "",
  "items": null,
  "payment_status": null,
  "reason": "subscription_create",
  "start_of_cycle": "",
  "status": "draft",
  "tax_amount": null,
  "total": 50000,
  "url": null
}
// post /account/customer-info${queryString}`
export const customerInfoPost = {
  "createdAt": "2023-06-21T10:19:18Z",
  "externalAccountIDs": [
      {
          "IDs": [
              "cus_OAc0ko9kKLLpn2"
          ],
          "origin": "Stripe"
      },
      {
          "IDs": [
              "0013M00001QN0K4QAL"
          ],
          "origin": "Salesforce"
      }
  ],
  "id": "aACd-Dgydz9UmVpft445tErM1NIVHbVhX-G7bbxzAWgQ",
  "lastModifiedAt": "2023-08-08T11:04:08Z",
  "name": "Canonical",
  "type": "paid"
}
// get /account/customer-info/${accountId}${queryString}
export const customerInfoResponse = {
    "accountInfo": {
        "createdAt": "2023-06-21T10:19:18Z",
        "externalAccountIDs": [
            {
                "IDs": [
                    "cus_OAc0ko9kKLLpn2"
                ],
                "origin": "Stripe"
            },
            {
                "IDs": [
                    "0013M00001QN0K4QAL"
                ],
                "origin": "Salesforce"
            }
        ],
        "id": "aACd-Dgydz9UmVpft445tErM1NIVHbVhX-G7bbxzAWgQ",
        "lastModifiedAt": "2023-08-08T11:04:08Z",
        "name": "Canonical",
        "type": "paid"
    },
    "customerInfo": {
        "address": {
            "city": "test",
            "country": "JP",
            "line1": "test 2",
            "line2": "",
            "postal_code": "test",
            "state": ""
        },
        "defaultPaymentMethod": {
            "brand": "visa",
            "country": "US",
            "expMonth": 4,
            "expYear": 2024,
            "id": "pm_1OJqfSCzjFajHovdEN8RvPf8",
            "last4": "4242"
        },
        "email": "min.kim+nopayment15@canonical.com",
        "name": "MIn Kim"
    }
}
// post /pro/purchase/preview${window.location.search}`,
export const postPurchasePreview = {
  "currency": "usd",
  "end_of_cycle": "",
  "id": "",
  "items": null,
  "payment_status": null,
  "reason": "subscription_create",
  "start_of_cycle": "",
  "status": "draft",
  "tax_amount": null,
  "total": 50000,
  "url": null
}

// post /pro/purchase${window.location.search}
export const postPurchase = {
  "account_id": "aACd-Dgydz9UmVpft445tErM1NIVHbVhX-G7bbxzAWgQ",
  "created_at": "2023-12-05T05:06:29.092Z",
  "id": "pACqssxVzUmSeZ_Zk1PX4CTOfN96p8_sloJQWzmXYSpo",
  "invoice": null,
  "items": [
      {
          "listing": null,
          "listing_id": "lANXjQ-H8fzvf_Ea8bIK1KW7Wi2W0VHnV0ZUsrEGbUiQ",
          "value": 1
      }
  ],
  "marketplace": "canonical-ua",
  "status": "processing",
  "subscription_id": "sAGvVQrPcqlOMYtNL_xF-IlUCOa-caKI4x9xs3N8TkK0"
}
export const getPurchase = {
  "accountID": "aACd-Dgydz9UmVpft445tErM1NIVHbVhX-G7bbxzAWgQ",
  "createdAt": "2023-12-05T05:06:29.092Z",
  "createdBy": "xsh4xFK",
  "id": "pACqssxVzUmSeZ_Zk1PX4CTOfN96p8_sloJQWzmXYSpo",
  "lastModified": "2023-12-05T05:06:32.019Z",
  "marketplace": "canonical-ua",
  "purchaseItems": [
      {
          "paidForInCycle": 1,
          "productListingID": "lANXjQ-H8fzvf_Ea8bIK1KW7Wi2W0VHnV0ZUsrEGbUiQ",
          "value": 1
      }
  ],
  "status": "processing",
  "subscriptionID": "sAGvVQrPcqlOMYtNL_xF-IlUCOa-caKI4x9xs3N8TkK0"
}

  