# Bulk Upload / Creation of an item in PacMan

There are many ways to create an Item in PacMan, one of them is to create a CSV file with the details and upload it via the PacMan Web Front End (WFE).

The following are the sets of rules for uploading a new item via the Bulk Upload process.


## Bulk upload an import Spreadsheet with Supplier updates

> *PP-275 changed the way the items are processed when changing the Local Price value.*
> This is now allowed and it just overwrites the Central Price and recalculates the deviations that are sent to Merlin

### **When a user downloads items to edit as part of a bulk edit upload, they can amend the supplier information.**

If the user keeps the same Supplier and Supplier Code but updates the Cost/Pack, PACMan should update the price on PACMan, send to Merlin and update the existing supplier list table which therefore updates the download supplier list.

User wants to assign a different supplier product that already exists on a supplier list table:

>	User enters the same Cost/Pack as the one that exists on the supplier list table OR leaves it blank, and PACMan assigns the product to the item.
>
>	User enters a different Cost/Pack as the one that exists on the supplier list table – PACMan updates the price in PACMan and Merlin and update the supplier
>	list table and subsequent supplier list download.

User wants to update the cost/pack for a manual supplier product that already exists on a supplier list table:

>	User enters a different Cost/Pack as the one that exists on the supplier list table – PACMan updates the price in PACMan and Merlin and update the 
>   supplier list table and subsequent supplier list download.

User wants to assign a different supplier product that does not exist on a supplier list table:

>	User has not entered a Cost/Pack – Pacman errors with ‘you must supply a cost/pack for manual supplier products’
>
>	User enters Supplier, Supplier Code and Cost/Pack – PACMan update the item, updates Merlin and adds the manual supplier product to the supplier list table 
>   and therefore the download supplier list table.


## Bulk Upload Deviation Rules


When you want to bulk edit items in PACMan, you can export and import an Excel Spreadsheet with all the required changes. 
When you change the local price for an Item, the application must work out the correct deviation (if any) to send to each of the Merlins.

The rules that are enforced by PACMan for Deviations and Central Price changes are

**If you change a price - Bulk Edit upload**

<dl>
  <dt>No deviations</dt>
  <dd>Nothing to do as the item price is just updated</dd>
</dl>

**Item has a Deviation**

<dl>
	<dt>Local</dt>
	<dd>The deviation is worked out based on the local price, we need to calculate the percantage needed to keep the items local price (based on the new central price) and send that as a deviation to merlin - the percentage to add to the central price.</dd>
</dl>

<dl>
	<dt>Percentage</dt>
	<dd>the deviation is worked out as a %'age of the price, Merlin will recalculate this value, nothing is sent deviation wise to Merlin</dd>
</dl>

**Item has a TX Deviation**

<dl>
	<dt>But no item Deviation override</dt>
	<dd>the deviation is worked out as a %'age of the price, Merlin will recalculate this value, nothing is sent deviation wise to  Merlin</dd>
</dl>


**With a deviation**

<dl>
	<dt>Percentage (With override)</dt>
	<dd>the deviation is worked out as a %'age of the price, Merlin will recalculate this value, nothing is sent deviation wise to Merlin</dd>
</dl>

<dl>
	<dt>Local (With override)</dt>
	<dd>The deviation is worked out based on the local price, we need to calculate the percantage needed to keep the items local price (based on the new central price) and send that as a deviation to merlin - the percentage to add to the central </dd>
</dl>

# Note:

- IsOnCurrentSupplierList = true is for codes provided by a Supplier List
- IsOnCurrentSupplierList = false if for codes manually created