const container = document.getElementById("container");

const TEST_DATA =  [
    {
      type: "folder",
      name: "Files",
      children: [
        {
          type: "folder",
          name: "Systems",
        },
        {
          type: "folder",
          name: "Music",
        },
      ],
    },
    {
      type: "folder",
      name: "Downloads",
      children: [
        {
          type: "folder",
          name: "Docs",
        },
        {
          type: "folder",
          name: "Pictures",
        },
      ],
    },
    {
      type: "folder",
      name: "Documents",
      children: [
        {
          type: "folder",
          name: "Projects",
        },
        {
          type: "folder",
          name: "Movies",
        },
      ],
    },
  ];

const expandedSet = new Set();
let folderTree;

const onToggle = function(name) {
  if (expandedSet.has(name)) {
    // collapse
    expandedSet.delete(name);
  } else {
    expandedSet.add(name);
  }
  folderTree.toggle(name);
};
let selectedFolder = null;
const onSelect = function(name) {
  selectedFolder = name;
  //folderTree.select();
}

const config = {
  container: container,
  expandedSet: expandedSet,
  onToggle: onToggle,
  onSelect: onSelect,
  selectedFolder: selectedFolder,
  data: TEST_DATA
};
folderTree = new FolderTree(config);
folderTree.init();
folderTree.render();

addEventListener("beforeunload", (event) => {
  folderTree.unload();
});