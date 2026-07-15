import React from 'react';

// Home 전체 배경: 스크롤 구간마다 배치된 오로라 글로우.
// 시각 스타일은 globals.css의 .home-aurora-* 에 정의되어 있다.
function HomeBackdrop() {
    return (
        <div aria-hidden className="absolute inset-0 pointer-events-none overflow-hidden">
            <div className="home-aurora-a absolute top-[-260px] right-[-10%] w-[58vw] h-[58vw] max-w-[760px] max-h-[760px] rounded-full" />
            <div className="home-aurora-b absolute top-[38%] left-[-14%] w-[48vw] h-[48vw] max-w-[620px] max-h-[620px] rounded-full" />
            <div className="home-aurora-c absolute bottom-[-6%] right-[-8%] w-[44vw] h-[44vw] max-w-[560px] max-h-[560px] rounded-full" />
        </div>
    );
}

export default HomeBackdrop;
