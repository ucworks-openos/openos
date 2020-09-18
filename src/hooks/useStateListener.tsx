import React, { useEffect, useState } from "react";

const electron = window.require("electron");

export default function useStateListener() {
  const [targetInfo, setTargetInfo] = useState<string[]>([]);
  useEffect(() => {
    electron.ipcRenderer.on(
      "userStatusChanged",
      (event: any, diff: string[]) => {
        setTargetInfo(diff);
      }
    );

    // return () => {
    //   electron.ipcRenderer.removeListener("userStatusChanged");
    // };
  }, []);
  return targetInfo;
}
