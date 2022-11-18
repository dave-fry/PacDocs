# Continuous Integration and Deployments

We use [Azure DevOps Pipelines](https://dev.azure.com/IVCPricingTool/Pricing%20Tool/_build?definitionId=2) to automate builds
and deployments.

## Builds

The config files for the builds live in the [AzurePipelines](../AzurePipelines) directory. There are two jobs that run depending on the branch,
with one running on every commit to master and one that runs on all commits on every branch apart from master. Both jobs are the same, except
that the master job packages everything up for deployment too.

The build process calls the [Nuke](https://nuke.build/index.html) build script `build.ps1` to compile the code, run
tests and package it all up as an artifact that can be used in the deployment (master only).

The build process creates a Docker container that contains an instance of SQL Server, which allows the tests to run
against a database without needing to deploy to an environment.

## Deployments

Azure Pipelines deploys artifacts built by the build pipeline for the `master` branch to the Azure environment as well
as running the migrations against the Azure SQL database for that environment. 

Deployments are promoted through the chain of environments:

Int -> Test -> UAT -> Pre-prod (QA) -> Production

Deployments to Int happen automatically once the build for the `master` branch has finished. Later environments require
a manual approval to promote a deployment to that environment.

### Deployment network security

As of September 2020, the App Service networking restrictions set up by the IVC infrastructure team lock down all traffic
to the App Service's SCM deployment domain. The intention here is to prevent any public access to the server. Since
we're currently using Microsoft's hosted Pipelines agents for deployments, this prevents the agents from connecting to the
app service to perform the deploy.

The long term plan is for an on-prem VM to be set up, and used a 
[self-hosted agent](https://docs.microsoft.com/en-us/azure/devops/pipelines/agents/v2-windows?view=azure-devops#check-prerequisites).

As of September 2020, this is not yet set up. As a workaround, to perform a deploy, we need to contact Andrew Eliott on
IVC's infrastructure team, and have him temporarily open up the SCM IPs while we run the deploy, before locking it back
down again.
