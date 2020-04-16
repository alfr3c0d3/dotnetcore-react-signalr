import { createContext } from "react";
import ActivityStore from "./activityStore";
import UserStore from "./userStore";
import CommonStore from "./commonStore";
import { configure } from "mobx";
import ModalStore from "./modalStore";

configure({ enforceActions: "always" });

export class RootStore {
  commonStore: CommonStore;
  activityStore: ActivityStore;
  userStore: UserStore;
  modalStore: ModalStore;

  constructor() {
    this.commonStore = new CommonStore(this);
    this.activityStore = new ActivityStore(this);
    this.userStore = new UserStore(this);
    this.modalStore = new ModalStore(this);
  }
}

export const RootStoreContext = createContext(new RootStore());
