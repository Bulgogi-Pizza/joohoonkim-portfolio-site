import {useEffect} from 'react';
import {useLocation} from 'react-router-dom';

/**
 * React Router DOM 사용 시, 페이지(경로)가 변경될 때마다
 * 항상 창의 맨 위로 스크롤을 이동시키는 헬퍼 컴포넌트입니다.
 * 이 컴포넌트는 UI를 렌더링하지 않습니다.
 */
function ScrollToTop() {
  // 현재 경로 정보를 가져옵니다.
  const {pathname} = useLocation();

  // pathname이 변경될 때마다 이펙트가 실행됩니다.
  useEffect(() => {
    try {
      // window.scrollTo가 지원되는 환경에서만 실행
      window.scrollTo({
        top: 0,
        left: 0,
        behavior: 'instant' // 즉시 이동
      });
    } catch (e) {
      // 오래된 브라우저 등에서 에러가 발생할 경우를 대비
      window.scrollTo(0, 0);
    }
  }, [pathname]); // 의존성 배열에 pathname을 추가하여, 경로가 바뀔 때만 이 함수가 실행되도록 합니다.

  return null; // 이 컴포넌트는 화면에 아무것도 그리지 않습니다.
}

export default ScrollToTop;