import submissionList from './submissionList';

const responseText = `<div><h1>Title</h1>
Phasellus tempor eros aliquam ipsum molestie, vitae varius lectus tempus. Morbi iaculis, libero euismod vehicula rutrum, nisi leo volutpat diam, quis commodo ex nunc ut odio. Pellentesque condimentum feugiat erat ac vulputate. Pellentesque porta rutrum sagittis. Curabitur vulputate tempus accumsan. Fusce bibendum gravida metus a scelerisque. Mauris fringilla orci non lobortis commodo. Quisque iaculis, quam a tincidunt vehicula, erat nisi accumsan quam, eu cursus ligula magna id odio. Nulla porttitor, lorem gravida vehicula tristique, sapien metus tristique ex, id tincidunt sapien justo nec sapien. Maecenas luctus, nisl vestibulum scelerisque pharetra, ligula orci vulputate turpis, in ultrices mauris dolor eu enim. Suspendisse quis nibh nec augue semper maximus. Morbi maximus eleifend magna.

Phasellus porttitor vel magna et auctor. Nulla porttitor convallis aliquam. Donec cursus, ipsum ut egestas bibendum, purus metus dignissim est, ac condimentum leo felis eget diam. In magna mi, tincidunt id sapien id, fermentum vestibulum quam. Quisque et dui sed urna convallis rutrum pellentesque quis sapien. Cras non lectus velit. Praesent semper eros id risus mollis, quis interdum quam imperdiet. Sed nec vulputate tortor, at tristique tortor.
</div>`;

const rubricConfig = {
  comments: 'rubric-level comments',
  criteria: [
    {
      name: 'First Criterion',
      orderNum: 0,
      prompt: 'A criterion prompt',
      feedback: 'optional',
      options: [
        {
          orderNum: 0,
          name: 'poor',
          label: 'Poor',
          explanation: 'Includes little information with few or no details or unrelated details.  Unsuccessful in attempts to explore any facets of the topic.',
          points: 0,
          feedback: 'optional',
        },
        {
          orderNum: 1,
          name: 'fair',
          prompt: 'Fair',
          explanation: 'Includes little information and few or no details.  Explores only one or two facets of the topic.',
          points: 1,
          feedback: 'optional',
        },
        {
          orderNum: 2,
          name: 'good',
          prompt: 'Good',
          explanation: 'Includes sufficient information and supporting details.  (Details may not be fully developed; ideas may be listed.)  Explores some facets of the topic.',
          points: 2,
          feedback: 'optional',
        },
        {
          orderNum: 3,
          name: 'excellent',
          prompt: 'Excellent',
          explanation: 'Includes in-depth information and exceptional supportint details that are fully developed.  Explores all facets of the topic',
          points: 3,
          feedback: 'optional',
        },
      ],
    },
  ],
};

// eslint-disable-next-line
export const mockSubmission = (submissionId) => ({
  response: {
    text: responseText,
    files: [],
  },
  status: submissionList[submissionId].status,
  grade: submissionList[submissionId].grade,
  rubricConfig,
});
