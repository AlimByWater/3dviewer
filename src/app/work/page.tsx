"use client";

import { useEffect, useState, useMemo } from "react";
import { useLaunchParams, postEvent } from "@telegram-apps/sdk-react";
import Overlay from "./_components/Overlay";
import View from "./_components/View";
import { get3DObject } from "@/types/work";
import { Page } from "@/components/Page";

const WorkPage = () => {
  const lp = useLaunchParams();
  const [workId, setWorkId] = useState(lp.startParam);
  const obj = useMemo(() => get3DObject(workId), [workId]);
  const [isAuthorsPageOpen] = useState(false);

  useEffect(() => {
    if (["android", "android_x", "ios"].includes(lp.platform)) {
      try {
        postEvent("web_app_request_fullscreen");
        postEvent("web_app_setup_swipe_behavior", {
          allow_vertical_swipe: false,
        });
      } catch (e) {
        console.warn(e);
      }
    }
  }, [lp.platform]);

  const onSelectWork = (workId: string) => {
    setWorkId(workId);
  };

  return (
    <Page back={false}>
      <View obj={obj} isAuthorsPageOpen={isAuthorsPageOpen} />
      <Overlay onSelectWork={onSelectWork} />
    </Page>
  );
};

export default WorkPage;
