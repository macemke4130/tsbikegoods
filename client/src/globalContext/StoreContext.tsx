import { createContext, useReducer } from "react";
import { storeReducer, globalReducerInitialState, GlobalState, AuthObject } from "./globalReducer";

export const StoreContext = createContext(globalReducerInitialState);

type StoreProviderProps = { children: string | JSX.Element | JSX.Element[] }

export const StoreProvider = ({ children }: StoreProviderProps) => {
  const [state, dispatch] = useReducer(storeReducer, globalReducerInitialState);

  const alertUser = (type: typeof globalReducerInitialState.alertData.alertType, message: typeof globalReducerInitialState.alertData.message) => {
    dispatch({
      payloadType: "alert",
      alertData: {
        alertType: type,
        message: message
      }
    });
  };

  const setGlobalAuth = (authInfo: AuthObject) => {
    dispatch({
      payloadType: "auth",
      authData: {
        jwt: authInfo.jwt,
        emailAddress: authInfo.emailAddress,
        displayName: authInfo.displayName,
        id: authInfo.id
      }
    });
  };

  const value: GlobalState = {
    authData: state.authData,
    alertData: state.alertData,
    alertUser,
    setGlobalAuth
  };

  return (
    <StoreContext.Provider value={value}>
      {children}
    </StoreContext.Provider>
  );
};
