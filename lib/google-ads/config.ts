export function isGoogleAdsConfigured(): boolean {
  return Boolean(
    process.env.GOOGLE_ADS_DEVELOPER_TOKEN &&
      process.env.GOOGLE_ADS_CLIENT_ID &&
      process.env.GOOGLE_ADS_CLIENT_SECRET &&
      process.env.GOOGLE_ADS_REFRESH_TOKEN &&
      process.env.GOOGLE_ADS_CUSTOMER_ID &&
      process.env.GOOGLE_ADS_LOGIN_CUSTOMER_ID,
  );
}

export function getGoogleAdsConfig() {
  return {
    developerToken: process.env.GOOGLE_ADS_DEVELOPER_TOKEN!,
    clientId: process.env.GOOGLE_ADS_CLIENT_ID!,
    clientSecret: process.env.GOOGLE_ADS_CLIENT_SECRET!,
    refreshToken: process.env.GOOGLE_ADS_REFRESH_TOKEN!,
    customerId: process.env.GOOGLE_ADS_CUSTOMER_ID ?? "8314947794",
    loginCustomerId: process.env.GOOGLE_ADS_LOGIN_CUSTOMER_ID ?? "1230399435",
    signupActionId:
      process.env.BETCLEAR_SIGNUP_CONVERSION_ACTION_ID ?? "7695195570",
    trialActionId:
      process.env.BETCLEAR_TRIAL_CONVERSION_ACTION_ID ?? "7694794750",
    purchaseActionId:
      process.env.BETCLEAR_PURCHASE_CONVERSION_ACTION_ID ?? "7694795221",
  };
}
