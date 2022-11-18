# Authentication

## Overview
Pacman uses Azure Active Directory for authentication.

IVC have a different Azure AD tenant for each country IVC operate in. IVC have only recently adopted AAD - the move to
setup AAD is ongoing at the same time as the initial development of Pacman. Due to this, the authentication is setup in
a way that can provide flexibility around what the chosen identity management is, whether that is IVC's Azure AD, 
a third-party tool like Azure B2C or different auth providers per country.

To do this Pacman uses [IdentityServer](https://identityserver.io/) as a [Federation Gateway](http://docs.identityserver.io/en/latest/topics/federation_gateway.html),
where the Pacman frontend client and api authenticate against IdentityServer (which is running as part of Pacman's API), which can then delegate user authentication to
another provider. The auth provider can be changed without affecting how the API and frontend client behave (just changes to IdentityServer are needed), which
should mean changing auth providers (or having different providers per country) is simpler.

## Azure Active Directory
Pacman authenticates using IVC's Azure AD. User details are stored in AAD - Pacman has no visibility of
passwords, etc. Authorisation and role assignment is managed through Pacman - users can be assigned Pacman roles
through the Pacman UI.

### AAD setup
Pacman needs to be registered as an application in each Azure AD tenant. This was done originally by Andrew Eliott
at IVC, following these instructions:

Register an application in AAD. See https://docs.microsoft.com/en-gb/azure/active-directory/develop/quickstart-register-app
* Open the directory in the Azure Portal
* Open App Registrations
* Click New Registration
* Enter app details:
  * Enter an app name
  * For account types, choose 'Accounts in this organisation directory only'
  * Leave the redirect URI blank
  * Click save
 
Configure the new registration to support authentication through Pacman - see the Azure docs for up to date information:
* From the app's overview page, open the Authentication section.
* For each URL where the website will be accessed (IE for each different environment), add a redirect URI, with type Web, and URI https://**domain**/authentication/aad-**countryName**-signin, e.g. https://int-pricing.ivcevidensia.com/aad-uk-signin.  
* We’ll need these redirect URIs for each environment – i.e. Int / Test / UAT / QA / Production
* Click save
 
Create a client secret:
* Open the 'Certificates and secrets' section.
* Click 'New client secret'.
* Create a secret called Pacman API', which never expires.
* Copy the secret value - we'll need it for the app config.
 
In the 'Manifest' section, update the "accessTokenAcceptedVersion" value to 2, and click Save. 
 
The `appsettings.json` file should then be updated with the following values:
* The Azure AD tenant name
* The Directory (tenant) ID from the Overview page on the app registration
* The app registration Application (client) ID, from the Overview page
* The client secret value, created above

### Test users

IVC have set up the following test users in AAD. These all share the same password, which can be found in LastPass.

| Name | Country | Username                                                                |
| ------| ------- | ----------------------------------------------------------------------- | 
| Super Admin | UK | pacman_super_admin@ivcevidensia.com |
| Central User Admin | UK | pacman_uk_central_user_admin@ivcevidensia.com |
| Central View | UK | pacman_uk_central_view@ivcevidensia.com |
| Central Admin | UK | pacman_uk_central_admin@ivcevidensia.com |
| Site User Admin | UK | pacman_uk_site_user_admin@ivcevidensia.com |
| Site Price Admin | UK | pacman_uk_site_price_admin@ivcevidensia.com |
| Site Visibility Admin | UK | pacman_uk_site_visibility_admin@ivcevidensia.com |
| Sweden Super Admin | Sweden | pacman_sweden_super_admin@evidensia.se |
| Sweden Central User Admin | Sweden | pacman_sweden_central_user_admin@evidensia.se |
| Sweden Central View | Sweden | pacman_sweden_central_view@evidensia.se |

## [IdentityServer](https://identityserver.io/)
IdentityServer is a .NET implementation of an OAuth 2.0 and OpenID Connect Authorisation
Server. This library allows our API to act as an authorisation server, responsible for
authenticating the user through OAuth / OpenID flows and issuing OAauth access tokens
to the frontend.

Internally, authentication requests are federated out to Azure AD. This federation is
done via OpenID Connect, using the OAuth Code Flow with PKCE to authenticate the user
and return user details to Identity Server (in the form of a JWT Identity Token).
Identity Server then sets its own authentication session for the user, storing
user details in a cookie.

## [oidc-client-js](https://github.com/IdentityModel/oidc-client-js)
This is a Javascript library which provides OpenID Connect / OAuth2 client
side support. It is used by the frontend to authenticate with the API servers
IdentityServer endpoints.

Specifically, the Authorisation Code with PKCE OAuth flow is used by the frontend
to obtain a JWT access token from Identity Server, which is sent to the API server with all requests.

## Signing certificates
IdentityServer needs certificates to sign access tokens. These certificates are stored
in Azure Key Vault - see `Scripts/Azure/CreateKeyVaultCertificates.ps1` script for details of how
the certificates are created (you will need to install the AZ Powershell module to run the script,
see [here](https://docs.microsoft.com/en-us/powershell/azure/install-az-ps?view=azps-2.6.0).

Key Vault is set up to rotate these certificates automatically. Identity Server supports
key rollover by allowing past / future certificates to be marked as validation certificates only,
meaning tokens signed by these certificates will be marked as valid, but the certificates will
not be used to sign new tokens. This is needed to ensure old access tokens are not invalidated
when the certificates are rolled over, and to accomodate for timing differences between how long
different servers take to pick up the latest certificates.
