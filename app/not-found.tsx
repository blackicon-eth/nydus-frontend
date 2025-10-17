"use client";

import type * as React from "react";

export default function NotFound(): React.JSX.Element {
  return (
    <div className="flex min-h-screen flex-col">
      <div className="flex flex-col items-center justify-center py-32 text-center">
        <span className="font-semibold text-[10rem] leading-none">404</span>
        <h2 className="my-2 font-bold font-heading text-2xl">
          Something&apos;s missing
        </h2>
        <p>
          Sorry, the page you are looking for doesn&apos;t exist or has been
          moved.
        </p>
      </div>
    </div>
  );
}
