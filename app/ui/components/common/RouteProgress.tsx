import {
  NavigationProgress,
  completeNavigationProgress,
  startNavigationProgress,
} from "@mantine/nprogress";
import { useEffect } from "react";
import { useNavigation } from "react-router";

export function RouteProgress() {
  const navigation = useNavigation();

  useEffect(() => {
    if (navigation.state === "idle") {
      completeNavigationProgress();
      return;
    }

    startNavigationProgress();
  }, [navigation.state]);

  return <NavigationProgress />;
}
