# Manual Migration Database scripts

The scripts listed here are intended to perform rarely performed or large scale actions that take too long through the UI.

The scripts are located in `/Scripts/Database/Manual Data Migration`.

## The Scripts

Quick note: All of these directly act on the database and will bypass any business logic written in code. Changes will
not get propogated to any PMSes (in all likelihood).

- `AddUsers.sql` - Bulk add users to Pacman.
- `DeleteDeviations.sql` - Wipe all deviations (including treatment type) from a collection of sites
- `DeleteItem.sql` - Delete an Item and all things linked to it, including deviations.
- `DeleteSite.sql` - Delete a site and all things linked to it
- `LinkSupplierProducts.sql` - Used when there's been issues applying supplier products to items. Mostly obseleted by newer versions of Pacman

## Specialised Scripts

### User Management

Located in the `User Management` folder.

- `AddPracticeGroupUserstoSitesforPracticeGroup.sql` - Script used to give all users in a specified practice group explicit access to the sites in the practice group. This was to work around a limitation where most user rights are evaluated in a site-specific manner
- `GiveAllUsersSiteVisibilityAdmin.sql` - Gives all non-superusers the site visibility admin role. This is because it's not assignable by non-superusers and was resulting in a lot of helpdesk requests

### New Sites

Located in the `New Site` folder.

- `HideAllItemsForSite.sql` - Adds a deviation for each Item in Pacman to hide it for the specified site. When a new site is created in Merlin, all items in Merlin are set to hidden for that site so the site can unhide the items it wants to offer. This script mirrors that behaviour, but in Pacman, to keep the 2 in sync

### Deviations

Located in the `Deviations` folder.

- `ApplyCodeSpecificFlagToItemDeviations.sql` - Applies the code-specific flag to price deviations, to work around a limitation in the way Pacman handles deviations
