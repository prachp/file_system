/**
 * @jest-environment jsdom
 */
require('../../components/folderTree.js');

const setup = function(overridedSet, overrideOnToggle, overrideOnSelect) {
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
                  size: 500
                },
                {
                  type: 'file',
                  name: 'NSYNC - Bye Bye Bye',
                  modified: new Date(),
                  size: 400
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
    const expandedSet = overridedSet || new Set();
    let folderTree;
    
    const onToggle = overrideOnToggle || function() {};
    let selectedFolder = null;
    const onSelect = overrideOnSelect || function() {};
    
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

    return folderTree;
};

describe('Folder Tree', () => {
    beforeEach(()=> {
        document.body.innerHTML = '<div id="container"></div>';
    })

    test('Render all collapsed', () => {
      setup();
      expect(document.getElementsByClassName('folder').length).toBe(3);
    });

    test('Render one expanded', () => {
      const expanded = new Set();
      expanded.add('Files');
      setup(expanded);
      expect(document.getElementsByClassName('folder').length).toBe(5);
    });

    test('Expand/collapse function', () => {
      const tree = setup();
      expect(document.getElementsByClassName('folder').length).toBe(3);
      tree.toggle('Documents');
      expect(document.getElementsByClassName('folder').length).toBe(5);
      tree.toggle('Files');
      expect(document.getElementsByClassName('folder').length).toBe(7);
      tree.toggle('Documents');
      expect(document.getElementsByClassName('folder').length).toBe(5);
    });

    test('Expand empty folder', () => {
      const expanded = new Set();
      const tree = setup(expanded);
      expect(document.getElementsByClassName('folder').length).toBe(3);
      tree.toggle('Documents');
      expect(document.getElementsByClassName('folder').length).toBe(5);
      expect(document.getElementsByClassName('expanded').length).toBe(1);
      tree.toggle('Projects');
      expect(document.getElementsByClassName('folder').length).toBe(5);
      expect(document.getElementsByClassName('expanded').length).toBe(2);
    });

    test('OnToggle is called', () => {
      const mockOnToggle = jest.fn();
      setup(null, mockOnToggle);
      document.querySelector('.indicator-button[data-name="Documents"]').click();
      expect(mockOnToggle.mock.calls.length).toBe(1);
      expect(mockOnToggle.mock.calls[0][0]).toBe('Documents');
    });

    test('OnSelect is called', () => {
      const mockOnSelect = jest.fn();
      setup(null, null, mockOnSelect);
      document.querySelector('.folder-name[data-name="Documents"]').click();
      expect(mockOnSelect.mock.calls.length).toBe(1);
      expect(mockOnSelect.mock.calls[0][0]).toBe('Documents');
    });

  });