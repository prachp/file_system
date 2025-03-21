(function () {
  const FOLDER_BUTTON = "folder-button";
  const INDICATOR_BUTTON = 'indicator-button';

  const renderSubFolders = function(parentName, children, expandedSet, folderMap) {
    const items = children.filter((item) => item.type === "folder").map((child) => {
      return renderFolder(child, expandedSet, folderMap);
    });

    return `<ul class="list" data-parent="${parentName}">${items.join("")}</ul>`; 
  };

  const renderFolder = function (folder, expandedSet, folderMap) {
    const name = folder.name;
    if (!folderMap.has(name)) {
      folderMap.set(name, folder);
    }
    let subFolders = "";
    let indicatorClass = "";
    const children = folder.children;
    // render children only when it's expanded and has children
    if (children && expandedSet.has(folder.name) && children.length) {
      subFolders = renderSubFolders(name, children, expandedSet, folderMap);
    }
    // We still want to indicate that it's expanded even when it doesn't have children
    if (expandedSet.has(name)) {
      indicatorClass = "expanded";
    }
    return `<li class="folder">
      <button class="${indicatorClass} indicator-button" data-type="${INDICATOR_BUTTON}" data-name="${name}">
         </button>
      <button class="folder-name" data-type="${FOLDER_BUTTON}" data-name="${name}">
        ${name}
      </button>
      ${subFolders}
    </li>`;
  };

  const FolderTree = function (config) {
    this.container = config.container;
    this.data = config.data;
    this.onToggle = config.onToggle;
    this.onSelect = config.onSelect;
    this.selectedFolder = config.selectedFolder;
    this.expandedSet = config.expandedSet;
    this.isInit = false;
    this.folderMap = new Map();
  };

  FolderTree.prototype.init = function () {
    // If it's already initialized, don't do anything.
    if (this.isInit) {
      return;
    }
    this.clickHandler = (e) => {
      const el = e.target;
      const type = el.getAttribute("data-type");
      if (type === FOLDER_BUTTON) {
        const name = el.getAttribute("data-name");
        this.onSelect(name);
      } else if (type === INDICATOR_BUTTON) {
        const name = el.getAttribute("data-name");
        this.onToggle(name);
      }
    };
    this.container.addEventListener("click", this.clickHandler);
    this.isInit = true;
  };

  FolderTree.prototype.unload = function () {
    this.container.removeEventListener("click", this.clickHandler);
  };

  FolderTree.prototype.toggle = function (name) {
    const indicatorBtn = document.querySelector(`.indicator-button[data-name="${name}"]`);
    const container = indicatorBtn.parentNode;
    if (indicatorBtn.className.includes('expanded')) {
      indicatorBtn.classList.remove('expanded');
      document.querySelector(`.list[data-parent="${name}"]`)?.remove();
    } else {
      indicatorBtn.classList.add('expanded');
      const folder = this.folderMap.get(name);
      if (folder.children) {
        const list = renderSubFolders(name, this.folderMap.get(name).children, this.expandedSet, this.folderMap);
        container.innerHTML += list;
      }
    }

  };

  FolderTree.prototype.render = function () {
    // We can't render if it has not been initialized!
    if (!this.isInit) {
      return;
    }
    const data = this.data;
    const foldersData = data.filter((item) => item.type === "folder");
    const folders = foldersData.map((folder) => {
      return renderFolder(folder, this.expandedSet, this.folderMap);
    });
    const html = `<ul class="folder-tree">${folders.join("")}</ul>`;

    this.container.innerHTML = html;
  };

  // Ideally, we should do `export default Foldertree;`
  // But for simplicity, adding this to window object as we don't use js bundler here
  window.FolderTree = FolderTree;

})();
