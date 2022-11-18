# Organisations

Organisations are a table driven entity.

All organisations in the AppSettings:AzureAd:Tenants section are displayed on the login screen. Select one to authenticate based on the settings in AppSettings.


A User has one organisation, this organisation links to a set of Merlins in AppSettings:Merlin via the MerlinConnectionName. The Pacman API will decode the users organisation name and grab the Merlin groups and iterate a CRUD action against all Merlins specified.


Application flow for queries:
```
CQRS -> Handler

	UserService -> 
		UserId = Get the user ID from the Auth Principle
		GetCurrentUserOrganisationGroupId(UserID)
			Lookup OrganisationID from the Database


	Query Context using filter and OrgID from DB.,
```

# API

The api will use the Merlin Connection Service / MerlinApiFactory (MerlinApiFactory.CreateApi) to determin the API to call, this gets the connection details. 

The organisationID connects the OrganisationGroups table to the Merlin Connection in the AppSettings:Merlin section. The Appsettings section defines the:
	
>	API
> 	Merlin Groups
> 	Keys

To use.

The ConfigurationMerlinConnectionDetailsProvider object is populated via the Options Pattern - Loads a collection from the AppSettings:Merlin:Connections.

MerlinConnectionService.GetConnectionDetails(orgId) will return the Merlin Connection (inluding the groups) to use.

# Creating a new Organisation

Add an entry in the Appsettings AzureAD section

>	Copy the UK, give a new name
	

Add an entry in the Appsettings Merlin section, add a connection referencing the correct set of Merlins to use. The NAME is the name used in the UI - this ties the two entites together.

Use the Pacman UI to create an entry in the OrganisationGroups Table

>	Azure AD tenant name
>	This tenant name must match one of the names in the 'AzureAd.Tenants' section of the application configuration (appsettings.json).
>
>	Merlin connection name
>	This connection name must match one of the names in the 'Merlin.Connections' section of the application configuration (appsettings.json).


Pacman looks up the organisation in the table, returning the merlinConnectionName. This ConnectionName is used to lookup the groups in the AppSettings.

```
"Merlin": {
    "IsSendingDataDisabled": false,
    "ApiKey": null,
    "Connections": [
      {
        "Name": "UK",
        "Url": "https://dev-api.vetspace.cloud",
        "ApiAccountId": "6F094383-68D4-46E9-B841-6AC57340CDFE",
        "ApiKeyKeyVaultName": "MerlinUkApiKey",
        "GroupIds": [ 25, 40 ]
      }
    ]
  }
```