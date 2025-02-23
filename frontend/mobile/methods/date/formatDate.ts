const formatDate = (date: Date) =>
  new Intl.DateTimeFormat("en-US", {
   year: "numeric",
   month: "2-digit",
   day: "2-digit",

 }).format(date);

 export default formatDate;