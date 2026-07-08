"use client";

import { Suspense } from "react";
import { componentDemos } from "@/lib/component-demos";

interface ComponentDemoProps {
  name: string;
}

function DemoFallback() {
  return (
    <div className="h-[300px] flex items-center justify-center text-muted-foreground">
      Loading demo...
    </div>
  );
}

export default function ComponentDemo({ name }: Readonly<ComponentDemoProps>) {
  const Demo = componentDemos[name];

  if (!Demo) {
    return (
      <div className="h-[300px] flex items-center justify-center text-muted-foreground feature-card">
        Chưa có live demo cho component này
      </div>
    );
  }

  return (
    <div className="feature-card overflow-hidden p-6">
      <Suspense fallback={<DemoFallback />}>
        <Demo />
      </Suspense>
    </div>
  );
}
