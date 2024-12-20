import { createContext, useRef, useState } from "react";

const PreferenceContext = createContext();

const ContextProvider = ({ children }) => {
  const [isCall, setIsCall] = useState(false);
  const [theme, setTheme] = useState("dark");
  const [remoteUser, setRemoteUser] = useState("Remote User");

  const appRef = useRef(null);

  const toggleFullScreen = () => {
    const element = appRef.current;

    if (!document.fullscreenElement) {
      // Enter full-screen mode
      if (element.requestFullscreen) {
        element.requestFullscreen();
      } else if (element.webkitRequestFullscreen) {
        /* Safari */
        element.webkitRequestFullscreen();
      } else if (element.msRequestFullscreen) {
        /* IE11 */
        element.msRequestFullscreen();
      }
    } else {
      // Exit full-screen mode
      if (document.exitFullscreen) {
        document.exitFullscreen();
      } else if (document.webkitExitFullscreen) {
        /* Safari */
        document.webkitExitFullscreen();
      } else if (document.msExitFullscreen) {
        /* IE11 */
        document.msExitFullscreen();
      }
    }
  };

  return (
    <PreferenceContext.Provider
      value={{
        isCall,
        setIsCall,
        theme,
        setTheme,
        remoteUser,
        setRemoteUser,
        appRef,
        toggleFullScreen,
      }}
    >
      {children}
    </PreferenceContext.Provider>
  );
};

export { PreferenceContext, ContextProvider };
