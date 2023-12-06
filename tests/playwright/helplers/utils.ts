export const getRandomEmail = () =>
   `playwright-test-${Math.random().toString(36).substring(2,12)}@canonical.com`;
   