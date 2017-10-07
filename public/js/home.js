$(function() {
  let path = $('#path').text();

  $('.close-icon').click(function() {
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
