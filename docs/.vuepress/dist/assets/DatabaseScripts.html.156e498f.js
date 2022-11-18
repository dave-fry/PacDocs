import{_ as e,o as i,c as t,a}from"./app.4217e908.js";const s={},o=a('<h1 id="manual-migration-database-scripts" tabindex="-1"><a class="header-anchor" href="#manual-migration-database-scripts" aria-hidden="true">#</a> Manual Migration Database scripts</h1><p>The scripts listed here are intended to perform rarely performed or large scale actions that take too long through the UI.</p><p>The scripts are located in <code>/Scripts/Database/Manual Data Migration</code>.</p><h2 id="the-scripts" tabindex="-1"><a class="header-anchor" href="#the-scripts" aria-hidden="true">#</a> The Scripts</h2><p>Quick note: All of these directly act on the database and will bypass any business logic written in code. Changes will not get propogated to any PMSes (in all likelihood).</p><ul><li><code>AddUsers.sql</code> - Bulk add users to Pacman.</li><li><code>DeleteDeviations.sql</code> - Wipe all deviations (including treatment type) from a collection of sites</li><li><code>DeleteItem.sql</code> - Delete an Item and all things linked to it, including deviations.</li><li><code>DeleteSite.sql</code> - Delete a site and all things linked to it</li><li><code>LinkSupplierProducts.sql</code> - Used when there&#39;s been issues applying supplier products to items. Mostly obseleted by newer versions of Pacman</li></ul><h2 id="specialised-scripts" tabindex="-1"><a class="header-anchor" href="#specialised-scripts" aria-hidden="true">#</a> Specialised Scripts</h2><h3 id="user-management" tabindex="-1"><a class="header-anchor" href="#user-management" aria-hidden="true">#</a> User Management</h3><p>Located in the <code>User Management</code> folder.</p><ul><li><code>AddPracticeGroupUserstoSitesforPracticeGroup.sql</code> - Script used to give all users in a specified practice group explicit access to the sites in the practice group. This was to work around a limitation where most user rights are evaluated in a site-specific manner</li><li><code>GiveAllUsersSiteVisibilityAdmin.sql</code> - Gives all non-superusers the site visibility admin role. This is because it&#39;s not assignable by non-superusers and was resulting in a lot of helpdesk requests</li></ul><h3 id="new-sites" tabindex="-1"><a class="header-anchor" href="#new-sites" aria-hidden="true">#</a> New Sites</h3><p>Located in the <code>New Site</code> folder.</p><ul><li><code>HideAllItemsForSite.sql</code> - Adds a deviation for each Item in Pacman to hide it for the specified site. When a new site is created in Merlin, all items in Merlin are set to hidden for that site so the site can unhide the items it wants to offer. This script mirrors that behaviour, but in Pacman, to keep the 2 in sync</li></ul><h3 id="deviations" tabindex="-1"><a class="header-anchor" href="#deviations" aria-hidden="true">#</a> Deviations</h3><p>Located in the <code>Deviations</code> folder.</p><ul><li><code>ApplyCodeSpecificFlagToItemDeviations.sql</code> - Applies the code-specific flag to price deviations, to work around a limitation in the way Pacman handles deviations</li></ul>',16),n=[o];function r(d,l){return i(),t("div",null,n)}const h=e(s,[["render",r],["__file","DatabaseScripts.html.vue"]]);export{h as default};