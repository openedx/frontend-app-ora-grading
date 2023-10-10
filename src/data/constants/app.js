import { getConfig } from '@edx/frontend-platform';

export const routePath = () => `${getConfig().PUBLIC_PATH}:courseId`;
export const locationId = () => decodeURIComponent(window.location.pathname).replace(getConfig().PUBLIC_PATH, '');
