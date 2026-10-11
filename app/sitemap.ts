import type { MetadataRoute } from 'next';

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'https://www.photonicsskku.com';

// 방문자용 정적 라우트. (/research 는 첫 연구분야로 리다이렉트되므로 대표 경로만 포함)
export default function sitemap(): MetadataRoute.Sitemap {
    const routes = ['', '/members/pi', '/members/current', '/members/alumni', '/research', '/publications', '/conferences', '/awards/pi', '/awards/students', '/opening', '/media'];
    return routes.map((path) => ({
        url: `${SITE_URL}${path}`,
        changeFrequency: 'monthly',
        priority: path === '' ? 1 : 0.7,
    }));
}
