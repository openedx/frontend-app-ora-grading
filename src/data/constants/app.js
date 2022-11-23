import { getConfig } from '@edx/frontend-platform';

export const getRoutePath = () => `${getConfig().PUBLIC_PATH}:courseId`;
export const routePath = getRoutePath();

export const getLocationId = () => window.location.pathname.replace(new RegExp(`^${getConfig().PUBLIC_PATH}`), '');
export const locationId = getLocationId();
