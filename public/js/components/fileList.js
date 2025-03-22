(function () {
  const formatDate = function(date) {
    return date ? date.toLocaleDateString('en-us', {  year:"numeric", month:"numeric", day:"numeric"}) : '';
  };

  const formatSize = function(size) {
    if (size == null) {
      return '';
    }
    // convert from bytes to k, m, g bytes
    const prefixes = ['', 'K', 'M', 'G', 'T'];
    let index = 0;

    while (index < 4 && size >= 1024) {
      size = size / 1024;
      index++;
    }

    return ('' +size.toFixed(0)) + ' ' + prefixes[index] + 'B';
  };

  // Icon from Icons8.com
  const folderIcon = '<img class="icon folder-icon" src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADAAAAAwCAYAAABXAvmHAAAACXBIWXMAAAsTAAALEwEAmpwYAAABCUlEQVR4nO2VMWrDQBBFp8gRQhoFV5a0pM0Zci/fRAK7CcJd0gXcRfKALxFIZ4OdA+gbxZ1A3nU1A/4Pfv/f7OyuCCGEEDICS3lGJQ1q+UMtSEolC3FTvpZDcnFvErhM/vbyXiRwy9p4lMBQYPUAfGVAVwAabNMVPTazX3w+vaUJDOXb3L64jtLmPT4eX+MCw+Sty+pENrOfuICHtdGpUyj6uIB1Sb0eCoAnELhCV7FeEfASq/2UwWdU7ScNfmTqMxLDuiAooPZTBldI7ScNXmL1GbmHZ/RkXRJT2YZjXGBbrh0LNAkCoYCWe/OyOk55wO5lHhX4l/jOM2h4d7JOp2HyyeUJIYTcFWcLXG7i+rfwxwAAAABJRU5ErkJggg==" alt="folder-invoices--v1"></img>';
  const fileIcon = '<img class="icon file-icon" src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADAAAAAwCAYAAABXAvmHAAAACXBIWXMAAAsTAAALEwEAmpwYAAAAn0lEQVR4nO3SMQ7CQAxE0T1+StfJjaaipPUNaChAgqWnQIqscYL0R/IBnvzHYMy70GOabvlbwHp59iHCALjeXnPrQoQBkPd3HyJMgDZEGAHZgXAD0o3oAKQT0QVIF6ITkA5ENyC/EKcE7LkBQHxgklBlJCQSqo2EREK1kZBIqDYSEgnVRkIiodpISCRUGwmJhGojIZFQbSSkgxNibPzcB2CK7Dr8knMRAAAAAElFTkSuQmCC" alt="file"></img>';
  const FileList = function ({container, onSelect}) {
    this.container = container;
    this.onSelect = onSelect;
    this._nodeMap = new Map();
  };

  FileList.prototype.init = function () {
    this.dblClickHandler = (e) => {
      let el = e.target;
      while (el !== this.container && !el.getAttribute('data-cta')) {
        el = el.parentNode;
      }
      if (!el.getAttribute('data-cta')) {
        return;
      }
      const name = el.getAttribute('data-name');
      this.onSelect(name);
      this.render(this._nodeMap.get(name).children);
       
    };

    this.container.addEventListener('dblclick', this.dblClickHandler);
  };

  FileList.prototype.unload = function () {
    this.container.removeEventListener("dblclick", this.dblClickHandler);
  };

  FileList.prototype.render = function (nodes) {
    let rows = [];
    if (nodes) {
      rows = nodes.map((node) => {
      const { name, modified, size, type } = node;
      const icon = type === 'file' ? fileIcon : folderIcon;
      const cta = type === 'folder' ? 'data-cta="true"' : '';
      this._nodeMap.set(name, node);
      return `
          <tr class="row" ${cta} data-name="${name}">
            <td class="column">${icon}</td>
            <td class="column">${name}</td>
            <td class="column">${formatDate(modified)}</td>
            <td class="column file-size">${formatSize(size)}</td>
          </tr>
        `;
      });
    }
    const table = `
        <table class="file-list">
          <thead>
            <tr class="header-row">
              <th class="icon-header"></th>
              <th class="header name">Name</th>
              <th class="header">Date Modified</th>
              <th class="header file-size">File Size</th>
            </tr>
          </thead>
          <tbody>
          ${rows.join('')}
          </tbody>
        </table>
      `;
    this.container.innerHTML = table;
  };



  window.FileList = FileList;

})();