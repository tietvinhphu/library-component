import ComponentDetail from "@/components/ComponentDetail";

interface SlugPageProps {
  params: Promise<{ category: string; slug: string }>;
}

export default async function SlugPage({ params }: Readonly<SlugPageProps>) {
  const { slug } = await params;
  return <ComponentDetail name={slug} />;
}
