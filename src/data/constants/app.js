import { getConfig, getPath } from '@edx/frontend-platform';

const publicPath = getPath(getConfig().PUBLIC_PATH);
export const routePath = () => `${publicPath}:courseId`;
export const locationId = () => decodeURIComponent(window.location.pathname).replace(publicPath, '');
