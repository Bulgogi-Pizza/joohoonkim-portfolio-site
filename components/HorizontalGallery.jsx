import React, {useCallback, useEffect, useRef, useState} from 'react';

const HorizontalGallery = ({
  items,
  ariaLabel = "Gallery",
  autoScrollSpeed = 1,
  gapPx = 16,
  paddingX = 24,
  cols = 1,
  itemClassName = "",
  renderItem
}) => {
  const containerRef = useRef(null);
  const [scrollPosition, setScrollPosition] = useState(0);
  const [currentSpeed, setCurrentSpeed] = useState(autoScrollSpeed);
  const [isHovering, setIsHovering] = useState(false);
  const animationRef = useRef();

  // 무한 스크롤을 위해 아이템을 3배로 복제
  const extendedItems = [...items, ...items, ...items];

  // 자동 스크롤 애니메이션
  const animate = useCallback(() => {
    if (!containerRef.current) {
      return;
    }

    const container = containerRef.current;
    const maxScrollWidth = container.scrollWidth - container.clientWidth;

    setScrollPosition(prev => {
      let newPosition = prev + currentSpeed;

      // 무한 루프를 위한 위치 조정
      if (newPosition >= maxScrollWidth * 2 / 3) {
        newPosition = maxScrollWidth / 3;
      } else if (newPosition <= 0) {
        newPosition = maxScrollWidth / 3;
      }

      container.scrollLeft = newPosition;
      return newPosition;
    });

    animationRef.current = requestAnimationFrame(animate);
  }, [currentSpeed]);

  // 애니메이션 시작
  useEffect(() => {
    animationRef.current = requestAnimationFrame(animate);
    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, [animate]);

  // 마우스 위치에 따른 스크롤 속도 조절
  const handleMouseMove = (e) => {
    if (!containerRef.current) {
      return;
    }

    const rect = containerRef.current.getBoundingClientRect();
    const mouseX = e.clientX - rect.left;
    const containerWidth = rect.width;
    const centerX = containerWidth / 2;
    const relativePosition = (mouseX - centerX) / centerX; // -1 to 1

    // 중앙에서 20% 범위는 정지
    if (Math.abs(relativePosition) < 0.2) {
      setCurrentSpeed(0);
    } else {
      // 위치에 따른 속도 계산 (최대 3배속)
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

  // CSS 변수 설정
  const cssVariables = {
    '--gallery-gap': `${gapPx}px`,
    '--gallery-pad2x': `${paddingX * 2}px`,
  };

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
          {/* 그리드 컨테이너들을 가로로 배열 */}
          {Array.from({length: Math.ceil(extendedItems.length / cols)}).map(
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
