'use client';

import React, { useCallback, useEffect, useRef, useState } from 'react';

interface HorizontalGalleryProps {
    items: any[];
    ariaLabel?: string;
    autoScrollSpeed?: number;
    gapPx?: number;
    paddingX?: number;
    cols?: number;
    itemClassName?: string;
    renderItem: (item: any) => React.ReactNode;
    loop?: boolean;
    loopStrategy?: string;
    autoScroll?: boolean;
    pauseOnHover?: boolean;
}

const HorizontalGallery: React.FC<HorizontalGalleryProps> = ({
    items,
    ariaLabel = "Gallery",
    autoScrollSpeed = 1,
    gapPx = 16,
    paddingX = 24,
    cols = 1,
    itemClassName = "",
    renderItem
}) => {
    const containerRef = useRef<HTMLDivElement>(null);
    const [currentSpeed, setCurrentSpeed] = useState(autoScrollSpeed);
    const [isHovering, setIsHovering] = useState(false);
    const animationRef = useRef<number>();

    // Duplicate items for infinite scroll effect
    const extendedItems = [...items, ...items, ...items];

    const animate = useCallback(() => {
        if (!containerRef.current) {
            return;
        }

        const container = containerRef.current;
        const maxScrollWidth = container.scrollWidth - container.clientWidth;

        // We use scrollLeft directly for smoother animation than state
        let newPosition = container.scrollLeft + currentSpeed;

        // Infinite loop adjustment
        if (newPosition >= maxScrollWidth * 2 / 3) {
            newPosition = maxScrollWidth / 3;
        } else if (newPosition <= 0) {
            newPosition = maxScrollWidth / 3;
        }

        container.scrollLeft = newPosition;
        animationRef.current = requestAnimationFrame(animate);
    }, [currentSpeed]);

    useEffect(() => {
        animationRef.current = requestAnimationFrame(animate);
        return () => {
            if (animationRef.current) {
                cancelAnimationFrame(animationRef.current);
            }
        };
    }, [animate]);

    const handleMouseMove = (e: React.MouseEvent) => {
        if (!containerRef.current) {
            return;
        }

        const rect = containerRef.current.getBoundingClientRect();
        const mouseX = e.clientX - rect.left;
        const containerWidth = rect.width;
        const centerX = containerWidth / 2;
        const relativePosition = (mouseX - centerX) / centerX; // -1 to 1

        if (Math.abs(relativePosition) < 0.2) {
            setCurrentSpeed(0);
        } else {
            const speedMultiplier = Math.abs(relativePosition) * 3;
            const direction = relativePosition > 0 ? 1 : -1;
            setCurrentSpeed(autoScrollSpeed * speedMultiplier * direction);
        }
    };

    const handleMouseEnter = () => {
        setIsHovering(true);
    };

    const handleMouseLeave = () => {
        setIsHovering(false);
        setCurrentSpeed(autoScrollSpeed);
    };

    const cssVariables = {
        '--gallery-gap': `${gapPx}px`,
        '--gallery-pad2x': `${paddingX * 2}px`,
    } as React.CSSProperties;

    return (
        <div
            className="relative w-full overflow-hidden"
            style={cssVariables}
        >
            <div
                ref={containerRef}
                className="flex overflow-hidden"
                style={{
                    paddingLeft: paddingX,
                    paddingRight: paddingX,
                    gap: gapPx
                }}
                onMouseMove={isHovering ? handleMouseMove : undefined}
                onMouseEnter={handleMouseEnter}
                onMouseLeave={handleMouseLeave}
                aria-label={ariaLabel}
            >
                {Array.from({ length: Math.ceil(extendedItems.length / cols) }).map(
                    (_, gridIndex) => (
                        <div
                            key={gridIndex}
                            className="flex-shrink-0 grid gap-4 px-2 lg:px-4"
                            style={{
                                gridTemplateRows: `repeat(${cols}, 1fr)`,
                                gridAutoFlow: 'row',
                                maxWidth: '420px'
                            }}
                        >
                            {extendedItems
                                .slice(gridIndex * cols, (gridIndex + 1) * cols)
                                .map((item, itemIndex) => (
                                    <div
                                        key={`${gridIndex}-${itemIndex}`}
                                        className={`${itemClassName} h-fit`}
                                    >
                                        {renderItem(item)}
                                    </div>
                                ))}
                        </div>
                    ))}
            </div>
        </div>
    );
};

export default HorizontalGallery;
