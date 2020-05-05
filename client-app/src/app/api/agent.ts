import { IActivitiesEnvelope } from "./../models/activity";
import { IProfile, IPhoto } from "./../models/profile";
import { IUser, IUserFormValues } from "./../models/user";
import { history } from "./../..";
import { IActivity } from "../models/activity";
import axios, { AxiosResponse, AxiosRequestConfig } from "axios";
import { toast } from "react-toastify";

axios.defaults.baseURL = "http://localhost:5000/api";

axios.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("jwt");
    if (token) config.headers.Authorization = `Bearer ${token}`;
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

axios.interceptors.response.use(undefined, (error) => {
  if (error.message === "Network Error" && !error.response) {
    toast.error("Network error - Make sure API is running!");
  }

  const { status, data, config } = error.response;

  if (status === 404 || (status === 400 && config.method === "get" && data.errors.hasOwnProperty("id"))) {
    history.push("/notFound");
  }
  if (status === 500) {
    toast.error("Server error - check the terminal for more info!");
  }

  throw error.response;
});

const responseBody = (response: AxiosResponse) => response.data;

const sleep = (ms: number) => (response: AxiosResponse) =>
  new Promise<AxiosResponse>((resolve) => setTimeout(() => resolve(response), ms));

const requests = {
  get: (url: string, config?: AxiosRequestConfig | undefined) =>
    axios.get(url, config).then(sleep(1000)).then(responseBody),
  post: (url: string, body: {}) => axios.post(url, body).then(sleep(1000)).then(responseBody),
  put: (url: string, body: {}) => axios.put(url, body).then(sleep(1000)).then(responseBody),
  delete: (url: string) => axios.delete(url).then(sleep(1000)).then(responseBody),
  postForm: (url: string, file: Blob) => {
    let formData = new FormData();
    formData.append("File", file);

    return axios
      .post(url, formData, {
        headers: { "Content-type": "multipart/data" },
      })
      .then(responseBody);
  },
};

const Activities = {
  list: (params: URLSearchParams): Promise<IActivitiesEnvelope> => requests.get("/activities", { params: params }),
  details: (id: string): Promise<IActivity> => requests.get(`/activities/${id}`),
  create: (activity: IActivity) => requests.post("/activities", activity),
  update: (activity: IActivity) => requests.put(`/activities/${activity.id}`, activity),
  delete: (id: string) => requests.delete(`/activities/${id}`),
  attend: (id: string) => requests.post(`/activities/${id}/attend`, {}),
  unattend: (id: string) => requests.delete(`/activities/${id}/attend`),
};

const User = {
  currentUser: (): Promise<IUser> => requests.get("/user"),
  login: (user: IUserFormValues): Promise<IUser> => requests.post("/user/login", user),
  register: (user: IUserFormValues): Promise<IUser> => requests.post("/user/register", user),
};

const Profile = {
  get: (userName: string): Promise<IProfile> => requests.get(`/profiles/${userName}`),
  uploadPhoto: (photo: Blob): Promise<IPhoto> => requests.postForm(`/photos`, photo),
  setMainPhoto: (id: string) => requests.post(`/photos/${id}/setMain`, {}),
  deletePhoto: (id: string): Promise<IPhoto> => requests.delete(`/photos/${id}`),
  updateProfile: (profile: Partial<IProfile>) => requests.put(`/profiles`, profile),
  follow: (userName: string) => requests.post(`/profiles/${userName}/follow`, {}),
  unfollow: (userName: string) => requests.delete(`/profiles/${userName}/follow`),
  listFollowings: (userName: string, predicate: string) =>
    requests.get(`/profiles/${userName}/follow?predicate=${predicate}`),
  listActivities: (userName: string, predicate: string) =>
    requests.get(`/profiles/${userName}/activities?predicate=${predicate}`),
};

export default { Activities, User, Profile };
