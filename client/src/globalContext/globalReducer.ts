export interface GlobalState {
  authData: AuthObject;
  alertData: AlertObject;
  alertUser: (type: AlertObject["alertType"], message: AlertObject["message"]) => void;
  setGlobalAuth: (type: AuthObject) => void;
}

export interface GlobalPayload {
  payloadType: "alert" | "auth";
  alertData?: AlertObject;
  authData?: AuthObject;
}

export interface AuthObject {
  displayName: string;
  emailAddress: string;
  jwt: string;
  id: number;
}

export interface AlertObject {
  alertType: "info" | "danger" | "off";
  message: string;
}

export const globalReducerInitialState: GlobalState = {
  authData: {
    displayName: "",
    emailAddress: "",
    jwt: "",
    id: 0,
  },
  alertData: {
    alertType: "off",
    message: "",
  },
  alertUser: () => {},
  setGlobalAuth: () => {},
};

export const storeReducer = (state: GlobalState, payload: GlobalPayload): typeof globalReducerInitialState => {
  switch (payload.payloadType) {
    case "alert":
      return {
        ...state,
        alertData: {
          alertType: payload.alertData?.alertType!,
          message: payload.alertData?.message!,
        },
      };

    case "auth":
      return {
        ...state,
        authData: {
          displayName: payload.authData?.displayName!,
          emailAddress: payload.authData?.emailAddress!,
          jwt: payload.authData?.jwt!,
          id: payload.authData?.id!,
        },
      };

    default:
      return {
        ...state,
      };
  }
};
