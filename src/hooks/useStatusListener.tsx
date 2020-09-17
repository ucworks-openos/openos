import React, { useEffect } from "react";

const electron = window.require("electron");

export default function useStatusListener() {
  useEffect(() => {
    electron.ipcRenderer.on(
      "userStatusChanged",
      (event: any, userId: string, status: string, connType: string) => {
        console.log(`event: `, event);
        console.log(`userId: `, userId);
        console.log(`status: `, status);
        console.log(`connType: `, connType);
      }
    );

    // return () => {
    //   electron.ipcRenderer.removeListener("userStatusChanged");
    // };
  }, []);
  return null;
}
