import{_ as e,o as n,c as i,a as t}from"./app.4217e908.js";const a={},o=t(`<h1 id="organisations" tabindex="-1"><a class="header-anchor" href="#organisations" aria-hidden="true">#</a> Organisations</h1><p>Organisations are a table driven entity.</p><p>All organisations in the AppSettings:AzureAd:Tenants section are displayed on the login screen. Select one to authenticate based on the settings in AppSettings.</p><p>A User has one organisation, this organisation links to a set of Merlins in AppSettings:Merlin via the MerlinConnectionName. The Pacman API will decode the users organisation name and grab the Merlin groups and iterate a CRUD action against all Merlins specified.</p><p>Application flow for queries:</p><div class="language-text line-numbers-mode" data-ext="text"><pre class="language-text"><code>CQRS -&gt; Handler

	UserService -&gt; 
		UserId = Get the user ID from the Auth Principle
		GetCurrentUserOrganisationGroupId(UserID)
			Lookup OrganisationID from the Database


	Query Context using filter and OrgID from DB.,
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h1 id="api" tabindex="-1"><a class="header-anchor" href="#api" aria-hidden="true">#</a> API</h1><p>The api will use the Merlin Connection Service / MerlinApiFactory (MerlinApiFactory.CreateApi) to determin the API to call, this gets the connection details.</p><p>The organisationID connects the OrganisationGroups table to the Merlin Connection in the AppSettings:Merlin section. The Appsettings section defines the:</p><blockquote><p>API Merlin Groups Keys</p></blockquote><p>To use.</p><p>The ConfigurationMerlinConnectionDetailsProvider object is populated via the Options Pattern - Loads a collection from the AppSettings:Merlin:Connections.</p><p>MerlinConnectionService.GetConnectionDetails(orgId) will return the Merlin Connection (inluding the groups) to use.</p><h1 id="creating-a-new-organisation" tabindex="-1"><a class="header-anchor" href="#creating-a-new-organisation" aria-hidden="true">#</a> Creating a new Organisation</h1><p>Add an entry in the Appsettings AzureAD section</p><blockquote><p>Copy the UK, give a new name</p></blockquote><p>Add an entry in the Appsettings Merlin section, add a connection referencing the correct set of Merlins to use. The NAME is the name used in the UI - this ties the two entites together.</p><p>Use the Pacman UI to create an entry in the OrganisationGroups Table</p><blockquote><p>Azure AD tenant name This tenant name must match one of the names in the &#39;AzureAd.Tenants&#39; section of the application configuration (appsettings.json).</p><p>Merlin connection name This connection name must match one of the names in the &#39;Merlin.Connections&#39; section of the application configuration (appsettings.json).</p></blockquote><p>Pacman looks up the organisation in the table, returning the merlinConnectionName. This ConnectionName is used to lookup the groups in the AppSettings.</p><div class="language-text line-numbers-mode" data-ext="text"><pre class="language-text"><code>&quot;Merlin&quot;: {
    &quot;IsSendingDataDisabled&quot;: false,
    &quot;ApiKey&quot;: null,
    &quot;Connections&quot;: [
      {
        &quot;Name&quot;: &quot;UK&quot;,
        &quot;Url&quot;: &quot;https://dev-api.vetspace.cloud&quot;,
        &quot;ApiAccountId&quot;: &quot;6F094383-68D4-46E9-B841-6AC57340CDFE&quot;,
        &quot;ApiKeyKeyVaultName&quot;: &quot;MerlinUkApiKey&quot;,
        &quot;GroupIds&quot;: [ 25, 40 ]
      }
    ]
  }
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div>`,21),s=[o];function r(l,c){return n(),i("div",null,s)}const u=e(a,[["render",r],["__file","New Organisations.html.vue"]]);export{u as default};
