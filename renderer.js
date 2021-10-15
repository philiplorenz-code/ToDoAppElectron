// This file is required by the index.html file and will
// be executed in the renderer process for that window.
// No Node.js APIs are available in this process because
// `nodeIntegration` is turned off. Use `preload.js` to
// selectively enable features needed in the rendering
// process.
let $ = require('jquery')  // jQuery now loaded and assigned to $

const sqlite3 = require('sqlite3').verbose();
let db = new sqlite3.Database('mydb.db', (err) => {
    if (err) {
      console.error(err.message);
    }
    console.log('Connection to db successful');
  });
let sql_create = 'CREATE TABLE IF NOT EXISTS ToDo (id INTEGER, Name INTEGER, PRIMARY KEY(id))';
function cb_create(err){
    console.log(err);
}
db.run(sql_create, [], cb_create)



function DBinsert(todo) {
    let sql_insert = "INSERT INTO ToDo (Name) VALUES ('" + todo + "')";
    function cb_insert(err){
      console.log(err);
    }
 
    db.run(sql_insert, [], cb_insert)
}






function showToDos(err,rows){
    console.log(rows)
  }
  function DBselect(){
    let sql_select = 'SELECT * FROM ToDo';  
    db.all(sql_select, [], showToDos)
}
//==========================================//
// 1st page (start page)
//==========================================//
// Initial load of site
DBselect()
// Add button pressed
$('#btn-add').on('click', () => {
    DBinsert($('#input-todo').val())
    DBselect()
 })

 function showToDos(err,rows){
    var markup = ''
    var i
    for (i=0; i < rows.length; i++)
    {
       markup += '<li class="list-group-item">' +
       '<div class="widget-content p-0">' +
       '<div class="widget-content-wrapper">' +
       '<div class="widget-content-left">' +
       '<div class="widget-heading">'+
       rows[i].Name +
       '</div> </div> '+
       '<div id ="todo-line" class="widget-content-right"> <button id = "e_'+ rows[i].id + '" class="border-0 btn-transition btn btn-outline-success btn-edit">' +
       ' <i class="fa fa-edit"></i></button> <button id = "d_'+ rows[i].id + '"  class="border-0 btn-transition btn btn-outline-danger btn-delete"> <i class="fa fa-trash"></i> </button> </div> ' +
       '</div></div></li>' 
    }
    $('#list-todo').html(markup)  
  }


  function DBdelete(id){
    let sql_delete = "DELETE FROM ToDo WHERE id = " + id;
    function cb_delete(err){
      console.log(err);
    }
    db.run(sql_delete, [], cb_delete)
  }
  // Delete button pressed
   $('#list-todo').each(function (idx, obj) {
    $(obj).on('click', '.btn-delete',function () {
      var length = this.id.length - 2
      var ToDoID = this.id.substr(2, length)
      DBdelete(ToDoID)
      DBselect()
    })
  })

  function showEditPage(ToDoName){
    $('#page2').removeAttr('hidden')
    $('#page2').show()
    $('#start').hide()
    $('#edit-todo').val(ToDoName)
  }


  // Change button pressed
  var ToDoID


$('#list-todo').each(function (idx, obj) {
    $(obj).on('click', '.btn-edit',function () {
        var length = this.id.length - 2
        ToDoID = this.id.substr(2, length)
        DBgetToDo(ToDoID)

      //showEditPage()
    })
  })


  function DBgetToDo(id){
    let sql_getToDo = "SELECT Name FROM ToDo WHERE id =" + id;
    function cb_getToDo(err,rows){
        showEditPage(rows[0].Name)
    }
    db.all(sql_getToDo, [], cb_getToDo)
  }

  function showStartPage()
{
  $('#page2').hide()
  $('#start').show()
  DBselect()
}


$('#btn-abort').on('click', () => {
    showStartPage()
   })
// Save button pressed
$('#btn-save').on('click', () => {
    DBchange($('#edit-todo').val(), ToDoID)
    showStartPage()
   })

   function DBchange(ToDoName, id){
    let sql_change = "UPDATE ToDo SET Name = '" + ToDoName + "' WHERE id = " + id;
    function cb_change(err){
      console.log(err)
    }
    db.run(sql_change, [], cb_change)
  }