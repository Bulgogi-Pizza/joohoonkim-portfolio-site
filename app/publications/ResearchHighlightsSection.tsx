'use client';

import React, { useEffect, useState } from "react";
import HorizontalGallery from "@/components/HorizontalGallery";
import { useRouter } from "next/navigation";
import { getImageUrl } from "@/lib/imageUtils";

const isExternal = (href = "") =>
    /^https?:\/\//i.test(href) || href.startsWith("mailto:") || href.startsWith("tel:");

function useCardLink() {
    const router = useRouter();
    const openLink = (link: string) => {
        if (!link) {
            return;
        }
        if (isExternal(link)) {
            window.open(link, "_blank", "noopener");
        } else {
            router.push(link.startsWith("/") ? link : `/${link}`);
        }
    };
    const keyActivate = (e: React.KeyboardEvent, link: string) => {
        if (e.key === "Enter" || e.key === " ") {
            e.preventDefault();
            openLink(link);
        }
    };
    return { openLink, keyActivate };
}

export default function ResearchHighlightsSection() {
    const [items, setItems] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const { openLink, keyActivate } = useCardLink();

    useEffect(() => {
        fetch("/api/research-highlights")
            .then(r => r.json())
            .then(d => {
                setItems(d || []);
                setLoading(false);
            })
            .catch(() => setLoading(false));
    }, []);

    if (loading || items.length === 0) {
        return null;
    }

    return (
        <section className="mb-12 sm:mb-16">
            <div className="text-center mb-6 sm:mb-8">
                <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white">
                    Research Highlights
                </h2>
            </div>

            <HorizontalGallery
                items={items}
                ariaLabel="Research Highlights"
                autoScrollSpeed={1}
                gapPx={0}
                paddingX={0}
                itemClassName="
          w-[calc((100vw-var(--gallery-pad2x)-2*var(--gallery-gap))/3)]
          md:w-[calc((100vw-var(--gallery-pad2x)-3*var(--gallery-gap))/4)]
          lg:w-[calc((100vw-var(--gallery-pad2x)-4*var(--gallery-gap))/5)]
          max-w-[420px]
        "
                renderItem={(item) => (
                    <div
                        role={item.link ? "link" : undefined}
                        tabIndex={item.link ? 0 : -1}
                        onClick={() => item.link && openLink(item.link)}
                        onKeyDown={(e) => item.link && keyActivate(e, item.link)}
                        className={`block bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg overflow-hidden shadow transition ${item.link ? "hover:shadow-md cursor-pointer"
                            : "cursor-default"
                            }`}
                    >
                        {/* 20:13 Ratio */}
                        <div style={{ aspectRatio: "20 / 13" }}>
                            <img
                                src={getImageUrl(item.image_path)}
                                alt={item.alt_text || item.description || "Research highlight"}
                                className="w-full h-full object-cover block"
                                loading="lazy"
                            />
                        </div>

                        {item.description && (
                            <div
                                className="p-3 text-xs sm:text-sm text-gray-700 dark:text-gray-300 min-h-[44px] sm:min-h-[56px]">
                                {item.description}
                            </div>
                        )}
                    </div>
                )}
            />
        </section>
    );
}
