$(function() {
  let selectedPath = '';
  let currentPath = '';

  $('button#submit').click(function() {
    $.ajax({
      method: 'POST',
      url: '/job/run/',
      data: {
        scriptPath: selectedPath,
        argPath: $('#target-path').val()
      }
    })
  });


  function getFiles(path, back, callback) {
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

  function directoryHtml(path, name) {
    return " \
      <div class='file directory'> \
        <div class='hidden path'>" + path + "</div> \
        <div> \
          <i class='ion-ios-folder'></i> \
          <span class='name'>" + name + "</span> \
        </div> \
      </div>";
  }

  function fileHtml(path, name) {
    return " \
    <div class='file non-directory'> \
      <div class='hidden path'>" + path + "</div> \
      <div>\
        <i class='ion-document-text'></i> \
        <span class='name'>" + name + "</span> \
      </div> \
    </div>";
  }

  function updatePathLabel(path) {
    console.log("updating path label to be " + path);
    if (path) {
      $('.back').removeClass('hidden');
      $('.current-path-container').removeClass('hidden');
    } else {
      $('.back').addClass('hidden');
      $('.current-path-container').addClass('hidden');
    }
    $('.current-path').text(path);
    currentPath = path;
  }

  function changeDir(path, back) {
    if (back === undefined) {
      back = false;
    }

    getFiles(path, back, function(result) {

      updatePathLabel(result.path);
      path = result.path;

      let $container = $('.files-container');
      $container.empty();

      for (let i = 0; i < result.files.length; i++) {
        let file = result.files[i];

        let html;
        if (file.isDirectory) {
          let targetPath = path + '/' + file.name;
          html = directoryHtml(targetPath, file.name);
        } else {
          html = fileHtml(path + '/' + file.name, file.name);
        }

        $container.append($(html));
      }

      // Travel down a directory
      $('.file.directory').click(function() {
        let newPath = $(this).find('.path').text();
        changeDir(newPath);
      });

      // Select a new path
      $('.file.non-directory').click(function() {
        selectedPath = $(this).find('.path').text();
        $('.selected').removeClass('selected');
        $(this).addClass('selected');
        $('.selected-path').text(selectedPath);
      });
    });
  }

  $('.back').click(function() {
    changeDir(currentPath, true);
  });

  changeDir(currentPath);
});

