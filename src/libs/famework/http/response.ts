export const buildErrorResponse = (message: string, details?: Record<string, string>) => {
  return {
    error: {
      message,
      details,
    },
  };
};
