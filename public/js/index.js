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
        children: [
          {
            type: 'file',
            name: 'Taylor Swift - Style',
            modified: new Date(),
            size: 1500000
          },
          {
            type: 'file',
            name: 'NSYNC - Bye Bye Bye',
            modified: new Date(),
            size: 1400000
          }
        ]
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
        children: [
          {
            type: 'file',
            name: 'Cribl test',
            modified: new Date(),
            size: 900
          },
          {
            type: 'file',
            name: 'Diem',
            modified: new Date(),
            size: 200
          }
        ]
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
let list;

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
const onSelect = function(folder) {
  const name = folder.name;
  selectedFolder = name;
  expandedSet.add(name);
  folderTree.select(name);
  list.render(folder.children);
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

list = new FileList(listConfig);
list.init();
list.render();