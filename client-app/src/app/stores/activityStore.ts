import { IActivity } from "./../models/activities";
import { observable, action, computed, runInAction, decorate } from "mobx";
import { createContext } from "react";
import agent from "../api/agent";

// configure({ enforceActions: "always" });

class ActivityStore {
  //#region Observables
  activityRegistry = new Map();
  activity: IActivity | null = null;
  loadingInitial = false;

  //#endregion

  //#region Computed

  get activitiesByDate() {
    return this.groupActivitiesByDate(Array.from(this.activityRegistry.values()));
  }

  groupActivitiesByDate(activities: IActivity[]) {
    const sortedActivities = activities.sort((a, b) => Date.parse(a.date) - Date.parse(b.date));
    return Object.entries(
      sortedActivities.reduce((activities, activity) => {
        const date = activity.date.split("T")[0];
        activities[date] = activities[date] ? [...activities[date], activity] : [activity];
        return activities;
      }, {} as { [key: string]: IActivity[] })
    );
  }

  //#endregion

  //#region Actions

  //   loadActivities = () => {
  //     this.loadingInitial = true;
  //     agent.Activities.list()
  //       .then(response => {
  //         runInAction(() => {
  //           response.forEach(activity => {
  //             activity.date = activity.date.split(".")[0];
  //             this.activityRegistry.set(activity.id, activity);
  //           });
  //         });
  //       })
  //       .catch(error => {
  //         console.log(error);
  //       })
  //       .finally(() =>
  //         runInAction(() => {
  //           this.loadingInitial = false;
  //         })
  //       );
  //   };

  /**
   * Using async instead of Promise actions (i.e. then, catch, finally, etc.)
   */

  loadActivities = async () => {
    this.loadingInitial = true;
    try {
      const activities = await agent.Activities.list();
      runInAction("loading activities", () => {
        activities.forEach(activity => {
          activity.date = activity.date.split(".")[0];
          this.activityRegistry.set(activity.id, activity);
        });
        this.loadingInitial = false;
      });
    } catch (error) {
      runInAction("load activity error", () => {
        this.loadingInitial = false;
      });
      console.log(error);
    }
  };

  loadActivity = async (id: string) => {
    let activity = this.getActivity(id);

    if (activity) {
      this.activity = activity;
    } else {
      this.loadingInitial = true;
      try {
        activity = await agent.Activities.details(id);
        runInAction("getting activity", () => {
          this.activity = activity;
          this.loadingInitial = false;
        });
      } catch (error) {
        runInAction("get activity error", () => {
          this.loadingInitial = false;
        });
        console.log(error);
      }
    }
  };

  clearActivity = () => {
    this.activity = null;
  };

  getActivity = (id: string) => {
    return this.activityRegistry.get(id);
  };

  createActivity = async (activity: IActivity) => {
    try {
      await agent.Activities.create(activity);
      runInAction("creating activity", () => {
        this.activityRegistry.set(activity.id, activity);
      });
    } catch (error) {
      console.log(error);
    }
  };

  editActivity = async (activity: IActivity) => {
    try {
      await agent.Activities.update(activity);
      runInAction("editing activity", () => {
        this.activityRegistry.set(activity.id, activity);
        this.activity = activity;
      });
    } catch (error) {
      console.log(error);
    }
  };

  deleteActivity = async (id: string) => {
    try {
      await agent.Activities.delete(id);
      runInAction("deleting activity", () => {
        this.activityRegistry.delete(id);
      });
    } catch (error) {
      console.log(error);
    }
  };

  //#endregion
}

decorate(ActivityStore, {
  activityRegistry: observable,
  activity: observable,
  loadingInitial: observable,

  activitiesByDate: computed,

  loadActivities: action,
  loadActivity: action,
  clearActivity: action,
  createActivity: action,
  editActivity: action,
  deleteActivity: action
});

export default createContext(new ActivityStore());
