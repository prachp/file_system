const treeContainer = document.getElementById("tree");

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
  expandedSet.add(name);
  folderTree.select(name);
}

const config = {
  container: treeContainer,
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

/// List ///
const listContainer = document.getElementById('list');
const listConfig = {
  container: listContainer,
  nodes: TEST_DATA,
  onSelect: (name) => {console.log(name);}
};

const list = new FileList(listConfig);
list.init();
list.render();