# Data Migration

As part of the initial go-live for Pacman, we will perform a data migration to take
existing data from Merlin, and import it into Pacman. From this point onwards,
Pacman will be responsible for managing item & pricing data, and Merlin should not
be used directly.

## Central data migration instructions

Note that these instructions assume a Merlin-only rollout, and do not cover Provet.

### Data required from IVC

The data to be imported into Pacman should be supplied through various spreadsheets,
which IVC have produced from Merlin exports.

See the DataMigrationsTemplates directory for the template spreadsheets.

Note that after IVC have produced this data, it's important that IVC do not make any changes to items in Merlin manually after this export has been produced, as else the items will differ between Merlin and Pacman.

The following data is required:
* Supplier Import – we need a supplier list **for each supplier**. See [DataMigrationTemplates/SupplierImportTemplate.csv](./DataMigrationTemplates/SupplierImportTemplate.csv) for the expected format.

* Items import – we need the items provided as per the [DataMigrationTemplates/ItemsImportTemplate.csv](./DataMigrationTemplates/ItemsImportTemplate.csv), which includes an example item for reference. Items must meet the Pacman validation rules, some of which are outlined below.
  * We need an ItemType to be provided here, even though it doesn’t exist in Merlin – this is required by Pacman to determine whether an item is a stock item or service item. It doesn’t matter what the exact type is, only whether it’s a stock or service type, so feel free to hardcode in some dummy data here if it’s easier.
  * Boolean columns should contain Yes / No values
  * Null values should be represented as an empty string (as opposed to "NULL", which is how these values are exported from Merlin)
  * Libraries should use the names in Merlin. Of particular note, this means Tax Rates should have the Merlin names, such as "T1" or "Exempt", rather than the values (e.g. 20 or 0).
  * Stock Items require a Central Markup Percentage, and no Recommended Price. Service items require a Recommended Price, and no Central Markup Percentage.
  * Stock Items require a Units Per Pack.
  * Items with an HCP Group should have an HCP Multiplier.
  * Dispense Fee is required in Pacman (but is optional in Merlin).
  * Item Code max length is 25.
  * Item Code must not be duplicated.

* Items Merlin Code Ids – we need to know the internal Merlin Code IDs for each item. This is integer value for each item, that Merlin uses to uniquely identify the item. This is referred to as the "Product ID" in the data export provided by MWI. See the [DataMigrationTemplates/ItemMerlinCodeIdsTemplate.csv](./DataMigrationTemplates/ItemMerlinCodeIdsTemplate.csv)

* Supplier products – we need to know the mapping between Supplier Products and Item Codes. See [DataMigrationTemplates/SupplierProductsTemplate.csv](./DataMigrationTemplates/SupplierProductsTemplate.csv)

* Deviations – for each site that you want to test, we’ll need an export of the deviations from Merlin, as per the “Deviations import template.csv”. @Ann-Marie McElhinney, @Amy Fox – this is only required for testing the site-specific deviations – I’m not sure if this is something you’re planning to test now, or if this will be done later on? If so, we won’t need these immediately.


### Infrastructure configuration
1. Ensure Merlin connection details are set in Azure Key Vault, and in the appsettings.json configuration file.
2. Disable sending data to Merlin. This is required to ensure that we do not recreate items in Merlin during the item data migration process. This should be done by setting the Merlin:IsSendingDataDisabled configuration value to false, either in the appsettings.json configuration file, or by adding a MERLIN__ISSENDINGDATADISABLED configuration setting on the Azure App Service configuration page.

### Initial user configuration
1. Create SuperAdmin users in Pacman if required.
    1. This is done manually by inserting the user into the Users table in the database, and inserting a row in the UserPermissions table to grant SuperAdmin permission.
    2. Our initial DB seed scripts currently set up John & Ann-Marie from IVC, as well as Ric, Bradley, Dani and Charles from Ghyston.
2. Create other users directly in Pacman
    1. Super admins can create other users in Pacman through the administration page, and assign permissions as required. Note that users will also need to exist in IVC's Active Directory to be able to log in.

### First Merlin Instance
These steps are for integrating the first instance of Merlin into Pacman. Subsequent instances of Merlin should follow the instructions later on in this document.

#### Import suppliers
1. Sync suppliers from Merlin, by clicking the "Sync Suppliers" button on the Suppliers page in the tool.
2. Upload supplier list spreadsheets **for each supplier**, through the "Upload supplier list" page in the tool. 

#### Import items

Items will be imported by creating them via the item bulk upload. Note that during normal operation of the system, creating items in Pacman will create the items in Merlin. During the data migration, we need to avoid recreating existing items in Merlin, which we will do by disabling data sending to Merlin.

1. Ensure Merlin data sending is switched off in the app configuration, as per the above instructions.
2. Note down the Group ID of the particular instance of Merlin that is being integrated, it will be needed later
3. Upload items via the Item Bulk Upload page in Pacman, from the `ItemsImportTemplate.csv`.
   1. Pacman will perform validation on these items - you may need to fix any errors in the data.
4. In the database, update Items to set the `MerlinCodeId` column with the corresponding value from Merlin, and set the `HasHadMerlinCreationRequestCreated` column to be True for all items (this ensures that Pacman does not attempt to create the items in Merlin).
   1. This requires taking the `ItemMerlinCodeIdsTemplate.csv` data, and mapping it to SQL update statements. This can be done by using the following formula in Excel to do the mapping, and then manually running the SQL queries: `="INSERT INTO ItemMerlinInstance (GroupId, ItemId, MerlinCodeId) VALUES (GROUP_ID, (SELECT Id FROM Items WHERE Code = '"&A2&"'), "&B2&"); UPDATE Items SET HasHadMerlinCreationRequestCreated = 1 WHERE Code ='"&A2&"'; "&IF(MOD(ROW(),500)=0, CHAR(10) & "GO", "")`. This will take several minutes to complete.
   2. As this is a manual step, we should manually validate the data is consistent after this step. Run the following query to identify items which have not been updated by this process: `SELECT Id, Code from Items where Id NOT IN (SELECT ItemId FROM ItemMerlinInstance WHERE GroupID = GROUP_ID);`. This query should not return any rows.
5. Manually insert ItemSupplierProducts into the database. This should be done using the data from the `SupplierProductsTemplate.csv` file
   1. Note that each Item should have exactly one ItemSupplierProduct (or no supplier products at all). 
   2. Note that Stock Items will only be sent to Merlin by Pacman if the item has a supplier product.
   3. To validate that the all rows in the spreadsheet data match a valid combination of Item, Supplier and Supplier Code from the previous data exports, do the following:
      1. Create a temporary table to hold data: `CREATE TABLE #MissingItems(SupplierName NVARCHAR(100), ItemCode NVARCHAR(100), SupplierCode NVARCHAR(100));`
      2. Use the following Excel formula to generate SQL queries that will insert missing rows into this table: `="INSERT INTO #MissingItems (SupplierName, ItemCode, " & "SupplierCode) SELECT '" & A2 & "', '" & C2 & "', '" & B2 & "' WHERE NOT EXISTS (SELECT i.Id, sp.Id FROM Items i, Suppliers s LEFT JOIN SupplierLists SL on s.Id = SL.SupplierId LEFT JOIN SupplierProducts SP " & " ON SL.Id = SP.SupplierListId LEFT JOIN PmsSuppliers PS on s.PmsSupplierId = PS.Id WHERE i.Code = '" & C2 & "'AND PS.Name = '" & A2 & "' AND SP.Code = '" & B2 & "');" &IF(MOD(ROW(),500)=0, CHAR(10) & "GO", "")`
      3. Run the generated queries.
      4. Run `SELECT * FROM #MissingItems`. This should not return any records - if so, these should be investigated and corrected before proceeding.
   4. To map from the spreadsheet data to SQL queries, the following Excel formula can be used: `="INSERT INTO ItemSupplierProducts (ItemId, SupplierProductId," & "IsPrimary, LastModifiedByUserId) SELECT TOP 1 i.Id, sp.Id, " & IF(D2="YES", 1, 0) & ", NULL FROM Items i, Suppliers s LEFT JOIN SupplierLists SL on s.Id = SL.SupplierId LEFT JOIN SupplierProducts SP " & " ON SL.Id = SP.SupplierListId LEFT JOIN PmsSuppliers PS on s.PmsSupplierId = PS.Id WHERE i.Code = '" & C2 & "'AND PS.Name = '" & A2 & "' AND SP.Code = '" & B2 & "';" &IF(MOD(ROW(),500)=0, CHAR(10) & "GO", "")`.
   5. To determine which Stock items have not had any supplier products created, run the following. It's valid for items to not have any supplier products, but note that these items will not be sent to Merlin until supplier products are created.
      ```sql
      SELECT I.Code FROM Items i
      WHERE i.Type in ('Stock')
      AND NOT EXISTS (SELECT * FROM ItemSupplierProducts WHERE ItemId = i.Id)
      ```
    6. To validate that there are no items with mutliple supplier products, run the following. This should not return any rows - this will cause errors in Pacman if so, and should be manually corrected to ensure only one primary supplier product exists.
        ```sql
        select I.Code from ItemSupplierProducts
        JOIN Items I on ItemSupplierProducts.ItemId = I.Id
        Where IsPrimary = 1
        GROUP BY ItemId, I.Code
        HAVING COUNT(*) > 1;
        ```
   7. To validate that there are no items with a supplier product, but with no primary supplier product, run the following. this should not return any rows, and if so, should be manually corrected by assigning each item a primary supplier product.
        ```sql
        select I.Code, COUNT(*) from Items I
        WHERE NOT EXISTS (SELECT * FROM ItemSupplierProducts WHERE ItemId = i.Id AND IsPrimary = 1)
        AND EXISTS (SELECT * FROM ItemSupplierProducts WHERE ItemId = i.Id AND IsPrimary = 0)
        GROUP BY i.Code;
        ```

### Subsequent Merlin Instances

For subsequent Merlin instances, follow these steps:

1. Note down the Group ID of the particular instance of Merlin that is being integrated, it will be needed later
2. Perform an item export from the Merlin instance, but DO NOT bulk upload it; all that is needed is to link existing items to the new instance
3. In the database, update Items to set the `MerlinCodeId` column with the corresponding value from Merlin, and set the `HasHadMerlinCreationRequestCreated` column to be True for all items (this ensures that Pacman does not attempt to create the items in Merlin).
   1. This requires taking the `ItemMerlinCodeIdsTemplate.csv` data, and mapping it to SQL update statements. This can be done by using the following formula in Excel to do the mapping, and then manually running the SQL queries: `="INSERT INTO ItemMerlinInstance (GroupId, ItemId, MerlinCodeId) VALUES (GROUP_ID, (SELECT Id FROM Items WHERE Code = '"&A2&"'), "&B2&"); UPDATE Items SET HasHadMerlinCreationRequestCreated = 1 WHERE Code ='"&A2&"'; "&IF(MOD(ROW(),500)=0, CHAR(10) & "GO", "")`. This will take several minutes to complete.
   2. As this is a manual step, we should manually validate the data is consistent after this step. Run the following query to identify items which have not been updated by this process: `SELECT Id, Code from Items where Id NOT IN (SELECT ItemId FROM ItemMerlinInstance WHERE GroupID = GROUP_ID);`. This query should not return any rows.
4. If there are additional supplier products to add, it is recommended to use the main UI to import new supplier products using the template in [DataMigrationTemplates/SupplierProductsTemplate.csv](./DataMigrationTemplates/SupplierProductsTemplate.csv)

### After all Merlin Instances Have Been Added

There is just one step remaining:

1. Re-enable Merlin data sending through the app configuration.

At this point, items will all exist in Pacman. Items can now be updated in Pacman, and changes will be pushed through to Merlin.

Pacman can now be used for all central item configuration.

## Site data migration instructions
The following steps should be followed whenever onboarding a new site into Pacman. Note that sites will first be created in draft - in this case, no data will be sent to Merlin. Once the deviations have been set up in Pacman, the site can be made live within Pacman, which will cause deviations to be sent to Merlin.


1. If onboarding a site new to IVC, create the Site in Merlin. If onboarding an existing site, this will already exist in Merlin.
2. Create the Site in the sites administration page in Pacman.
  1. The PMS should be set to Merlin, and the PMS Site Reference ID set with the correct site in Pacman. If the correct site does not show in this dropdown, ensure the site has been created in Merlin.
  2. The site will be created in a Draft state. In this state, deviations will not be sent to Merlin.
3. Create site-specific deviations in Pacman as required. For existing sites, this data can be bulk uploaded through the bulk upload tool. Note this will require providing an export of deviations from Merlin for each site, in the format required by Pacman deviations spreadsheet upload. See the [DataMigrationTemplates/DeviationsImportTemplate.csv](./DataMigrationTemplates/DeviationsImportTemplate.csv)
4. On the edit site page in Pacman, click the "Go Live" button. This will update the site status, and export all deviations to Merlin.
5. Create users for the site
  3. Each user will need to be first created in IVC's AD by the infrastructure team
  4. Users can then be added to Pacman through the Pacman user administration page. A Site User Admin user can be created, who can then create users for their own site themselves.
	
		
	
	


