import { Dispatch, SetStateAction } from "react";

export type QueueContextType = {
  queueID: string | null;
  setQueueID: Dispatch<SetStateAction<string | null>>;
  token: string | null;
  setToken: Dispatch<SetStateAction<string | null>>;
  loading: boolean;
};
