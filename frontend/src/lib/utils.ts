import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";
import moment from "moment";
import Env from "./env";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export const isValidUrl = (url: string): boolean => {
  try {
    new URL(url);
    return true;
  } catch (error) {
    return false;
  }
};

export const trimString = (data: string) => {
  if (data.length <= 50) {
    return data;
  }
  return data.slice(0, 50) + "...";
};

export const formatDate = (date: string) => {
  return moment(date).format("DD MMM YYYY");
};

export const getImageUrl = (path: string): string => {
  return `${Env.API_URL}/storage/${path}`;
};
