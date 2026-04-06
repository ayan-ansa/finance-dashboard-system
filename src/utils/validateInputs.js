export const validateInputs = (
  schema,
  data,
) => {
  const parsed = schema.safeParse(data);

  if (!parsed.success) {
    const error = new Error("Invalid input data");
    error.statusCode = 400;
    throw error;
  }

  return parsed.data;
};
