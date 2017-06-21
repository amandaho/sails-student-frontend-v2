(function(){

  //function to delete record by settin id on form and then submitting the form
  //sets value of student class id in hidden delete form and submits form
  //not completely ideal but wanted to take advantage of flash messages in sails
  function deleteRecord(record_id){
    $("#deleteform input[name=student_class_id]").val(record_id);
    $("#deleteform").submit();
  }

  function getStudentClass(record_id){
    return $.get("http://localhost:1337/student_class/" + record_id, function(data){
      console.log("got student class");
    })
  }

  $(function(){

    $('#studentClassTable').DataTable({
          colReorder: true,
          dom: 'Bfrtip',
          buttons: [
             'copy', 'csv', 'excel', 'pdf', 'print'
          ],
          "scrollX": true
       });


     var validator = $("#manageStudentClassForm").validate({
       errorClass: "text-danger",
       rules: {
         student_id: {
           required: true
         },

         class_id: {
           required: true
         }
       },
       messages: {
         student_id: {
           required: "Please specify a Student ID!"
         },
         class_id: {
           required: "Please specify a Class ID!"
       }
     }

     });

    //initialize variables for items in the DOM we will work with
    let manageStudentClassForm = $("#manageStudentClassForm");
    let addStudentClassButton = $("#addStudentClassButton");

    //add student class button functionality
    addStudentClassButton.click(function(){
      $("input").val('');
      validator.resetForm();
      manageStudentClassForm.attr("action", "/create_studentClass");
      manageStudentClassForm.dialog({
        title: "Add Record",
        width: 700,
        modal: true,
        buttons: {
          Cancel: function() {
            $( this ).dialog( "close" );
          },
          "Submit": function() {
            //function to delete record
            manageStudentClassForm.submit()
          }
        }
      });
    })

  	$("#studentClassTable").on("click", "#editButton", function(e){
      let recordId = $(this).data("studentclassid");
      validator.resetForm();
      manageStudentClassForm.find("input[name=student_class_id]").val(recordId);
      manageStudentClassForm.attr("action", "/update_studentClass");
      let studentClass = getStudentClass(recordId);

      //populate form when api call is done (after we get student class to edit)
      studentClass.done(function(data){
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

      manageStudentClassForm.dialog({
        title: "Add Update",
        width: 700,
        modal: true,
        buttons: {
          Cancel: function() {
            $( this ).dialog( "close" );
          },
          Submit: function() {
            //function to delete record
            manageStudentClassForm.submit()
          }
        }
      });
    })


    $("#studentClassTable").on("click", "#deleteButton", function(e){
      let recordId = $(this).data("studentclassid")
      $("#deleteConfirm").dialog({
        title: "Confirm Delete",
        modal: true,
        buttons: {
          Cancel: function() {
            $( this ).dialog( "close" );
          },
          "Delete Student Class": function() {
            //function to delete record
            deleteRecord(recordId);
          }
        }
      });
    })

  })

})();
