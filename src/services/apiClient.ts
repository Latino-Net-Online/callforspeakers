import axios from "axios";
import { UserManager } from "oidc-react";
import { config } from "../config/EnvConfig";
import {
  ImagesApi,
  ProposalsApi,
  SpeakersApi,
} from "../generated-sources/openapi";

const instance = axios.create();

const apiUrl = config.apiUrl;

instance.interceptors.request.use(
  function (config) {
    var token = sessionStorage.getItem("access_token");
    if (token) {
      Object.assign(config.headers, {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      });
    }

    return config;
  },
  function (error) {
    // Any status codes that falls outside the range of 2xx cause this function to trigger
    // Do something with response error
    return Promise.reject(error);
  }
);

instance.interceptors.response.use(
  function (response) {
    // Any status code that lie within the range of 2xx cause this function to trigger
    // Do something with response data
    return response;
  },
  function (error) {
    // Any status codes that falls outside the range of 2xx cause this function to trigger
    // Do something with response error

    return Promise.reject(error.response);
  }
);

export * from "../generated-sources/openapi";
export const proposalsApi = new ProposalsApi(undefined, apiUrl, instance);
export const speakersApi = new SpeakersApi(undefined, apiUrl, instance);
export const imagesApi = new ImagesApi(undefined, apiUrl, instance);
