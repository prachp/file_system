(function () {
  const FOLDER_BUTTON = "folder-button";
  const INDICATOR_BUTTON = 'indicator-button';

  const folderIcon = '<img class="icon" src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADAAAAAwCAYAAABXAvmHAAAACXBIWXMAAAsTAAALEwEAmpwYAAABCUlEQVR4nO2VMWrDQBBFp8gRQhoFV5a0pM0Zci/fRAK7CcJd0gXcRfKALxFIZ4OdA+gbxZ1A3nU1A/4Pfv/f7OyuCCGEEDICS3lGJQ1q+UMtSEolC3FTvpZDcnFvErhM/vbyXiRwy9p4lMBQYPUAfGVAVwAabNMVPTazX3w+vaUJDOXb3L64jtLmPT4eX+MCw+Sty+pENrOfuICHtdGpUyj6uIB1Sb0eCoAnELhCV7FeEfASq/2UwWdU7ScNfmTqMxLDuiAooPZTBldI7ScNXmL1GbmHZ/RkXRJT2YZjXGBbrh0LNAkCoYCWe/OyOk55wO5lHhX4l/jOM2h4d7JOp2HyyeUJIYTcFWcLXG7i+rfwxwAAAABJRU5ErkJggg==" alt="folder-invoices--v1"></img>';

  const FolderTree = function (config) {
    this.container = config.container;
    this.data = config.data;
    this.onToggle = config.onToggle;
    this.onSelect = config.onSelect;
    this.selectedFolder = config.selectedFolder;
    this.expandedSet = config.expandedSet;
    this.isInit = false;
    this.folderMap = new Map();
    this.parentMap = new Map();
    this.selected = null;
  };

  FolderTree.prototype.init = function () {
    // If it's already initialized, don't do anything.
    if (this.isInit) {
      return;
    }
    this.clickHandler = (e) => {
      let el = e.target;
      while (el !== this.container && !el.getAttribute('data-cta')) {
        el = el.parentNode;
      }
      const type = el.getAttribute("data-type");
      if (type === FOLDER_BUTTON) {
        const name = el.getAttribute("data-name");
        this.onSelect(this.folderMap.get(name));
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
    const indicatorBtn = this.container.querySelector(`.indicator-button[data-name="${name}"]`);
    if (!indicatorBtn) {
      // Can't toggle it as it's not rendered
      return;
    }
    const container = indicatorBtn.parentNode.parentNode;
    if (indicatorBtn.className.includes('expanded')) {
      indicatorBtn.classList.remove('expanded');
      this.container.querySelector(`.list[data-parent="${name}"]`)?.remove();
    } else {
      indicatorBtn.classList.add('expanded');
      const folder = this.folderMap.get(name);
      if (folder.children) {
        const list = this._renderSubFolders(name, this.folderMap.get(name).children, this.expandedSet, this.folderMap, this.parentMap);
        container.innerHTML += list;
      }
    }
  };

  FolderTree.prototype.select = function(name) {
    const previousSelected = this.container.querySelector('.name-container.selected');
    if (previousSelected) {
      previousSelected.classList.remove('selected');
    }
    this.selected = name;
    const nameBtn = this.container.querySelector(`.folder-name[data-name="${name}"]`);
    if (nameBtn) {
      const parent = nameBtn.parentNode;
      parent.classList.add('selected');
      const indicatorBtn = parent.querySelector(`.indicator-button`);
      if (indicatorBtn && !indicatorBtn.className.includes('expanded')) {
        // Expand the folder if it's not expanded.
        this.toggle(name);
      }
    } else {
      // check if it's a valid name. We must have seen this one before.
      if (this.parentMap.has(name)) {
        let current = name;
        while (current) {
          this.expandedSet.add(current);
          current = this.parentMap.get(current);
        }
        this.render();
        this.select(name);
      }
    }
    
  };
  // Private API
  FolderTree.prototype._renderSubFolders = function(parentName, children) {
    const items = children.filter((item) => item.type === "folder").map((child) => {
      this.parentMap.set(child.name, parentName);
      return this._renderFolder(child);
    });

    return `<ul class="list" data-parent="${parentName}">${items.join("")}</ul>`; 
  };

  // Private API
  FolderTree.prototype._renderFolder = function (folder) {
    const name = folder.name;
    if (!this.folderMap.has(name)) {
      this.folderMap.set(name, folder);
    }
    let subFolders = "";
    let indicatorClass = "";
    const children = folder.children ? folder.children.filter((item) => item.type === "folder") : null;
    if (this.expandedSet.has(name)) {
      indicatorClass = "expanded";
    }
    // Don't render the indicator if there is no folder as children
    const indicatorBtn = children && children.length ? `<button class="${indicatorClass} indicator-button" data-cta={true} data-type="${INDICATOR_BUTTON}" data-name="${name}">
        <span class="triangle"></span>
      </button>` : '<span class="indicator-placeholder"></span>';
    // render children only when it's expanded and has children
    if (children && this.expandedSet.has(folder.name) && children.length) {
      subFolders = this._renderSubFolders(name, children);
    }
    
    

    const selected = this.selected === name ? 'selected' : '';
    return `<li class="folder">
    <div class="name-container ${selected}">
      ${indicatorBtn}
      <button class="folder-name" data-cta={true} data-type="${FOLDER_BUTTON}" data-name="${name}">
        ${folderIcon}
        <span>${name}</span>
      </button>
      </div>
      ${subFolders}
    </li>`;
  };

  FolderTree.prototype.render = function () {
    // We can't render if it has not been initialized!
    if (!this.isInit) {
      return;
    }
    const data = this.data;
    const foldersData = data.filter((item) => item.type === "folder");
    const folders = foldersData.map((folder) => {
      return this._renderFolder(folder);
    });
    const html = `<ul class="folder-tree">${folders.join("")}</ul>`;

    this.container.innerHTML = html;
  };

  // Ideally, we should do `export default Foldertree;`
  // But for simplicity, adding this to window object as we don't use js bundler here
  window.FolderTree = FolderTree;

})();
