import ComponentDetailClient from "./ComponentDetailClient";

interface ComponentDetailProps {
  name: string;
}

export default function ComponentDetail({ name }: Readonly<ComponentDetailProps>) {
  return <ComponentDetailClient name={name} />;
}
