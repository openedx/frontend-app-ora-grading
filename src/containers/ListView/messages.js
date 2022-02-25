import { defineMessages } from '@edx/frontend-platform/i18n';

const messages = defineMessages({
  backToResponses: {
    id: 'ora-grading.ListView.ListViewBreadcrumbs.backToResponses',
    defaultMessage: 'Back to all open responses',
    description: 'Breadcrumbs link text to return to ORA list in LMS',
  },
  noResultsFoundTitle: {
    id: 'ora-grading.ListView.noResultsFoundTitle',
    defaultMessage: 'Nothing here yet',
    description: 'Empty table for the submission table title',
  },
  noResultsFoundBody: {
    id: 'ora-grading.ListView.noResultsFoundBody',
    defaultMessage: 'When learners submit responses, they will appear here',
    description: 'Empty table messages',
  },
  viewAllResponses: {
    id: 'ora-grading.ListView.viewAllResponses',
    defaultMessage: 'View all responses',
    description: 'Button text to load all responses for review/grading',
  },
  viewSelectedResponses: {
    id: 'ora-grading.ListView.viewSelectedResponses',
    defaultMessage: 'View selected responses ({value})',
    description: 'Button text to load selected responses for review/grading',
  },
  username: {
    id: 'ora-grading.ListView.tableHeaders.username',
    defaultMessage: 'Username',
    description: 'Username table column header for submission list view',
  },
  teamName: {
    id: 'ora-grading.ListView.tableHeaders.teamName',
    defaultMessage: 'Team name',
    description: 'Team name table column header for submission list view',
  },
  learnerSubmissionDate: {
    id: 'ora-grading.ListView.tableHeaders.learnerSubmissionDate',
    defaultMessage: 'Learner submission date',
    description: 'Learner submission date table column header for submission list view',
  },
  teamSubmissionDate: {
    id: 'ora-grading.ListView.tableHeaders.teamSubmissionDate',
    defaultMessage: 'Team submission date',
    description: 'Team submission date table column header for submission list view',
  },
  grade: {
    id: 'ora-grading.ListView.tableHeaders.grade',
    defaultMessage: 'Grade',
    description: 'Grade table column header for submission list view',
  },
  gradingStatus: {
    id: 'ora-grading.ListView.tableHeaders.gradingStatus',
    defaultMessage: 'Grading status',
    description: 'Grading status table column header for submission list view',
  },
  loadErrorHeading: {
    id: 'ora-grading.ListView.loadErrorHeading',
    defaultMessage: 'Error loading submissions',
    description: 'Initialization failure alert header',
  },
  loadErrorMessage: {
    id: 'ora-grading.ListView.loadErrorMessage1',
    defaultMessage: 'An error occurred while loading the submissions for this response. Try reloading the page or going {backToResponses}.',
    description: 'Initialization failure alert message line 2',
  },
  backToResponsesLowercase: {
    id: 'ora-grading.ListView.backToResponsesLowercase',
    defaultMessage: 'back to all Open Responses',
    description: 'lowercase string for link to list of all open responses in lms',
  },
  reloadSubmissions: {
    id: 'ora-grading.ListView.reloadSubmissions',
    defaultMessage: 'Reload submissions',
    description: 'Reload button text in case of network failure',
  },
  loadingResponses: {
    id: 'ora-grading.ListView.loadingResponses',
    defaultMessage: 'Loading responses',
    description: 'loading text for submission response list',
  },
});

export default messages;
