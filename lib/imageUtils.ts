// Utility functions for handling image paths from the API

const API_BASE = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';

/**
 * Converts an image path from the API to a full URL
 *
 * The backend stores images in S3 and returns the full S3 URL in image_path.
 * This function handles both cases:
 * - Full URLs (S3, CloudFront, etc.): Returns as-is
 * - Relative paths: Prepends the API base URL (for legacy/local development)
 *
 * @param imagePath - The image path from the API response
 * @returns Full URL to the image, or empty string if imagePath is null/undefined
 *
 * @example
 * // S3 URL - returned as-is
 * getImageUrl('https://s3.amazonaws.com/bucket/image.jpg')
 * // => 'https://s3.amazonaws.com/bucket/image.jpg'
 *
 * // Relative path - API URL prepended
 * getImageUrl('/uploads/image.jpg')
 * // => 'https://api.joohoonkim.site/uploads/image.jpg'
 */
export function getImageUrl(imagePath: string | undefined | null): string {
    if (!imagePath) {
        return '';
    }

    // If it's already a full URL (S3, CloudFront, or any other CDN), return as is
    if (imagePath.startsWith('http://') || imagePath.startsWith('https://')) {
        return imagePath;
    }

    // If it's a relative path starting with /, prepend the API base URL
    if (imagePath.startsWith('/')) {
        return `${API_BASE}${imagePath}`;
    }

    // If it's a relative path without leading /, prepend API base URL with /
    return `${API_BASE}/${imagePath}`;
}

