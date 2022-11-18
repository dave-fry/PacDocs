import { defaultTheme } from "@vuepress/theme-default";
import { searchPlugin } from "@vuepress/plugin-search";

//https://v2.vuepress.vuejs.org/reference/plugin/search.html#issearchable

export default {
  title: "PACDoc",
  description: "PACMan documentation",
  theme: defaultTheme({
    // If you set it in the form of `organization/repository`
    // we will take it as a GitHub repo
    // You can also set it to a URL directly
    //repo: "https://gitlab.com/foo/bar",
    // default theme config
    navbar: [
      {
        text: "Home",
        link: "/",
      },
    ],
    sidebar: [
      // SidebarItem
      {
        text: "Overview",
        children: [
          {
            text: "Authentication",
            link: "/Overview/Authentication.md/",
          },
          {
            text: "Azure Environment",
            link: "/Overview/AzureEnvironment.md/",
          },
          {
            text: "Builds And Deployments",
            link: "/Overview/BuildsAndDeployments.md/",
          },
          { text: "Database Scripts", link: "/Overview/DatabaseScripts.md/" },
          {
            text: "Data Migration",
            link: "/Overview/DataMigration.md/",
          },
          {
            text: "Merlin",
            link: "/Overview/Merlin.md/",
          },
          {
            text: "Monitoring",
            link: "/Overview/Monitoring.md/",
          },
          {
            text: "Rider",
            link: "/Overview/Rider.md/",
          },
          {
            text: "PMS",
            link: "/Overview/PMS.md/",
          },
        ],
      },
      {
        text: "Pacman Items",
        children: [
          {
            text: "Bulk Upload",
            link: "/Items/BulkUpload.md/",
          },
          {
            text: "Adding a New Field to Pacman",
            link: "/Items/Adding a New Field to Pacman.md/",
          },
        ],
      },
      {
        text: "Pacman Suppliers",
        children: [
          {
            text: "Suppliers",
            link: "/Suppliers/Suppliers.md/",
          },
        ],
      },
      {
        text: "Organisations",
        children: [
          {
            text: "Organisations",
            link: "/Organisations/New Organisations.md/",
          },
        ],
      },      
    //   {
    //     text: "Notes",
    //     children: [
    //       {
    //         text: "Authentication",
    //         link: "/Overview/Authentication.md/",
    //       },
    //     ],
    //   },
      {
        text: "Miscellaneous",
        children: [
          {
            text: "DomainEvents",
            link: "/Miscellaneous/DomainEvents.md/",
          },
          {
            text: "Tutorials",
            link: "/Miscellaneous/Tutorials.md/",
          },
        ],
      },
    ],
  }),
  plugins: [
    // https://v2.vuepress.vuejs.org/reference/plugin/search.html#search
    searchPlugin({
      // getExtraFields: (page) => page.frontmatter.tags,
      maxSuggestions: 15,
      isSearchable: (page) => true,
      hotKeys: ["s", "/"],
      locales: {
        "/": {
          placeholder: "Search",
        },
      },
    }),
  ],
};
