/**
 * @jest-environment jsdom
 */
require('../../components/fileList.js');

const setup = function(overrideOnSelect) {
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
            {
              type: 'file',
              name: 'Tax doc',
              modified: new Date(),
              size: 5000
            },
            {
              type: 'file',
              name: 'Resume',
              modified: new Date(),
              size: 900
            }
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
    
    const onSelect = overrideOnSelect || function() {};
    
    const config = {
      container: container,
      onSelect: onSelect,
    };
    const fileList = new FileList(config);
    fileList.init();
    fileList.render(TEST_DATA);

    return fileList;
};

const dblclickEvent = new MouseEvent('dblclick', {
  'view': window,
  'bubbles': true,
  'cancelable': true
});

let mockOnSelect = jest.fn();

describe('File List', () => {
    beforeEach(()=> {
        document.body.innerHTML = '<div id="container"></div>';
        mockOnSelect = jest.fn();
        setup(mockOnSelect);
    })

    test('Render folders', () => {
      expect(document.getElementsByClassName('folder-icon').length).toBe(3);
    });

    test('Empty folders', () => {
      document.querySelector('.row[data-name="Documents"]').dispatchEvent(dblclickEvent);
      document.querySelector('.row[data-name="Movies"]').dispatchEvent(dblclickEvent);
      expect(document.getElementsByClassName('folder-icon').length).toBe(0);
      expect(document.getElementsByClassName('folder-icon').length).toBe(0);
    });

    test('Render children after dblclick', () => {
      expect(document.getElementsByClassName('folder-icon').length).toBe(3);
      document.querySelector('.row[data-name="Files"]').dispatchEvent(dblclickEvent);
      expect(document.getElementsByClassName('folder-icon').length).toBe(2);
    });

    test('Render Files', () => {
      expect(document.getElementsByClassName('folder-icon').length).toBe(3);
      document.querySelector('.row[data-name="Documents"]').dispatchEvent(dblclickEvent);
      expect(document.getElementsByClassName('folder-icon').length).toBe(2);
      document.querySelector('.row[data-name="Projects"]').dispatchEvent(dblclickEvent);
      expect(document.getElementsByClassName('folder-icon').length).toBe(0);
      expect(document.getElementsByClassName('file-icon').length).toBe(2);
    });

    test('Render Folders and Files', () => {
      document.querySelector('.row[data-name="Downloads"]').dispatchEvent(dblclickEvent);
      expect(document.getElementsByClassName('folder-icon').length).toBe(2);
      expect(document.getElementsByClassName('file-icon').length).toBe(2);
    });

    test('OnSelect', () => {
      document.querySelector('.row[data-name="Downloads"]').dispatchEvent(dblclickEvent);
      expect(mockOnSelect.mock.calls.length).toBe(1);
      expect(mockOnSelect.mock.calls[0][0]).toBe('Downloads');
      document.querySelector('.row[data-name="Resume"]').dispatchEvent(dblclickEvent);
      expect(mockOnSelect.mock.calls.length).toBe(1);
    });

  });