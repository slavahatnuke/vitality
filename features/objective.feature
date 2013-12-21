Feature: Objective
  I want to check project configuration in one command
  Like `vitality check.yml`

  I want to setup project automaticaly in one command
  Like `vitality setup.yml`

  I want to see result table with status and subject/title
  Like: [ok]   apache is working
        [fail] apache is working
        [ok]   less is installed
        [fail] less version is correct

  as result I want to give exit code 0 or 1

  Scenario: Check node.js project
    Given I am in the project folder
    When I run "vitality.yml"
    Then I should see result:
    |status     |message                  |
    |[ok]       |node is installed        |
    |[fail]     |no-command is installed  |
    Then Exit code should be "1"