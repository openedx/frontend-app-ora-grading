import { getConfig } from '@edx/frontend-platform';

export const routePath = `${getConfig().PUBLIC_PATH}:courseId`;
export const locationId = window.location.pathname.replace(getConfig().PUBLIC_PATH, '');
