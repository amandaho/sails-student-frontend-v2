(function(){

  //function to delete record by settin id on form and then submitting the form
  //sets value of major class id in hidden delete form and submits form
  //not completely ideal but wanted to take advantage of flash messages in sails
  function deleteRecord(record_id){
    $("#deleteform input[name=major_class_id]").val(record_id);
    $("#deleteform").submit();
  }

  function getMajorClass(record_id){
    return $.get("http://localhost:1337/major_class/" + record_id, function(data){
      console.log("got major class");
    })
  }

  $(function(){

    $('#majorClassTable').DataTable({
          colReorder: true,
          dom: 'Bfrtip',
          buttons: [
             'copy', 'csv', 'excel', 'pdf', 'print'
          ],
          "scrollX": true
       });


     var validator = $("#manageMajorClassForm").validate({
       errorClass: "text-danger",
       rules: {
         major_id: {
           required: true
         },

         class_id: {
           required: true
         }
       },
       messages: {
         major_id: {
           required: "Please specify a Major ID!"
         },
         class_id: {
           required: "Please specify a Class ID!"
       }
     }

     });

    //initialize variables for items in the DOM we will work with
    let manageMajorClassForm = $("#manageMajorClassForm");
    let addMajorClassButton = $("#addMajorClassButton");

    //add major class button functionality
    addMajorClassButton.click(function(){
      $("input").val('');
      validator.resetForm();
      manageMajorClassForm.attr("action", "/create_majorClass");
      manageMajorClassForm.dialog({
        title: "Add Record",
        width: 700,
        modal: true,
        buttons: {
          Cancel: function() {
            $( this ).dialog( "close" );
          },
          "Submit": function() {
            //function to delete record
            manageMajorClassForm.submit()
          }
        }
      });
    })

  	$("#majorClassTable").on("click", "#editButton", function(e){
      let recordId = $(this).data("majorclassid");
      validator.resetForm();
      manageMajorClassForm.find("input[name=major_class_id]").val(recordId);
      manageMajorClassForm.attr("action", "/update_majorClass");
      let majorClass = getMajorClass(recordId);

      //populate form when api call is done (after we get major class to edit)
      majorClass.done(function(data){
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

      manageMajorClassForm.dialog({
        title: "Add Update",
        width: 700,
        modal: true,
        buttons: {
          Cancel: function() {
            $( this ).dialog( "close" );
          },
          Submit: function() {
            //function to delete record
            manageMajorClassForm.submit()
          }
        }
      });
    })


    $("#majorClassTable").on("click", "#deleteButton", function(e){
      let recordId = $(this).data("majorclassid")
      $("#deleteConfirm").dialog({
        title: "Confirm Delete",
        modal: true,
        buttons: {
          Cancel: function() {
            $( this ).dialog( "close" );
          },
          "Delete Major Class": function() {
            //function to delete record
            deleteRecord(recordId);
          }
        }
      });
    })

  })

})();
