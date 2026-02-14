export const calculateMatchScore = (
  userInterests: string[],
  offerCategory: string
): number => {
  if (userInterests.includes(offerCategory)) {
    return 90;
  }
  return 50;
};
