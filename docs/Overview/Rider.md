# Rider

## Powershell

- It is recommended to install the Powershell plugin by going File | Settings | Plugins | "Browse Repositories" and
searching for 'Powershell'
- You can also make Rider's inbuilt terminal use Powershell by going File | Settings | Tools | Terminal and changing 
'Shell path' to `powershell`. See [here](https://www.jetbrains.com/help/rider/Settings_Tools_Terminal.html) for more
information)

## Database Connections

- You should be able to connect to the local database using the 'Database' window in Rider. The connection details
should exist as part of the repository already, but it may ask you for the username and password. The username is `SA`
and the password can be found in `Scripts/Database/CreateDatabaseDockerContainer.ps1`.

## Styled Components

- It is recommended to install the Styled Components plugin by going File | Settings | Plugins | "Marketplace" and
  searching for 'Styled Components'
  
## Prettier

- It is also recommended to install the Prettier plugin  by going File | Settings | Plugins | "Marketplace" and
    searching for 'Prettier'
  
## Editor Config
The project uses editor config, to make code inspection use the editor config:

- Go to File | Settings | Editor | Inspection Settings and tick "Read settings from editorconfig..."
