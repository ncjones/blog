---
title: Prod Deployment on Day One
date: 2023-06-05
author: Nathan
desc: |
  Deploying to production on day one is a simple policy that helps teams to
  optimize software delivery pipelines. There are several techniques that help
  to create a reliable zero-to-production experience for new developers.
img: /img/small-rocket-pre-launch.png
---


Deploying to production on day one is a simple policy that helps teams think
holistically about the efficiency of the tools and processes they use for
delivering software. There are specific techniques we can apply to help make
this policy achievable.


## Why Deploy on Day One?

Getting new engineers to go from zero to production on day one has clear
benefits to newcomers: they get productive with code sooner and they get
exposed to the team's delivery tooling and culture. But maintaining such a
policy has other ongoing benefits for the whole team.

Delivering any change to production requires executing a reproducible sequence
of steps. A day-one change is like a tracer through those all of the steps,
even the ones that are not repeated often. It can highlight bottlenecks in the
developer onboarding process and the software delivery pipeline.

A smoother local dev setup process helps the team to minimize the occurrence of
"works on my machine" type of issues and it lowers the bar for contributing to
different parts of the code base.

A successful deployment of a small change shows the delivery pipeline is in a
healthy state. Any change can easily be held up by work in progress that is not
ready to be deployed to production. A team with a disciplined approach to
minimizing work in progress will avoid such blockers and work quickly to
resolve them.


## Techniques to Enable Deployment on Day One

The following techniques are the main ones that I have found to be effective at
creating a development environment that supports the practice of deploying to
production on day one.

### Guide for new engineers

Create and maintain a day-one guide for new engineers to follow. Encourage
newcomers to critique and improve the guide. The guide should include
instructions for getting access to and running code.

### CI/CD Pipeline


There should be a continuous delivery pipeline to make deployment to production
automated and safe. The delivery pipeline has automated tests and
post-deployment checks.

Example pipeline execution:

![Github Actions Pipeline](/img/github-actions-pipeline.png)

The team should have a culture of getting changes into production quickly,
verifying them, and responding to errors and alerts.


### Pull code with one command

Make it easy to pull all code across all code repositories. [Android Repo
Tool](https://source.android.com/source/using-repo.html) and
[MyRepos](https://myrepos.branchable.com/) are two tools which make it easy to
solve this problem in a standard way.

Example execution of Repo Tool to update 18 Git repositories:

```
$  repo sync
remote: Enumerating objects: 5, done.
remote: Counting objects: 100% (5/5), done.
remote: Compressing objects: 100% (2/2), done.
remote: Total 3 (delta 1), reused 3 (delta 1), pack-reused 0
Fetching: 100% (18/18), done in 9.268s
repo sync has finished successfully.
```


### Trivial First Change

Define a trivial one-line change that all engineers can perform as their first
change. The change should be easy to observe and verify in production. Adding a
line to [humans.txt](https://humanstxt.org/) is a good option.

Example commit history for humans.txt:

```
$  git log --oneline public/humans.txt
1e573e8 Add my name to the list of awesome humans
```


### Readme in every repo

Every code repository should contain a readme file. The readme should summarize
the purpose of the repo and specify the minimum steps to install dependencies,
start the application and run automated tests.

Example minimal README.md:

```markdown
# Galactus

The monolithic API server.

## Run Unit Tests

    yarn install
    yarn test

## Run Application

    docker compose run script yarn install
    docker compose up

## Run Feature Tests

    docker compose run cucumber yarn cucumber

```

Without these basic instructions, we rely on knowledge of conventions based on
the tools in use. Not everyone will be familiar with tools or their
conventions. Variants in the commands tend to emerge as tooling evolves too.
Regardless of how obvious these basic commands seem, they should be listed in
the readme.


### Docker First

Run backend applications within Docker and standardize the steps for running
and testing any application. Steps should generally be like this: a) install
dependencies, b) run "docker compose up", and c) run feature tests.

Use real databases within the local Docker environment. Don't depend on
technologies that cannot run locally in Docker.

Docker might not be necessary for frontend single-page applications which do
not require other services to be running locally. Instead, a tool like Cypress
can be used to provide all the dependencies required for testing.


### Stubbed Local Dependencies

Local Dockerized development environment should not call out to real services.
Instead, use [Wiremock](https://wiremock.org/) or similar to stub out the
interactions. Stubbed dependencies include not just third-party APIs but also
internal APIs that are managed as separate deployables.

Frontend applications can depend on real services for local development but API
endpoints should be mocked when running test automation.


### Port Assignments

Assign unique local ports to prevent applications from failing to start due to
port conflicts when multiple applications are running. Register ports centrally
in your internal documentation tool.

Example port assignments:

| App      | Web   | Debugger | Proxy | Redis |
|----------|-------|----------|-------|-------|
| racoon   | 12180 | 12129    | 12188 |       |
| wingman  | 12280 | 12229    | 12288 |       |
| galactus | 12380 | 12329    | 12388 | 12379 |

Exposing ports to the local host allows developers to more easily interact with
the running services with their preferred debugging tools.


