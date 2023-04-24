frontend-app-ora-grading
########################

|ci-badge| |codecov-badge| |doc-badge| |license-badge| |status-badge|

Purpose
*******

The ORA Staff Grading App is a micro-frontend (MFE) staff grading experience
for Open Response Assessments (ORAs). This experience was designed to
streamline the grading process and enable richer previews of submission content
and, eventually, replace on-platform grading workflows for ORA.

When enabled, ORAs with a staff grading step will link to this new MFE when
clicking "Grade Available Responses" from the ORA or link in the instructor
dashboard.

The ORA Staff Grader depends on the `lms/djangoapps/ora_staff_grader
<https://github.com/openedx/edx-platform/tree/master/lms/djangoapps/ora_staff_grader>`
app in ``edx-platform``.

Getting Started
***************

Developing
==========

One Time Setup
--------------

First, clone the repo, install code prerequisites, and start the app.

.. code-block::

  # Clone the repository
  git clone git@github.com:openedx/frontend-app-ora-grading.git
  cd frontend-app-ora-grading

  # Install prerequisites
  npm install

  # Start the MFE
  npm run start

The app will, by default, run on `http://localhost:1993` unless otherwise
specified in ``.env.development:PORT`` and ``.env.development:BASE_URL``.

Next, enable the ORA Grading micro-frontend in `edx-platform`

#. Add the path to the ORA Grading app in `edx-platform`:

   #. Go to your environment settings (e.g. `edx-platform/lms/envs/private.py`)

   #. Add the environment variable, ``ORA_GRADING_MICROFRONTEND_URL`` pointing
      to the ORA Grading app location (e.g. ``http://localhost:1993``).

#. Start / restart the ``edx-platform`` ``lms``.

#. Enable the ORA Grading feature in Django Admin.

    #. Go to Django Admin (`{lms-root}/admin`)

    #. Navigate to ``django-waffle`` > ``Flags`` and click ``add/enable a new
       flag``.

    #. Add a new flag called ``openresponseassessment.enhanced_staff_grader``
       and enable it.

From there, visit an Open Response Assessment with a Staff Graded Step and
click the "View and grade responses" button to begin grading in the ORA Staff
Grader experience.


Making Changes
--------------

Get / install the latest code:

.. code-block::

  # Grab the latest code
  git checkout master
  git pull

  # Install/update the dev requirements
  npm install


Before committing:

.. code-block::

  # Make a new branch for your changes
  git checkout -b <your_github_username>/<short_description>

  # Using your favorite editor, edit the code to make your change.

  # Run your new tests
  npm test

  # Commit all your changes
  git commit ...
  git push

  # Open a PR and ask for review.

Deploying
=========

TODO: How can a new user go about deploying this component? Is it just a few
commands? Is there a larger how-to that should be linked here?

PLACEHOLDER: For details on how to deploy this component, see the `deployment how-to`_

.. _deployment how-to: https://docs.openedx.org/projects/frontend-app-ora-grading/how-tos/how-to-deploy-this-component.html

Getting Help
************

Documentation
=============

See `ORA Staff Grading on ReadTheDocs`_ for more in-depth usage information.

.. _ORA Staff Grading on ReadTheDocs: https://edx.readthedocs.io/projects/edx-partner-course-staff/en/latest/exercises_tools/open_response_assessments/ORA_Staff_Grading.html#ora-staff-grading

More Help
=========

If you're having trouble, we have discussion forums at
https://discuss.openedx.org where you can connect with others in the
community.

Our real-time conversations are on Slack. You can request a `Slack
invitation`_, then join our `community Slack workspace`_.

For anything non-trivial, the best path is to open an issue in this
repository with as many details about the issue you are facing as you
can provide.

https://github.com/openedx/frontend-app-ora-grading/issues

For more information about these options, see the `Getting Help`_ page.

.. _Slack invitation: https://openedx.org/slack
.. _community Slack workspace: https://openedx.slack.com/
.. _Getting Help: https://openedx.org/getting-help

License
*******

The code in this repository is licensed under the GNU Affero General Public
License v3.0 unless otherwise noted.

Please see `LICENSE <LICENSE>`_ for details.

Contributing
************

Contributions are very welcome.
Please read `How To Contribute <https://openedx.org/r/how-to-contribute>`_ for details.

This project is currently accepting all types of contributions, bug fixes,
security fixes, maintenance work, or new features.  However, please make sure
to have a discussion about your new feature idea with the maintainers prior to
beginning development to maximize the chances of your change being accepted.
You can start a conversation by creating a new issue on this repo summarizing
your idea.

The Open edX Code of Conduct
****************************

All community members are expected to follow the `Open edX Code of Conduct`_.

.. _Open edX Code of Conduct: https://openedx.org/code-of-conduct/

People
******

The assigned maintainers for this component and other project details may be
found in `Backstage`_. Backstage pulls this data from the ``catalog-info.yaml``
file in this repo.

.. _Backstage: https://open-edx-backstage.herokuapp.com/catalog/default/component/frontend-app-ora-grading

Reporting Security Issues
*************************

Please do not report security issues in public. Please email security@tcril.org.

.. |ci-badge| image:: https://github.com/openedx/frontend-app-ora-grading/actions/workflows/ci.yml/badge.svg
    :target: https://github.com/openedx/frontend-app-ora-grading/actions/workflows/ci.yml
    :alt: CI

.. |codecov-badge| image:: https://codecov.io/github/openedx/frontend-app-ora-grading/coverage.svg?branch=master
    :target: https://codecov.io/github/openedx/frontend-app-ora-grading?branch=master
    :alt: Codecov

.. |doc-badge| image:: https://readthedocs.org/projects/frontend-app-ora-grading/badge/?version=latest
    :target: https://edx.readthedocs.io/projects/edx-partner-course-staff/en/latest/exercises_tools/open_response_assessments/ORA_Staff_Grading.html
    :alt: Documentation

.. |license-badge| image:: https://img.shields.io/github/license/openedx/frontend-app-ora-grading.svg
    :target: https://github.com/openedx/frontend-app-ora-grading/blob/master/LICENSE
    :alt: License

.. |status-badge| image:: https://img.shields.io/badge/Status-Maintained-brightgreen
