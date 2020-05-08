import { IUser } from "./../../models/user";
import { IActivity, IAttendee } from "./../../models/activity";
export const combineDateAndTime = (date: Date, time: Date) => {
  const dateString = date.toISOString().split("T")[0];
  const timeString = time.toISOString().split("T")[1];
  return new Date(`${dateString}T${timeString}`);
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
