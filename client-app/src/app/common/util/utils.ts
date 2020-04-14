export const combineDateAndTime = (date: Date, time: Date) => {
  const timeString = `${time.getHours()}:${time.getMinutes()}:00`;
  const dateString = `${date.getFullYear()}-${date.getMonth() + 1}-${date.getDate()}`;
  return new Date(`${dateString} ${timeString}`);
};
