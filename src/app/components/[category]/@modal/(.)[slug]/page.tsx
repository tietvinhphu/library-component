import ComponentDetail from "@/components/ComponentDetail";

interface ModalPageProps {
  params: Promise<{ category: string; slug: string }>;
}

export default async function ModalSlugPage({ params }: Readonly<ModalPageProps>) {
  const { slug } = await params;
  return <ComponentDetail name={slug} />;
}
