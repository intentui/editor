"use client";

import { configure } from "onedollarstats";
import { useEffect } from "react";

export function Analytics() {
  useEffect(() => {
    configure({ hostname: "editor.intentui.com", devmode: false });
  }, []);

  return null;
}
