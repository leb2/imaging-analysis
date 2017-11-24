$(function() {
  let path = $('#path').text();

  $('.dropdown-icon').click(function(event) {
    console.log("Clicked");
    event.stopPropagation();
    $(this).closest('.file').find('.file-dropdown-menu').toggle();
  });

  $(':not(.dropdown-icon)').click(function() {
    console.log("not clicked");
    $('.file-dropdown-menu').hide();
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
        console.log(data);
      }
    });
  });
});
