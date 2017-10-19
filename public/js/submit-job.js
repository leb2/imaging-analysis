$(function() {
  class Selector {
    constructor(scopeSelector) {
      this.selectedPath = '';
      this.currentPath = '';

      // Selectors for relevant elements
      this.scopeSel = scopeSelector;

      $(this.scopeSel).find('.back').click(() => {
        this.changeDir(this.currentPath, true);
      });
      this.changeDir(this.currentPath);
    }

    getFiles(path, back, callback) {
      $.ajax({
        method: 'POST',
        url: '/file/list/',
        data: {
          path: path,
          back: back
        },
        success: function(results) {
          callback(results);
        }
      })
    }

    static directoryHtml(path, name) {
      return " \
          <div class='file directory'> \
            <div class='hidden path'>" + path + "</div> \
            <div> \
              <i class='ion-ios-folder'></i> \
              <span class='name'>" + name + "</span> \
            </div> \
          </div>";
    }

    static fileHtml(path, name) {
      return " \
        <div class='file non-directory'> \
          <div class='hidden path'>" + path + "</div> \
          <div>\
            <i class='ion-document-text'></i> \
            <span class='name'>" + name + "</span> \
          </div> \
        </div>";
    }

    updatePathLabel(path) {
      console.log($(this.scopeSel).find('.back'));

      if (path) {
        $(this.scopeSel).find('.back').removeClass('hidden');
        $(this.scopeSel).find('.path-container').removeClass('hidden');
      } else {
        $(this.scopeSel).find('.back').addClass('hidden');
        $(this.scopeSel).find('.path-container').addClass('hidden');
      }
      $(this.scopeSel).find('.current-path').text(path);
      this.currentPath = path;
    }

    changeDir(path, back) {
      if (back === undefined) {
        back = false;
      }

      this.getFiles(path, back, result => {

        this.updatePathLabel(result.path);
        path = result.path;

        let $container = $(this.scopeSel).find('.files-container');
        $container.empty();

        for (let i = 0; i < result.files.length; i++) {
          let file = result.files[i];

          let html;
          if (file.isDirectory) {
            let targetPath = path + '/' + file.name;
            html = Selector.directoryHtml(targetPath, file.name);
          } else {
            html = Selector.fileHtml(path + '/' + file.name, file.name);
          }

          $container.append($(html));
        }

        let self = this;

        // Travel down a directory
        $(this.scopeSel).find('.file.directory').click(function() {
          let newPath = $(this).find('.path').text();
          self.changeDir(newPath);
        });

        // Select a new path
        $(this.scopeSel).find('.file.non-directory').click(function() {
          self.selectedPath = $(this).find('.path').text();
          $(self.scopeSel).find('.selected').removeClass('selected');
          $(this).addClass('selected');
          $(self.scopeSel).find('.selected-path').text(self.selectedPath);
        });
      });
    }
  }

  const scriptSelector = new Selector('.select-script-container');
  const argumentSelector = new Selector('.select-argument-container');

  $('button#submit').click(() => {
    $.ajax({
      method: 'POST',
      url: '/job/run/',
      data: {
        scriptPath: scriptSelector.selectedPath,
        argPath: argumentSelector.selectedPath
      }
    })
  });

});

