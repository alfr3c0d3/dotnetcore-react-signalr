import { history } from "./../../index";
import { IUser, IUserFormValues } from "./../models/user";
import { observable, action, computed, runInAction } from "mobx";
import agent from "../api/agent";
import { RootStore } from "./rootStore";

// configure({ enforceActions: "always" });

export default class UserStore {
  rootStore: RootStore;

  constructor(rootStore: RootStore) {
    this.rootStore = rootStore;
  }
  //#region Observables
  @observable user: IUser | null = null;

  //#endregion

  //#region Computed
  @computed get isLoggedIn() {
    return !!this.user;
  }
  //#endregion

  //#region Actions

  @action login = async (values: IUserFormValues) => {
    try {
      const user = await agent.User.login(values);

      runInAction("logging In", () => {
        this.user = user;
      });
      this.rootStore.commonStore.setToken(user.token);
      this.rootStore.modalStore.closeModal();
      history.push("/activities");
    } catch (error) {
      throw error;
    }
  };

  @action register = async (values: IUserFormValues) => {
    try {
      const user = await agent.User.register(values);

      this.rootStore.commonStore.setToken(user.token);
      this.rootStore.modalStore.closeModal();
      history.push("/activities");
    } catch (error) {
      throw error;
    }
  };

  @action logout = () => {
    localStorage.removeItem("jwt");
    this.user = null;
    history.push("/");
  };

  @action getUser = async () => {
    try {
      const user = await agent.User.currentUser();
      runInAction(() => {
        this.user = user;
      });
    } catch (error) {
      console.log(error);
    }
  };

  //#endregion
}
