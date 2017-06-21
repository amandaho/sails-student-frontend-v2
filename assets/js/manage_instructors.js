(function(){

  //function to delete record by settin id on form and then submitting the form
  //sets value of instructor id in hidden delete form and submits form
  //not completely ideal but wanted to take advantage of flash messages in sails
  function deleteRecord(record_id){
    $("#deleteform input[name=instructor_id]").val(record_id);
    $("#deleteform").submit();
  }

  function getInstructor(record_id){
    return $.get("http://localhost:1337/instructor/" + record_id, function(data){
      console.log("got instructor");
    })
  }

  $(function(){

    $('#instructorTable').DataTable({
          colReorder: true,
          dom: 'Bfrtip',
          buttons: [
             'copy', 'csv', 'excel', 'pdf', 'print'
          ],
          "scrollX": true,
          columnDefs: [
            { width: '20%', targets:6 }
          ]
       });


     var validator = $("#manageInstructorForm").validate({
       errorClass: "text-danger",
       rules: {
         first_name: {
           required: true,
           minlength: 2
         },

         last_name: {
           required: true,
           minlength: 2
         },

         major_id: {
           required: false
         },
         years_of_experience: {
           required: false
         },
         tenured: {
           required: true
         }
       },
       messages: {
         first_name: {
           required: "Please specify the instructor's first name!",
           minlength: jQuery.validator.format("Please specify a first name with at least two characters!")
         },
         last_name: {
           required: "Please specify the instructor's last name!",
           minlength: jQuery.validator.format("Please specify a last name with at least two characters!")
         },
         tenured: {
           required: "Please specify the instructor's tenured!"
         }
       }

     });

    //initialize variables for items in the DOM we will work with
    let manageInstructorForm = $("#manageInstructorForm");
    let addInstructorButton = $("#addInstructorButton");

    //add instructor button functionality
    addInstructorButton.click(function(){
      $("input").val('');
      validator.resetForm();
      manageInstructorForm.attr("action", "/create_instructor");
      manageInstructorForm.dialog({
        title: "Add Record",
        width: 700,
        modal: true,
        buttons: {
          Cancel: function() {
            $( this ).dialog( "close" );
          },
          "Submit": function() {
            //function to delete record
            manageInstructorForm.submit()
          }
        }
      });
    })

  	$("#instructorTable").on("click", "#editButton", function(e){
      let recordId = $(this).data("instructorid");
      validator.resetForm();
      manageInstructorForm.find("input[name=instructor_id]").val(recordId);
      manageInstructorForm.attr("action", "/update_instructor");
      let instructor = getInstructor(recordId);

      //populate form when api call is done (after we get instructor to edit)
      instructor.done(function(data){
        $.each(data, function(name, val){
            var $el = $('[name="'+name+'"]'),
                type = $el.attr('type');

            switch(type){
                case 'checkbox':
                    $el.attr('checked', 'checked');
                    break;
                case 'radio':
                    $el.filter('[value="'+val+'"]').attr('checked', 'checked');
                    break;
                default:
                    $el.val(val);
            }
        });
      })

      manageInstructorForm.dialog({
        title: "Add Record",
        width: 700,
        modal: true,
        buttons: {
          Cancel: function() {
            $( this ).dialog( "close" );
          },
          Submit: function() {
            //function to delete record
            manageInstructorForm.submit()
          }
        }
      });
    })


    $("#instructorTable").on("click", "#deleteButton", function(e){
      let recordId = $(this).data("instructorid")
      $("#deleteConfirm").dialog({
        title: "Confirm Delete",
        modal: true,
        buttons: {
          Cancel: function() {
            $( this ).dialog( "close" );
          },
          "Delete Instructor": function() {
            //function to delete record
            deleteRecord(recordId);
          }
        }
      });
    })

  })

})();
