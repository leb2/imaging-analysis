$(function() {
  let path = $('#path').text();

  $('.dropdown-icon').click(function(event) {
    event.stopPropagation();
    $(this).closest('.file').find('.file-dropdown-menu').toggle();
  });

  $(':not(.dropdown-icon)').click(function() {
    $('.file-dropdown-menu').hide();
  });

  let target = undefined;
  $('.share').click(function() {
    target = path + "/" + $(this).closest('.file').find('.name').text();
    $('.share-target').text(target);
  });

  $('.share-confirm').click(function() {
    $.ajax({
      url: '/share',
      method: 'post',
      data: {
        path: target
      },
      success: function() {
        $('#shareModal').modal('hide');
      }
    })
  });

  $('.delete').click(function() {
    let file_elem = $(this).closest('.file');
    let file = file_elem.find('.name').text();

    $.ajax({
      type: "POST",
      url: 'file/delete',
      data: {
        path: path,
        file: file
      },
      success: function(data) {
        file_elem.remove();
      }
    });
  });
});
