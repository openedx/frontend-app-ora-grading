# frontend-app-ora-grading

The ORA Staff Grading App is a microfrontend (MFE) staff grading experience for Open Response Assessments (ORAs). This experience was designed to streamline the grading process and enable richer previews of submission content. 

When enabled, ORAs with a staff grading step will link to this new MFE when clicking "Grade Available Responses" from the ORA or link in the instructor dashboard.

## Quickstart

To start the MFE and enable the feature in LMS:

1. Start the MFE and take a note of the location/port. This defaults to `http://localhost:1993`.

2. Add the route root to `edx-platform` settings: In `edx-platform/lms/envs/private.py` or similar, add `ORA_GRADING_MICROFRONTEND_URL = 'http://localhost:1993'`

3. Enable the feature: In Django Admin go to django-waffle > Flags and add/enable a new flag called `openresponseassessment.enhanced_staff_grader`.

From there, visit the new experience by going to the Instructor Dashboard > Open Responses or an ORA with a Staff Graded Step and click a link to begin grading.

## Resources

See the [ORA Staff Grading](https://edx.readthedocs.io/projects/edx-partner-course-staff/en/latest/exercises_tools/open_response_assessments/ORA_Staff_Grading.html#ora-staff-grading) section on ReadTheDocs for usage information.