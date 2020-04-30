import { IPhoto } from "./../models/profile";
import { toast } from "react-toastify";
import { IProfile } from "../models/profile";
import { observable, action, runInAction, computed, reaction } from "mobx";
import agent from "../api/agent";
import { RootStore } from "./rootStore";

// configure({ enforceActions: "always" });

export default class ProfileStore {
  rootStore: RootStore;

  constructor(rootStore: RootStore) {
    this.rootStore = rootStore;

    reaction(
      () => this.activeTab,
      (activeTab) => {
        if (activeTab === 3 || activeTab === 4) {
          this.loadFollowings(activeTab === 3 ? "followers" : "following");
        } else {
          this.followings = [];
        }
      }
    );
  }
  //#region Observables
  @observable profile: IProfile | null = null;
  @observable loadingProfile = true;
  @observable uploadingPhoto = false;
  @observable loading = false;
  @observable followings: IProfile[] = [];
  @observable activeTab: number = 0;

  //#endregion

  //#region Computed
  @computed get isCurrentUser() {
    if (this.rootStore.userStore.user && this.profile)
      return this.rootStore.userStore.user.userName === this.profile.userName;
    else return false;
  }
  //#endregion

  //#region Actions
  @action loadProfile = async (userName: string) => {
    this.loadingProfile = true;
    try {
      const profile = await agent.Profile.get(userName);
      runInAction(() => {
        this.profile = profile;
        this.loadingProfile = false;
      });
    } catch (error) {
      runInAction(() => {
        this.loadingProfile = false;
      });
      console.log(error);
    }
  };

  @action uploadPhoto = async (file: Blob) => {
    this.uploadingPhoto = true;
    try {
      const photo = await agent.Profile.uploadPhoto(file);
      runInAction(() => {
        if (this.profile) {
          this.profile.photos.push(photo);
          if (photo.isMain && this.rootStore.userStore.user) {
            this.rootStore.userStore.user.image = photo.url;
            this.profile.image = photo.url;
          }
        }
        this.uploadingPhoto = false;
      });
    } catch (error) {
      console.log(error);
      toast.error("Problem uploading photo");
      runInAction(() => {
        this.uploadingPhoto = false;
      });
    }
  };

  @action setMainPhoto = async (photo: IPhoto) => {
    this.loading = true;
    try {
      await agent.Profile.setMainPhoto(photo.id);
      runInAction(() => {
        this.rootStore.userStore.user!.image = photo.url;
        this.profile!.photos.find((p) => p.isMain)!.isMain = false;
        this.profile!.photos.find((p) => p.id === photo.id)!.isMain = true;
        this.profile!.image = photo.url;
        this.loading = false;
      });
    } catch (error) {
      console.log(error);
      toast.error("Problem setting photo as main");
      runInAction(() => {
        this.loading = false;
      });
    }
  };

  @action deletePhoto = async (photo: IPhoto) => {
    this.loading = true;
    try {
      await agent.Profile.deletePhoto(photo.id);
      runInAction(() => {
        this.profile!.photos = this.profile!.photos.filter((p) => p.id !== photo.id);
        this.loading = false;
      });
    } catch (error) {
      console.log(error);
      toast.error("Problem deleting the photo");
      runInAction(() => {
        this.loading = false;
      });
    }
  };

  @action updateProfile = async (profile: Partial<IProfile>) => {
    this.loading = true;
    try {
      await agent.Profile.updateProfile(profile);
      runInAction(() => {
        if (profile.displayName !== this.rootStore.userStore.user!.displayName)
          this.rootStore.userStore.user!.displayName = profile.displayName!;

        this.profile = { ...this.profile!, ...profile };

        this.loading = false;
      });
    } catch (error) {
      runInAction(() => {
        this.loading = false;
      });
      console.log(error);
      toast.error("Problem updating profile");
    }
  };

  @action follow = async (userName: string) => {
    this.loading = true;
    try {
      await agent.Profile.follow(userName);
      runInAction(() => {
        this.profile!.following = true;
        this.profile!.followersCount++;
        this.loading = false;
      });
    } catch (error) {
      runInAction(() => {
        this.loading = false;
      });
      console.log(error);
      toast.error("Problem following user");
    }
  };

  @action unfollow = async (userName: string) => {
    this.loading = true;
    try {
      await agent.Profile.unfollow(userName);
      runInAction(() => {
        this.profile!.following = false;
        this.profile!.followersCount--;
        this.loading = false;
      });
    } catch (error) {
      runInAction(() => {
        this.loading = false;
      });
      console.log(error);
      toast.error("Problem unfollowing user");
    }
  };

  @action loadFollowings = async (predicate: string) => {
    this.loading = true;
    try {
      const profiles = await agent.Profile.listFollowings(this.profile!.userName, predicate);
      runInAction(() => {
        this.followings = profiles;
        this.loading = false;
      });
    } catch (error) {
      runInAction(() => {
        this.loading = false;
      });
      console.log(error);
      toast.error("Problem loading followings");
    }
  };

  @action setActiveTab = (activeIndex: number) => {
    this.activeTab = activeIndex;
  };
  //#endregion
}
