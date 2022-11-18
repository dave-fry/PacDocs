import{_ as s,r as i,o as d,c as l,b as t,d as e,e as r,a}from"./app.4217e908.js";const o={},c=a('<h1 id="adding-a-new-field-to-pacman" tabindex="-1"><a class="header-anchor" href="#adding-a-new-field-to-pacman" aria-hidden="true">#</a> Adding a New Field to Pacman</h1><p>Check the database to see if the field exists, if the field does not then you will need to alter all of the objects in the application and SQL will reference the field.</p><p>The example below follows the most logical flow I.E. an update to the Item table. At a glance you will be changing:</p><ul><li>SQL</li><li>Item objects and Entities</li><li>Upload and Bulk Edits models</li><li>API, Unit and Integration tests</li></ul><h2 id="sql-updates" tabindex="-1"><a class="header-anchor" href="#sql-updates" aria-hidden="true">#</a> SQL Updates</h2><p>Generate a script to migrate the change. The Scripts are located in the Migrations Solution.</p>',6),u={href:"https://dbup.readthedocs.io/en/latest/",target:"_blank",rel:"noopener noreferrer"},m=a(`<div class="language-text line-numbers-mode" data-ext="text"><pre class="language-text"><code>	Migrations/Scripts/Migrations/...

	The naming convention needs to be solidified here.

		Originally: MYYYYMMDDHHMM

		Changed to : Script-XX-[Summary]
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p><em>Be aware that method of migrations does not appear to be keeping the Entities in line with the Schema. Reverse engineering the application to Code First shows a much more complete and comprehensive ERD / Model.</em></p><p><em>The schema naming convention needs to be revised - Lack of documentation meant the naming convention had to be guessed and as a result left the application with randomly ordered scripts.</em></p><p>The script created is SQL DDL and will be run when the application is next built / compiled.</p><h2 id="alter-create-any-api-tests" tabindex="-1"><a class="header-anchor" href="#alter-create-any-api-tests" aria-hidden="true">#</a> Alter / Create any Api Tests</h2><div class="language-text line-numbers-mode" data-ext="text"><pre class="language-text"><code>	For an Item update, we can alter the builders in:

		Ivc.Pacman.TestHelpers.Feature.Items
			CreateItemCommandBuilder
			EditItemCommandBuilder
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h2 id="alter-create-any-test-helper-test-data-classes" tabindex="-1"><a class="header-anchor" href="#alter-create-any-test-helper-test-data-classes" aria-hidden="true">#</a> Alter / Create any Test Helper - Test Data classes</h2><div class="language-text line-numbers-mode" data-ext="text"><pre class="language-text"><code>	Ivc.Pacman.TestHelpers.Feature.Items
		UploadItemsCommandBuilder
		ItemAssertions
			AssertEquivalent - this is a general assertion for all item values add any additional tests for the new fields here.
	
	Ivc.Pacman.TestHelpers.Model
		ItemBuilder
		ItemBulkEditLineBuilder

	Ivc.Pacman.TestData.Data
		TestItems	
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h2 id="alter-create-any-integration-tests" tabindex="-1"><a class="header-anchor" href="#alter-create-any-integration-tests" aria-hidden="true">#</a> Alter / Create any Integration Tests</h2><h2 id="alter-create-any-unit-tests" tabindex="-1"><a class="header-anchor" href="#alter-create-any-unit-tests" aria-hidden="true">#</a> Alter / Create any Unit Tests</h2><p>ItemAttributesTests</p><h2 id="alter-the-pacman-application" tabindex="-1"><a class="header-anchor" href="#alter-the-pacman-application" aria-hidden="true">#</a> Alter the Pacman application</h2><p>For an Item update, we can alter the builders in:</p><div class="language-text line-numbers-mode" data-ext="text"><pre class="language-text"><code> 		Ivc.Pacman.Web.Model
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
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h1 id="react-front-end-updates" tabindex="-1"><a class="header-anchor" href="#react-front-end-updates" aria-hidden="true">#</a> React Front End Updates</h1><h2 id="form-fields" tabindex="-1"><a class="header-anchor" href="#form-fields" aria-hidden="true">#</a> Form fields</h2><p>Add the new fields to \\feature\\items\\item.ts : BaseItemResponse, CreateEditItemBaseCommand, CreateOrEditItemFormModel, FilteredItem Add any new validation into PrincipalEditableItemFieldsValidator or CreateOrEditItemFormModelValidator</p><p>Add fields for view only to feature\\items\\ViewItem.tsx</p><p>Add fields for editing to the item form feature\\items\\ItemForm.tsx</p><h2 id="translations" tabindex="-1"><a class="header-anchor" href="#translations" aria-hidden="true">#</a> Translations</h2><p>Ensure that you update the relevant file(s) in <strong>&#39;/Web/ClientApp/Public/Locales/en-GB&#39;</strong> with any new names, validation messeges etc.</p><p><em>serverValidation.json - this is used for most of the Item updates</em></p><p>E.g.</p><div class="language-json line-numbers-mode" data-ext="json"><pre class="language-json"><code>  <span class="token property">&quot;item&quot;</span><span class="token operator">:</span> <span class="token punctuation">{</span>
    <span class="token property">&quot;netNetDiscount&quot;</span><span class="token operator">:</span> <span class="token punctuation">{</span>
      <span class="token property">&quot;negative&quot;</span><span class="token operator">:</span> <span class="token string">&quot;Net Net Override value must be greater or equal to zero&quot;</span><span class="token punctuation">,</span>
      <span class="token property">&quot;tooBig&quot;</span><span class="token operator">:</span> <span class="token string">&quot;Net Net Override value can not be greater than 100&quot;</span>
    <span class="token punctuation">}</span><span class="token punctuation">,</span>
    <span class="token property">&quot;netNetNetDiscount&quot;</span><span class="token operator">:</span> <span class="token punctuation">{</span>
      <span class="token property">&quot;negative&quot;</span><span class="token operator">:</span> <span class="token string">&quot;Net Net Net Override value must be greater or equal to zero&quot;</span><span class="token punctuation">,</span>
      <span class="token property">&quot;tooBig&quot;</span><span class="token operator">:</span> <span class="token string">&quot;Net Net Net Override value can not be greater than 100&quot;</span>
    <span class="token punctuation">}</span><span class="token punctuation">,</span>
    ...
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>Run:</p><div class="language-json line-numbers-mode" data-ext="json"><pre class="language-json"><code>yarn createMockTranslations
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div></div></div><p>To create the complete translation mocks for testing etc.</p><h4 id="items-json" tabindex="-1"><a class="header-anchor" href="#items-json" aria-hidden="true">#</a> items.json</h4><p>Updates / additions for Item specific updates</p><h2 id="item-code-updates" tabindex="-1"><a class="header-anchor" href="#item-code-updates" aria-hidden="true">#</a> Item / Code Updates</h2><p>TBD</p><h2 id="bulk-edit-upload-view-updates" tabindex="-1"><a class="header-anchor" href="#bulk-edit-upload-view-updates" aria-hidden="true">#</a> Bulk Edit Upload View Updates</h2><div class="language-text line-numbers-mode" data-ext="text"><pre class="language-text"><code>/Web/ClientApp/src/feature/items/itemsTable


	ViewItemBulkEdit.tsx
		What you see in the form view; add any items to the &#39;Other Changes&#39; section. OtherChangeFields translations 
		for the BulkEditUploads are found in &#39;item.json&#39; (see Translations)

	ItemBulkEdit.ts
		ItemBulkEditLineResponse

	ItemBulkEdit.testdata.ts
		The API model data and values returned from .Net
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div>`,33);function p(v,h){const n=i("ExternalLinkIcon");return d(),l("div",null,[c,t("p",null,[e("Note: Pacman is mimicking a EF Code First solution but using third party tools to make the migrations and alternative tools to execute the strategies. To apply the migrations the solution uses "),t("a",u,[e("DBUp.Npm"),r(n)]),e(". This is executed via Nuke, the migration scripts are located in the Migrations library.")]),m])}const g=s(o,[["render",p],["__file","Adding a New Field to Pacman.html.vue"]]);export{g as default};
