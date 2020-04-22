import { IUser } from "./../../models/user";
import { IActivity, IAttendee } from "./../../models/activity";
export const combineDateAndTime = (date: Date, time: Date) => {
  const timeString = `${time.getHours()}:${time.getMinutes()}:00`;
  const dateString = `${date.getFullYear()}-${date.getMonth() + 1}-${date.getDate()}`;
  return new Date(`${dateString} ${timeString}`);
};

export const setActivityProps = (activity: IActivity, user: IUser) => {
  activity.date = new Date(activity.date);
  activity.isGoing = activity.attendees.some((a) => a.userName === user.userName);
  activity.isHost = activity.attendees.some((a) => a.userName === user.userName && a.isHost);
};

export const createAttendee = (user: IUser): IAttendee => {
  return {
    isHost: false,
    displayName: user.displayName,
    userName: user.userName,
    image: user.image!,
  };
};
