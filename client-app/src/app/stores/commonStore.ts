import { RootStore } from "./rootStore";
import { observable, action, reaction } from "mobx";

export default class CommonStore {
  rootStore: RootStore;
  constructor(rootStore: RootStore) {
    this.rootStore = rootStore;
    reaction(
      () => this.token,
      (token) => {
        if (token) {
          localStorage.setItem("jwt", token);
        } else {
          localStorage.removeItem("jwt");
        }
      }
    );
  }

  //#region Observables
  @observable token: string | null = localStorage.getItem("jwt");
  @observable appLoaded = false;
  //#endregion

  //#region Computed

  //#endregion

  //#region Actions
  @action setToken = (token: string) => {
    this.token = token;
  };

  @action setAppLoaded = () => {
    this.appLoaded = true;
  };
  //#endregion
}
