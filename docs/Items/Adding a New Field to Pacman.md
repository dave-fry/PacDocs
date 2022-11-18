# Adding a New Field to Pacman

Check the database to see if the field exists, if the field does not then you will need to alter all of the objects in the application and SQL will reference the field.

The example below follows the most logical flow I.E. an update to the Item table. At a glance you will be changing:

- SQL
- Item objects and Entities
- Upload and Bulk Edits models
- API, Unit and Integration tests


## SQL Updates

Generate a script to migrate the change. The Scripts are located in the Migrations Solution.

Note: Pacman is mimicking a EF Code First solution but using third party tools to make the migrations and alternative tools to execute the strategies. To apply the migrations the solution uses [DBUp.Npm](https://dbup.readthedocs.io/en/latest/). This is executed via Nuke, the migration scripts are located in the Migrations library.

```
	Migrations/Scripts/Migrations/...

	The naming convention needs to be solidified here.

		Originally: MYYYYMMDDHHMM

		Changed to : Script-XX-[Summary]
```
*Be aware that method of migrations does not appear to be keeping the Entities in line with the Schema. Reverse engineering the application to Code First shows a much more complete and comprehensive ERD / Model.*

*The schema naming convention needs to be revised - Lack of documentation meant the naming convention had to be guessed and as a result left the application with randomly ordered scripts.*


The script created is SQL DDL and will be run when the application is next built / compiled.


## Alter / Create any Api Tests

```
	For an Item update, we can alter the builders in:

		Ivc.Pacman.TestHelpers.Feature.Items
			CreateItemCommandBuilder
			EditItemCommandBuilder
```

## Alter / Create any Test Helper - Test Data classes

```
	Ivc.Pacman.TestHelpers.Feature.Items
		UploadItemsCommandBuilder
		ItemAssertions
			AssertEquivalent - this is a general assertion for all item values add any additional tests for the new fields here.
	
	Ivc.Pacman.TestHelpers.Model
		ItemBuilder
		ItemBulkEditLineBuilder

	Ivc.Pacman.TestData.Data
		TestItems	
```

## Alter / Create any Integration Tests
## Alter / Create any Unit Tests

ItemAttributesTests


## Alter the Pacman application
For an Item update, we can alter the builders in:

```		
 		Ivc.Pacman.Web.Model
 			Item

 		Ivc.Pacman.Web.Model.Items
 			ItemBulkEditLine

		Ivc.Pacman.Web.Features.Items.Upload
			ParsedItemBulkEditLine
			UploadItems
				ItemImportColumns
			UploadItemBulkEdit
				ItemBulkEditImportColumns

		Ivc.Pacman.Web.Features.Items
			CreateEditItemBase
			CreateItem
			EditItem

			BaseItemResponse
			ItemResponse
			ViewOnlyItemResponse

			ItemCsvHeaders
			GetItemsDownload

				Add Fields to Map for Download (if required)

		Ivc.Pacman.Web.Features.Items.BulkEdit
			ItemBulkEditResponse

		Ivc.Pacman.Web.Infrastructure.Pms.Merlin.Api.Items
			MerlinStockCodeCommandBase (This is the DTO that maps the fields to the object that will pass the data to the Merlins)
```

# React Front End Updates

## Form fields
Add the new fields to \feature\items\item.ts : BaseItemResponse, CreateEditItemBaseCommand, CreateOrEditItemFormModel, FilteredItem
Add any new validation into PrincipalEditableItemFieldsValidator or CreateOrEditItemFormModelValidator


Add fields for view only to feature\items\ViewItem.tsx

Add fields for editing to the item form feature\items\ItemForm.tsx
	
## Translations

Ensure that you update the relevant file(s) in **'/Web/ClientApp/Public/Locales/en-GB'** with any new names, validation messeges etc.

*serverValidation.json - this is used for most of the Item updates*

E.g.

```json
  "item": {
    "netNetDiscount": {
      "negative": "Net Net Override value must be greater or equal to zero",
      "tooBig": "Net Net Override value can not be greater than 100"
    },
    "netNetNetDiscount": {
      "negative": "Net Net Net Override value must be greater or equal to zero",
      "tooBig": "Net Net Net Override value can not be greater than 100"
    },
    ...
```

Run:
```json 
yarn createMockTranslations
```
To create the complete translation mocks for testing etc.


#### items.json
Updates / additions for Item specific updates


## Item / Code Updates
TBD

## Bulk Edit Upload View Updates

```
/Web/ClientApp/src/feature/items/itemsTable


	ViewItemBulkEdit.tsx
		What you see in the form view; add any items to the 'Other Changes' section. OtherChangeFields translations 
		for the BulkEditUploads are found in 'item.json' (see Translations)

	ItemBulkEdit.ts
		ItemBulkEditLineResponse

	ItemBulkEdit.testdata.ts
		The API model data and values returned from .Net
```