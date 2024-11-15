export const formatDate = (date) => {
  const dateTimeformat = new Intl.DateTimeFormat("en-GB", {
    hour12: false,
    timeStyle: "short",
    dateStyle: "medium",
  });
  return date ? dateTimeformat.format(date) : "";
};
