# Azure Environments

The project is deployed to Azure and the environments are managed by IVC's infrastructure team. Changes to the environments
can be tested out in the Int environment, but need to be rolled out by the IVC infrastructure team to other environments.

A high level overview of the Azure resources used is as follows:

- [App service](https://azure.microsoft.com/en-gb/services/app-service/) - IaaS hosting for the web
  server, serving the API and the static frontend content.
- [SQL database](https://azure.microsoft.com/en-gb/services/sql-database/) - Hosted SQL Server
  equivalent
- [Azure Key Vault](https://docs.microsoft.com/en-gb/azure/key-vault/) - Stores application secrets,
  such as connection strings and API keys, and signing certificates for authentication.
- [Azure Application Insights](https://docs.microsoft.com/en-us/azure/azure-monitor/app/app-insights-overview) -
  application performance monitoring. See [Monitoring.md](./Monitoring.md)
- Incapsula Firewall - network security, sits in front of the App Service to allow public access.

## Networking
The website and API is accessed through Incapsula, a network firewall. The App Service is restricted at
the IP level to only accept incoming traffic from Incapsula, and cannot be accessed directly. Incapsula
is set up to only accept connections through the IVC network. Users not on the IVC network should connect
through the IVC VPN - contact IVC's infrastructure team for details.
  
## Environments
  
| Environment | URL                                                                                           | Purpose                                                                                                           |
| ----------- | --------------------------------------------------------------------------------------------- | ----------------------------------------------------------------------------------------------------------------- |
| Int         | [https://int-pricing.ivcevidensia.com/](https://int-pricing.ivcevidensia.com/)  | Latest code on the `master` branch, used to check deployments are working and code runs in an Azure environment.                |
| Test        | [https://test-pricing.ivcevidensia.com/](https://test-pricing.ivcevidensia.com/)| Used for internal testing. Connected to the Merlin dev instance, with dummy test data.                                          |
| UAT         | [https://uat-pricing.ivcevidensia.com/](https://uat-pricing.ivcevidensia.com/)  | Used for user acceptance testing. Connected to the Merlin dev instance, with dummy test data.                                   |
| QA/Pre-prod | [https://qa-pricing.ivcevidensia.com/](https://qa-pricing.ivcevidensia.com/)    | Used for pre-production testing. Connected to the Merlin UAT instance, with real data migrated from the Merlin UAT instance.    |
| Production  | [https://prod-pricing.ivcevidensia.com/](https://prod-pricing.ivcevidensia.com/)|                                                                                                                                 |
  