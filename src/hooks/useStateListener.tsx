import React, { useEffect, useState } from "react";
import { isObject } from "util";

const electron = window.require("electron");

export default function useStateListener() {
  const [targetInfo, setTargetInfo] = useState<string[]>([]);
  useEffect(() => {
    electron.ipcRenderer.once(
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
