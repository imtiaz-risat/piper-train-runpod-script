"use client";

import { useEffect, useState } from "react";

interface TocItem {
  id: string;
  text: string;
  level: number;
}

interface TableOfContentsProps {
  headings: TocItem[];
}

export function TableOfContents({ headings }: TableOfContentsProps) {
  const [activeId, setActiveId] = useState<string>("");

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setActiveId(entry.target.id);
          }
        });
      },
      { rootMargin: "-80px 0px -80% 0px" }
    );

    headings.forEach((heading) => {
      const element = document.getElementById(heading.id);
      if (element) observer.observe(element);
    });

    return () => observer.disconnect();
  }, [headings]);

  if (headings.length === 0) return null;

  return (
    <aside className="w-56 flex-shrink-0 hidden xl:block">
      <div className="sticky top-16 h-[calc(100vh-4rem)] overflow-y-auto py-6 pl-4">
        <h4 className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-3">
          On this page
        </h4>
        <nav>
          <ul className="space-y-2 border-l border-slate-200">
            {headings.map((heading) => (
              <li key={heading.id}>
                <a
                  href={`#${heading.id}`}
                  className={`block text-sm py-1 pl-4 -ml-px border-l-2 transition-colors ${
                    activeId === heading.id
                      ? "border-purple-600 text-purple-700 font-medium"
                      : "border-transparent text-slate-500 hover:text-slate-700 hover:border-slate-300"
                  } ${heading.level === 3 ? "pl-6 text-xs" : ""}`}
                >
                  {heading.text}
                </a>
              </li>
            ))}
          </ul>
        </nav>
      </div>
    </aside>
  );
}
