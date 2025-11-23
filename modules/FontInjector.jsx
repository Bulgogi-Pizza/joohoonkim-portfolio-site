import React from "react";

const FontInjector = () => (
    <style>{`
      @import url('https://fonts.googleapis.com/css2?family=Noto+Sans+KR:wght@400;500;700&display=swap');
      body, .font-noto {
        font-family: 'Noto Sans KR', sans-serif;
      }
    `}</style>
);

export default FontInjector;