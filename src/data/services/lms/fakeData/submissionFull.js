import submissionList from './submissionList';

const responseText = (submissionUUID) => `<div><h1>Title (${submissionUUID})</h1>
Phasellus tempor eros aliquam ipsum molestie, vitae varius lectus tempus. Morbi iaculis, libero euismod vehicula rutrum, nisi leo volutpat diam, quis commodo ex nunc ut odio. Pellentesque condimentum feugiat erat ac vulputate. Pellentesque porta rutrum sagittis. Curabitur vulputate tempus accumsan. Fusce bibendum gravida metus a scelerisque. Mauris fringilla orci non lobortis commodo. Quisque iaculis, quam a tincidunt vehicula, erat nisi accumsan quam, eu cursus ligula magna id odio. Nulla porttitor, lorem gravida vehicula tristique, sapien metus tristique ex, id tincidunt sapien justo nec sapien. Maecenas luctus, nisl vestibulum scelerisque pharetra, ligula orci vulputate turpis, in ultrices mauris dolor eu enim. Suspendisse quis nibh nec augue semper maximus. Morbi maximus eleifend magna.

Phasellus porttitor vel magna et auctor. Nulla porttitor convallis aliquam. Donec cursus, ipsum ut egestas bibendum, purus metus dignissim est, ac condimentum leo felis eget diam. In magna mi, tincidunt id sapien id, fermentum vestibulum quam. Quisque et dui sed urna convallis rutrum pellentesque quis sapien. Cras non lectus velit. Praesent semper eros id risus mollis, quis interdum quam imperdiet. Sed nec vulputate tortor, at tristique tortor.
</div>`;

const descriptiveText = (fileName) => `This is some descriptive text for (${fileName}). Phasellus tempor eros aliquam ipsum molestie, vitae varius lectus tempus. Morbi iaculis, libero euismod vehicula rutrum, nisi leo volutpat diam, quis commodo ex nunc ut odio. Pellentesque condimentum feugiat erat ac vulputate. Pellentesque porta rutrum sagittis. Curabitur vulputate tempus accumsan. Fusce bibendum gravida metus a scelerisque. Mauris fringilla orci non lobortis commodo. Quisque iaculis, quam a tincidunt vehicula, erat nisi accumsan quam, eu cursus ligula magna id odio. Nulla porttitor, lorem gravida vehicula tristique, sapien metus tristique ex, id tincidunt sapien justo nec sapien. Maecenas luctus, nisl vestibulum scelerisque pharetra, ligula orci vulputate turpis, in ultrices mauris dolor eu enim. Suspendisse quis nibh nec augue semper maximus. Morbi maximus eleifend magna.`;

const allFiles = [
  'edX_2021_Internal_BrandTMGuidelines_V1.0.9.pdf',
  'irs_p5563.pdf',
  'mit_Cohen_GRL16.pdf',
  'sample.bmp',
  'sample.jpg',
  'sample.png',
  'sample.jpeg',
];

const getFiles = (submissionUUID) => {
  const index = parseInt(submissionUUID.split('-')[1], 10);
  const numFiles = index % allFiles.length;
  const files = [];
  for (let i = 0; i < numFiles; i++) {
    const fileName = `${submissionUUID}_${allFiles[i]}`;
    const descriptionText = descriptiveText(fileName);
    files.push({
      name: allFiles[i],
      description: descriptionText,
      downloadUrl: allFiles[i],
      size: descriptionText.length * 1024,
    });
  }
  return files;
};

// eslint-disable-next-line
export const mockSubmission = (submissionUUID) => ({
  response: {
    text: [responseText(submissionUUID)],
    files: getFiles(submissionUUID),
  },
  gradeStatus: submissionList[submissionUUID].gradeStatus,
  lockStatus: submissionList[submissionUUID].lockStatus,
  points: submissionList[submissionUUID].points,
  gradeData: submissionList[submissionUUID].gradeData,
});

export const mockSubmissionStatus = (submissionUUID) => ({
  gradeData: submissionList[submissionUUID].gradeData,
  gradeStatus: submissionList[submissionUUID].gradeStatus,
  lockStatus: submissionList[submissionUUID].lockStatus,
});
