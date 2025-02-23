const formatTime = (date: Date) =>
  new Intl.DateTimeFormat("en-US", {
   hour: "2-digit",
   minute: "2-digit",
   hourCycle: "h23", 
 }).format(date);

 export default formatTime;