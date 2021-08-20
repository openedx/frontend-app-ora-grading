import { getConfig } from '@edx/frontend-platform';

// eslint-disable-next-line import/prefer-default-export
export const routePath = `${getConfig().PUBLIC_PATH}:courseId`;
