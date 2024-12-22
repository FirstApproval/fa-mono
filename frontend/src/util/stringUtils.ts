export const isNonEmptyString = (str: string | null | undefined): boolean => {
  return !!str && str.trim().length > 0;
};
