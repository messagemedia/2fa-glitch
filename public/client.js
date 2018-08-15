$(document).ready(function() {
  $('.ui.form')
    .form({
      fields: {
        code: {
          identifier  : 'code',
          rules: [
            {
              type   : 'empty',
              prompt : 'Please enter your code'
            }
          ]
        },
        mobile: {
          identifier  : 'mobile',
          rules: [
            {
              type   : 'empty',
              prompt : 'Please enter your mobile number'
            }
          ]
        }
      }
    });
});

$('#submit').click(function(e){
  e.preventDefault();
  console.log("submit");
  $.ajax({
      type: 'POST',
      data: $("form").serialize(),
      url: '/verify',
      dataType: 'json',
      success: function(data) {
          console.log('success');
          console.log(data);
        
          if (data == true){
            var element = document.getElementById("verifyForm");
            element.classList.remove("error");
            element.classList.add("success");
          }else{
            var element = document.getElementById("verifyForm");
            element.classList.add("error");
          }
      },
      error: function(request, status, error) {
        console.log(error);
      }
  });
});