# Practice Management Systems

Pacman's primary purpose is to connect to IVC's Practice Management Systems (PMSes), to send pricing
and item data.

Pacman was originally designed to integrate with three PMSes: Provet, Merlin and Voyager. As of September 2020,
only Merlin is in use. 

Provet was originally in scope, but is no longer being used by IVC UK. There is still the potential
desire to support Provet if Pacman is rolled out to IVC Sweden. This means the Provet code has been
left in Pacman, but the Provet connection is not enabled in the UK deployments (and hence is not tested,
so potentially has some issues which will need to be fixed before re-enabling this).

Voyager is a PMS created by the same owners as Merlin. This is not currently in use by Pacman, and has never
been integrated. The API should apparently be the same as the Merlin API.

## Merlin & Voyager

Note that only Merlin is currently enabled within Pacman.

Merlin and Voyager are the PMSs created by MWI. They are pretty similar, however Merlin is cloud hosted, whereas Voyager is installed on prem, with a central server for IVC which uses merge replication to synchronise nightly. 

### API
Swagger documentation for the dev API: https://dev-api.vetspace.cloud/documentation/swagger/#/

Authentication is performed using an API Key, which is exchanged for a temporary access token. See the 
API documentation for more details.

### Accessing the UI 
We can access the UI for Merlin at: https://devapi-pms.vetspace.cloud/ 

The password for this is in lastpass

We can use any device profile as long as we don't print anything".

Tips for using Merlin UI
* To see items go to Administration → Code entry 
* To see manufacturers go to Administration → Treatments → Manufacturers (i think the other libraries are also here) 

### Connection details
In production all instances of Merlin within a country should share the same base URL and API Token. This
means that the base URL and API token configuration happens at a Organisation Group level.

The way this happens is that an Organisation Group has a 'MerlinConnectionName' which maps to the connections that are defined in
appsettings.json under the property `Merlin.Connections`. This connection config contains a `ApiKeyKeyVaultName`, which is the
name that will be looked up in Azure KeyVault to get the API Key.

#### Adding a new connection
- Add the Token as a secret in Azure KeyVault for all environments you wish to use that connection on, giving it a useful name
(like 'MerlinNetherlandsApiToken')
- In the appsettings.json files appropriate for the environments you wish to use that connection on add a new connection object
(following the examples already there, setting the `ApiKeyKeyVaultName` to be the name you chose in the step above)
- Deploy the changes to the server config
- Create or edit an Organisation Group and set the Provet Connection Name to the name you chose for the connection in your config

#### Local development

For local development we don't use Azure KeyVault to get the ApiToken, instead we use .NET Cores Secrets to inject a universal APIToken.
See the Zero To Hero in the base README.md for instructions on how to set this up.

## Provet

Note that Provet is not currently enabled within Pacman.

Pacman communicates with Provet via an HTTP API.

### Environments

Provet Cloud's documentation for using the API can be found [here](https://support.provet.info/integrating-3rd-party-applications-to-the-provet-cloud/).

It has a UI set up so that you can browse the api by just going to the links in this table. You will need to be authenticated (see below)

| | | |
|---|---|---|
| 776 |	https://provetcloud.com/776/api/0.1/ |	Test environment with test data |
| 654 |	https://evidensia.provetcloud.com/654/api/0.1 |	Test environment with copy of live data (few months old) |
| 1931 |	https://provetcloud.com/1931/api/0.1/ |	This is the actual instance we are developing against - IVC are calling it their "sandbox"  |

	
### Using the UI 
- We have logins to the above environments, which can all be found in lastpass 
- To access them, just remove the "api/0.1/" bit from the url 

### Authenticating to the API: 

You can find the tokens in the Shared-IVC-Pacman folder in lastpass

Download and use this chrome extension: https://chrome.google.com/webstore/detail/modheader/idgpnmonknjnojddfkpgkljpfnnfcklj 

Set it up so that you have the following: 
* Request Headers: 
  * `Authorization: Token <insert token here>`
* Filters:  (not strictly necessary but a good idea so you arent accidentally sending your auth headers to other sites)
  * URL Pattern: (for example) https://provetcloud.com/1931/*

Helpful links etc for using provet API and UI : 
* Item subgroups: https://provetcloud.com/1931/organization/administration/items/#item_subgroups
* Vat groups:  https://provetcloud.com/1931/organization/administration/vat/ 
* Suppliers/Wholesalers: https://provetcloud.com/1931/organization/administration/stock/#wholesalers - note this is not available on some of the sites

### Connection details

In production all instances of Provet within a country should share the same base URL and API Token. This
means that the base URL and API token configuration happens at a Organisation Group level.

The way this happens is that an Organisation Group has a 'ProvetConnectionName' which maps to the connections that are defined in
appsettings.json under the property `Provet.Connections`. This connection config contains a ApiTokenKeyVaultName, which is the
name that will be looked up in Azure KeyVault to get the API Token.

#### Adding a new connection

- Add the Token as a secret in Azure KeyVault for all environments you wish to use that connection on, giving it a useful name
(like 'ProvetNetherlandsApiToken')
- In the appsettings.json files appropriate for the environments you wish to use that connection on add a new connection object
(following the examples already there, setting the `ApiTokenKeyVaultName` to be the name you chose in the step above)
- Deploy the changes to the server config
- Create or edit an Organisation Group and set the Provet Connection Name to the name you chose for the connection in your config

#### Local development

For local development we don't use Azure KeyVault to get the ApiToken, instead we use .NET Cores Secrets to inject a universal APIToken.
See the Zero To Hero in the base README.md for instructions on how to set this up.
