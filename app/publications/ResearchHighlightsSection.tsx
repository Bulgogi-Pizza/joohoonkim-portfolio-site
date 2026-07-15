'use client';

import React, { useEffect, useState } from "react";
import { FiArrowUpRight } from "react-icons/fi";
import HorizontalGallery from "@/components/HorizontalGallery";
import { useRouter } from "next/navigation";
import { getImageUrl } from "@/lib/imageUtils";
import SectionHeader from "@/components/ui/SectionHeader";

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
            <SectionHeader
                title="Research Highlights"
                count={`${String(items.length).padStart(2, '0')} items`}
            />

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
                        className={`group relative block bg-card dark:bg-dark-card border border-line dark:border-dark-line rounded overflow-hidden shadow-elev dark:shadow-none transition-all duration-200 ${item.link ? "hover:shadow-elev-hover hover:-translate-y-0.5 hover:border-ink/50 dark:hover:border-white/30 cursor-pointer"
                            : "cursor-default"
                            }`}
                    >
                        {/* 액자식 이미지 프레임 (저널 스크린샷이 흰 카드에 묻히지 않도록) */}
                        <div className="p-2.5 pb-0">
                            <div style={{ aspectRatio: "20 / 13" }} className="rounded-[3px] overflow-hidden bg-line/40 dark:bg-white/[.05] border border-line/70 dark:border-dark-line">
                                <img
                                    src={getImageUrl(item.image_path)}
                                    alt={item.alt_text || item.description || "Research highlight"}
                                    className="w-full h-full object-cover block transition-transform duration-500 group-hover:scale-[1.04]"
                                    loading="lazy"
                                />
                            </div>
                        </div>

                        {item.description && (
                            <div className="px-3.5 py-3 flex items-start justify-between gap-2 min-h-[44px] sm:min-h-[56px]">
                                <span className="font-mono text-[11px] sm:text-xs leading-relaxed text-ink-2 dark:text-dark-ink-2 group-hover:text-ink dark:group-hover:text-dark-ink transition-colors">
                                    {item.description}
                                </span>
                                {item.link && (
                                    <FiArrowUpRight aria-hidden size={14} className="shrink-0 mt-0.5 text-ink-3 dark:text-dark-ink-3 opacity-0 group-hover:opacity-100 transition-opacity" />
                                )}
                            </div>
                        )}
                    </div>
                )}
            />
        </section>
    );
}
