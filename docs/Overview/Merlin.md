# Provet

## Connection details

In production all instances of Provet within a country should share the same base URL and API Token. This
means that the base URL and API token configuration happens at a Organisation Group level.

The way this happens is that an Organisation Group has a 'ProvetConnectionName' which maps to the connections that are defined in
appsettings.json under the property `Provet.Connections`. This connection config contains a ApiTokenKeyVaultName, which is the
name that will be looked up in Azure KeyVault to get the API Token.

### Adding a new connection

- Add the Token as a secret in Azure KeyVault for all environments you wish to use that connection on, giving it a useful name
(like 'ProvetNetherlandsApiToken')
- In the appsettings.json files appropriate for the environments you wish to use that connection on add a new connection object
(following the examples already there, setting the `ApiTokenKeyVaultName` to be the name you chose in the step above)
- Deploy the changes to the server config
- Create or edit an Organisation Group and set the Provet Connection Name to the name you chose for the connection in your config

### Local development

For local development we don't use Azure KeyVault to get the ApiToken, instead we use .NET Cores Secrets to inject a universal APIToken.
See the Zero To Hero in the base README.md for instructions on how to set this up.
