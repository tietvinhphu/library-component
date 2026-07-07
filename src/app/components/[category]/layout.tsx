// Layout để render Parallel Route @modal slot
interface ComponentsLayoutProps {
  children: React.ReactNode;
  modal: React.ReactNode;
}

export default function ComponentsLayout({
  children,
  modal,
}: Readonly<ComponentsLayoutProps>) {
  return (
    <>
      {children}
      {modal}
    </>
  );
}
