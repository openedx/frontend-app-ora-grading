import { StrictDict } from 'utils';

export const submissionUUID = (index) => `SUBMISSION_ID-${index}`;
export const learnerId = (index) => `LEARNER_ID-${index}`;
export const locationId = (index) => `ORA_LOCATION_ID-${index}`;
export const sessionId = (index) => `ESG_SESSION_ID-${index}`;
export const username = (index) => `USERNAME-${index}`;
export const teamName = (index) => `TEAM_NAME-${index}`;

export default StrictDict({
  learnerId,
  locationId,
  sessionId,
  submissionUUID,
  username,
  teamName,
});
