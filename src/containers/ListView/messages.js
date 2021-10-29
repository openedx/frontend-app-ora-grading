import { defineMessages } from '@edx/frontend-platform/i18n';

const messages = defineMessages({
  backToResponses: {
    id: 'ora-grading.ListView.ListViewBreadcrumbs.backToResponses',
    defaultMessage: 'Back to all open responses',
    description: 'Breadcrumbs link text to return to ORA list in LMS.',
  },
  noResultsFound: {
    id: 'ora-grading.ListView.noResultsFound',
    defaultMessage: 'No results found',
    description: 'Empty table content for submissions list',
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
});

export default messages;
