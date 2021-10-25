import { EntitlementType, SupportLevel } from "advantage/api/enum";
import { UserSubscriptionEntitlement } from "advantage/api/types";

export enum EntitlementLabel {
  Cis = "CIS",
  Blender = "Blender",
  EsmInfra = "ESM Infra",
  FipsUpdates = "FIPS-Updates",
  Fips = "FIPS",
  Livepatch = "Livepatch",
  SupportStandard = "24/5 Support",
  SupportAdvanced = "24/7 Support",
}

const alwaysAvailableLabels: Record<string, EntitlementLabel> = {
  [EntitlementType.Cis]: EntitlementLabel.Cis,
  [EntitlementType.Fips]: EntitlementLabel.Fips,
  [EntitlementType.FipsUpdates]: EntitlementLabel.FipsUpdates,
};

const labels: Record<string, EntitlementLabel | null> = {
  [EntitlementType.Blender]: EntitlementLabel.Blender,
  [EntitlementType.CcEal]: null,
  [EntitlementType.EsmApps]: null,
  [EntitlementType.EsmInfra]: EntitlementLabel.EsmInfra,
  [EntitlementType.Livepatch]: EntitlementLabel.Livepatch,
  [EntitlementType.LivepatchOnprem]: EntitlementLabel.Livepatch,
  ...alwaysAvailableLabels,
};

const supportLabels: Record<string, EntitlementLabel | null> = {
  [SupportLevel.None]: null,
  [SupportLevel.Essential]: null,
  [SupportLevel.Standard]: EntitlementLabel.SupportStandard,
  [SupportLevel.Advanced]: EntitlementLabel.SupportAdvanced,
};

export type Feature = {
  isChecked: boolean;
  isDisabled: boolean;
  label: EntitlementLabel | null;
  type: EntitlementType;
};

export const getEntitlementLabel = (
  entitlement: UserSubscriptionEntitlement
): EntitlementLabel | null =>
  entitlement.support_level
    ? supportLabels[entitlement.support_level]
    : labels[entitlement.type as EntitlementType];

export const formatEntitlementToFeature = (
  entitlement: UserSubscriptionEntitlement
): Feature => ({
  type: entitlement.type as EntitlementType,
  label: entitlement.support_level
    ? supportLabels[entitlement.support_level]
    : labels[entitlement.type as EntitlementType],
  isChecked: entitlement.enabled_by_default,
  isDisabled: !entitlement.is_editable,
});

export type FeaturesDisplay = {
  included: Feature[];
  excluded: Feature[];
  alwaysAvailable: Feature[];
};

export type EntitlementsStore = {
  byLabel: Record<string, UserSubscriptionEntitlement>;
  included: EntitlementLabel[];
  excluded: EntitlementLabel[];
  alwaysAvailable: EntitlementLabel[];
};

export const receiveEntitlements = (
  entitlements: UserSubscriptionEntitlement[]
): EntitlementsStore => {
  const byLabel: Record<string, UserSubscriptionEntitlement> = {};
  const allLabels: EntitlementLabel[] = [];
  const { included, excluded, alwaysAvailable } = groupEntitlements(
    entitlements
  );

  entitlements.forEach((entitlement) => {
    const label = getEntitlementLabel(entitlement);
    if (label && !allLabels.includes(label)) {
      byLabel[label] = entitlement;
    }
  });

  return {
    byLabel,
    included,
    excluded,
    alwaysAvailable,
  };
};

export const groupEntitlements = (
  entitlements: UserSubscriptionEntitlement[]
) => {
  const included: EntitlementLabel[] = [];
  const excluded: EntitlementLabel[] = [];
  const alwaysAvailable: EntitlementLabel[] = [];

  entitlements.forEach((entitlement) => {
    const label = getEntitlementLabel(entitlement);
    if (label) {
      if (entitlement.type in alwaysAvailableLabels) {
        alwaysAvailable.push(label);
      } else if (entitlement.is_available && !included.includes(label)) {
        included.push(label);
      } else if (
        !entitlement.is_available &&
        !entitlement.is_editable &&
        !excluded.includes(label)
      ) {
        excluded.push(label);
      }
    }
  });

  return { included, excluded, alwaysAvailable };
};
