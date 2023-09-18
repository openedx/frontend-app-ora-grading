frontend-app-ora-grading
#############################

|license-badge| |status-badge| |ci-badge| |codecov-badge|


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
<https://github.com/openedx/edx-platform/tree/master/lms/djangoapps/ora_staff_grader>`_
app in ``edx-platform``.

Getting Started
***************

Prerequisites
=============

The `devstack`_ is currently recommended as a development environment for your
new MFE.  If you start it with ``make dev.up.lms`` that should give you
everything you need as a companion to this frontend.

Note that it is also possible to use `Tutor`_ to develop an MFE.  You can refer
to the `relevant tutor-mfe documentation`_ to get started using it.

.. _Devstack: https://github.com/openedx/devstack

.. _Tutor: https://github.com/overhangio/tutor

.. _relevant tutor-mfe documentation: https://github.com/overhangio/tutor-mfe#mfe-development

Developing
==========

Cloning and Startup
--------------

First, clone the repo, install code prerequisites, and start the app.

.. code-block::


  1. Clone your new repo:

  ``git clone git@github.com:openedx/frontend-app-ora-grading.git``

  2. Use node v18.x.

    The current version of the micro-frontend build scripts support node 18.
    Using other major versions of node *may* work, but this is unsupported.  For
    convenience, this repository includes an .nvmrc file to help in setting the
    correct node version via `nvm <https://github.com/nvm-sh/nvm>`_.

  3. Install npm dependencies:

    ``cd frontend-app-ora-grading && npm install``

  4. Update the application port to use for local development:

    Default port is 1993. If this does not work for you, update the line
    `PORT=1993` to your port in all .env.* files

  5. Start the dev server:

    ``npm start``

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

This component follows the standard deploy process for MFEs. For details, see
the `MFE production deployment guide`_

.. _MFE production deployment guide: https://openedx.github.io/frontend-platform/#production-deployment-strategy

Internationalization
====================

Please see refer to the `frontend-platform i18n howto`_ for documentation on
internationalization.

.. _frontend-platform i18n howto: https://github.com/openedx/frontend-platform/blob/master/docs/how_tos/i18n.rst

Getting Help
************

If you're having trouble, we have discussion forums at
https://discuss.openedx.org where you can connect with others in the community.

Our real-time conversations are on Slack. You can request a `Slack
invitation`_, then join our `community Slack workspace`_.  Because this is a
frontend repository, the best place to discuss it would be in the `#wg-frontend
channel`_.

For anything non-trivial, the best path is to open an issue in this repository
with as many details about the issue you are facing as you can provide.

https://github.com/openedx/frontend-app-ora-grading/issues

For more information about these options, see the `Getting Help`_ page.

.. _Slack invitation: https://openedx.org/slack
.. _community Slack workspace: https://openedx.slack.com/
.. _#wg-frontend channel: https://openedx.slack.com/archives/C04BM6YC7A6
.. _Getting Help: https://openedx.org/community/connect

License
*******

The code in this repository is licensed under the AGPLv3 unless otherwise
noted.

Please see `LICENSE <LICENSE>`_ for details.

Contributing
************

Contributions are very welcome.  Please read `How To Contribute`_ for details.

.. _How To Contribute: https://openedx.org/r/how-to-contribute

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

Please do not report security issues in public, and email security@openedx.org instead.

.. |license-badge| image:: https://img.shields.io/github/license/openedx/frontend-app-ora-grading.svg
    :target: https://github.com/openedx/frontend-app-ora-grading/blob/master/LICENSE
    :alt: License

.. |status-badge| image:: https://img.shields.io/badge/Status-Maintained-brightgreen

.. |ci-badge| image:: https://github.com/openedx/frontend-app-ora-grading/actions/workflows/ci.yml/badge.svg
    :target: https://github.com/openedx/frontend-app-ora-grading/actions/workflows/ci.yml
    :alt: Continuous Integration

.. |codecov-badge| image:: https://codecov.io/github/openedx/frontend-app-ora-grading/coverage.svg?branch=master
    :target: https://codecov.io/github/openedx/frontend-app-ora-grading?branch=master
    :alt: Codecov
