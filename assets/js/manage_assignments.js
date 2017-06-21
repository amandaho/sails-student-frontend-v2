(function(){

  //function to delete record by settin id on form and then submitting the form
  //sets value of assignment id in hidden delete form and submits form
  //not completely ideal but wanted to take advantage of flash messages in sails
  function deleteRecord(record_id){
    $("#deleteform input[name=assignment_id]").val(record_id);
    $("#deleteform").submit();
  }

  function getAssignment(record_id){
    return $.get("http://localhost:1337/assignment/" + record_id, function(data){
      console.log("got assignment");
    })
  }


  $(function(){

    $('#assignmentTable').DataTable({
          colReorder: true,
          dom: 'Bfrtip',
          buttons: [
             'copy', 'csv', 'excel', 'pdf', 'print'
          ],
          "scrollX": true
          // columnDefs: [
          //   { width: '20%', targets:6 }
          // ]
       });

     var validator = $("#manageAssignmentForm").validate({
       errorClass: "text-danger",
       rules: {
         student_id: {
           required: false
         },
         assignment_nbr: {
           required: true,
           minlength: 2
         },
          grade_id: {
            required: false
          },
          class_id: {
            required: false
          }
        },
       messages: {
         assignment_nbr: {
           required: "Please specify an assignment number!",
           minlength: jQuery.validator.format("Please specify the major with at least two characters!")
         }
       }

     });

    //initialize variables for items in the DOM we will work with
    let manageAssignmentForm = $("#manageAssignmentForm");
    let addAssignmentButton = $("#addAssignmentButton");
    //add assignment button functionality
    addAssignmentButton.click(function(){
      $("input").val('');
      validator.resetForm();
      manageAssignmentForm.attr("action", "/create_assignment");
      manageAssignmentForm.dialog({
        title: "Add Record",
        width: 700,
        modal: true,
        buttons: {
          Cancel: function() {
            $( this ).dialog( "close" );
          },
          "Submit": function() {
            //function to delete record
            manageAssignmentForm.submit()
          }
        }
      });
    })

  	$("#assignmentTable").on("click", "#editButton", function(e){
      let recordId = $(this).data("assignmentid");
      validator.resetForm();
      manageAssignmentForm.find("input[name=assignment_id]").val(recordId);
      manageAssignmentForm.attr("action", "/update_assignment");
      let assignment = getAssignment(recordId);

      //populate form when api call is done (after we get assignment to edit)
      assignment.done(function(data){
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

      manageAssignmentForm.dialog({
        title: "Update Record",
        width: 700,
        modal: true,
        buttons: {
          Cancel: function() {
            $( this ).dialog( "close" );
          },
          Submit: function() {
            //function to delete record
            manageAssignmentForm.submit()
          }
        }
      });
    })


    $("#assignmentTable").on("click", "#deleteButton", function(e){
      let recordId = $(this).data("assignmentid")
      $("#deleteConfirm").dialog({
        title: "Confirm Delete",
        modal: true,
        buttons: {
          Cancel: function() {
            $( this ).dialog( "close" );
          },
          "Delete Assignment": function() {
            //function to delete record
            deleteRecord(recordId);
          }
        }
      });
    })

  })

})();
