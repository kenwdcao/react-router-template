import { Welcome } from "~/ui/components/welcome";
import type { Route } from "./+types/home";

export function meta(_: Route.MetaArgs) {
  return [
    { title: "React Router Template" },
    {
      name: "description",
      content:
        "A full-stack React Router v7 template with TypeScript and Mantine",
    },
  ];
}

export default function Home() {
  return <Welcome />;
}
