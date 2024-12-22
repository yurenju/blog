type DateFormatOptions = {
  withYear?: boolean;
};

export const formatDate = (
  date: string | Date,
  options: DateFormatOptions = { withYear: true }
): string => {
  const d = new Date(date);
  return d.toLocaleDateString("zh-TW", {
    year: options.withYear ? "numeric" : undefined,
    month: "long",
    day: "numeric",
  });
};
