import { Stack } from "@mantine/core";
import {
  FeatureGrid,
  FinalCTA,
  GetStarted,
  Hero,
  TechStack,
} from "~/ui/components/home";
import type { Route } from "./+types/home";

export function meta(_: Route.MetaArgs) {
  return [
    { title: "React Router Template — Full-Stack Starter" },
    {
      name: "description",
      content:
        "A batteries-included React Router v8 + Mantine starter with auth, database, SSR, and tests.",
    },
  ];
}

export default function Home() {
  return (
    <Stack gap="xl" py="xl">
      <Hero />
      <FeatureGrid />
      <TechStack />
      <GetStarted />
      <FinalCTA />
    </Stack>
  );
}
