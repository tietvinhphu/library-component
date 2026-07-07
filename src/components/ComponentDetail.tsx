import ComponentDetailClient from "./ComponentDetailClient";

interface ComponentDetailProps {
  name: string;
}

export default function ComponentDetail({ name }: ComponentDetailProps) {
  return <ComponentDetailClient name={name} />;
}
