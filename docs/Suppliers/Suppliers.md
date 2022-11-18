# Suppliers

## Supplier Upload

The supplier upload is the mechanism in which you apply codes to the relevant supplier. This process will create a Supplier List that defines all of the items in the import file. When approved you will then provide a complete list of active products for the supplier to PACMan.

When uploading and approving a new file you will update any existing itms and create the new ones, the IsOnCurrentSupplier and CreatedBySupplierList will be set accordingly.

> CreatedBySupplierList = true
>
> IsOnCurrentSupplier = true

**Note: when you create an item and link it to a suppluier product and you do not use a product code in the current list you will be creating a new 'Manual Item'. This will be added to the suppier products table and be on the current supplier list, but it will be:

> CreatedBySupplierList = false
>
> IsOnCurrentSupplier = true

## Suppler ERD

![Supplier ERD](/images/SupplierLists.jpg)


&nbsp;

**ItemSupplierProducts**

This is a hangover from 'Provet' where we could assign multiple products to an Item. In PACMan this is a one to one.

**SupplierProducts**

This should be linked to Items.

## Upload Rules

> PP-445 The rules were re-addressed

### **Expected behaviour**

When a user creates a new item (either via single item create OR bulk item create), they can choose to select a supplier product that is available from a previously uploaded supplier OR enter a manual supplier product. When entering a manual supplier product, PACMan will error if that supplier code is already in use on another item.

Once the item has been created with a manual supplier product, that manual supplier product is added to the existing supplier list table and sent to Merlin. When the user then downloads the supplier list, it will contain the last approved supplier list + any manually created supplier products.

If the user wants to update the manual supplier product, they can either amend the price as part of a supplier list upload,. OR they can edit the item (either via single item edit OR bulk edit upload) and edit the cost/pack for the manual item. This will then update Merlin and the existing supplier list table and subsequent supplier list download.