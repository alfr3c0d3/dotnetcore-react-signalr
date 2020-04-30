export interface IProfile {
  displayName: string;
  userName: string;
  bio: string;
  image: string;
  following: boolean;
  followingCount: number;
  followersCount: number;
  photos: IPhoto[];
}

export interface IPhoto {
  id: string;
  url: string;
  isMain: boolean;
}
