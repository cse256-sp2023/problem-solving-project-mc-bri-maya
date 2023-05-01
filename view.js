// ---- Define your dialogs  and panels here ----
//Making a new permissions panel to display permissions for a given user and file
var newEP = define_new_effective_permissions("new_permission", add_info_col = true, which_permissions = null)
//Displaying the panel

//Selecting user 
var newUser = define_new_user_select_field("new_user", "Select Group/User", function (selected_user) {
    $('#new_permission').attr('username', selected_user);
});

function get_file_info() {
    const fileinfo= [];

    $('.permbutton').each(function () {
        const filepath = $(this).attr('path');
        const filename = filepath.replace(/^.*[\\\/]/, ''); // Use extractFileName() to get the file name from the file path
        fileinfo.push({ filepath, filename });
    });

    console.log('Visible Files:', fileinfo);
    return fileinfo;
}


function file_dropdown() {
    const info = get_file_info();
    const dropdown = $('<select class="dropdown"><option value="">Select Folder/File</option></select>');

    info.forEach(({ filepath, filename }) => {
        dropdown.append(`<option value="${filepath}">${filename}</option>`);
    });

    dropdown.on('change', function () {
        $('#new_permission').attr('filepath', $(this).val());
    });

    return dropdown;
}






// $(".slide-image").css({
//     "max-width": "20%"
//   });


// ---- Display file structure ----

// (recursively) makes and returns an html element (wrapped in a jquery object) for a given file object
function make_file_element(file_obj) {
    let file_hash = get_full_path(file_obj)

    if(file_obj.is_folder) {
        let folder_elem = $(`<div class='folder' id="${file_hash}_div">
            <h3 id="${file_hash}_header">
                <span class="oi oi-folder" id="${file_hash}_icon"/> <strong>${file_obj.filename}</strong> 
                <button class="ui-button ui-widget ui-corner-all permbutton" path="${file_hash}" id="${file_hash}_permbutton"> 
                    Change Folder Permissions <span class="oi oi-lock-unlocked" id="${file_hash}_permicon"/> 
                </button>
            </h3>
        </div>`)

        // append children, if any:
        if( file_hash in parent_to_children) {
            let container_elem = $("<div class='folder_contents'></div>")
            folder_elem.append(container_elem)
            for(child_file of parent_to_children[file_hash]) {
                let child_elem = make_file_element(child_file)
                container_elem.append(child_elem)
            }
        }
        return folder_elem
    }
    else {
        return $(`<div class='file'  id="${file_hash}_div">
            <span class="oi oi-file" id="${file_hash}_icon"/> <strong>${file_obj.filename}</strong>
            <button class="ui-button ui-widget ui-corner-all permbutton" path="${file_hash}" id="${file_hash}_permbutton"> 
                Change File Permissions <span class="oi oi-lock-unlocked" id="${file_hash}_permicon"/> 
            </button>
        </div>`)
    }
}

// Title Edit Permissions panel
$("#filestructure").append(`<div class="edit-perms-panel-title"><h2>Edit Permissions</h2></div>`)

for(let root_file of root_files) {
    let file_elem = make_file_element(root_file)
    $("#filestructure").append(file_elem);    
}

// make folder hierarchy into an accordion structure
$('.folder').accordion({
    collapsible: true,
    heightStyle: 'content'
}) 
// TODO: start collapsed and check whether read permission exists before expanding?


// -- Connect File Structure lock buttons to the permission dialog --

// open permissions dialog when a permission button is clicked
$('.permbutton').click( function( e ) {
    // Set the path and open dialog:
    let path = e.currentTarget.getAttribute('path');
    perm_dialog.attr('filepath', path)
    perm_dialog.dialog('open')
    //open_permissions_dialog(path)

    // Deal with the fact that folders try to collapse/expand when you click on their permissions button:
    e.stopPropagation() // don't propagate button click to element underneath it (e.g. folder accordion)
    // Emit a click for logging purposes:
    emitter.dispatchEvent(new CustomEvent('userEvent', { detail: new ClickEntry(ActionEnum.CLICK, (e.clientX + window.pageXOffset), (e.clientY + window.pageYOffset), e.target.id,new Date().getTime()) }))
});


// $('.permbutton').click( function( e ) {
//     // Set the path and open dialog:
//     let path = e.currentTarget.getAttribute('path');
//     perm_dialog.attr('filepath', path)
//     perm_dialog.dialog('open')
//     //open_permissions_dialog(path)

//     // Deal with the fact that folders try to collapse/expand when you click on their permissions button:
//     e.stopPropagation() // don't propagate button click to element underneath it (e.g. folder accordion)
//     // Emit a click for logging purposes:
//     emitter.dispatchEvent(new CustomEvent('userEvent', { detail: new ClickEntry(ActionEnum.CLICK, (e.clientX + window.pageXOffset), (e.clientY + window.pageYOffset), e.target.id,new Date().getTime()) }))
// });


// ---- Assign unique ids to everything that doesn't have an ID ----


$('#html-loc').find('*').uniqueId() 

// Title Effective Perms panel
$("#sidepanel").append(`<div class="current-perms-panel-title"><h2>Current Permissions</h2></div>`)
$("#sidepanel").append(`<div class="current-perms-desc">Select a user and folder/file to <strong>check</strong> the user's current permissions for the selected folder/file.<br>Make sure to <strong>re-select</strong> user to see the changes to permissions.</div>`)
$('#sidepanel').append(newUser)

$('#sidepanel').append(file_dropdown());
$('#sidepanel').append(newEP)



//Create a container to hold the file structure and images
var steps = ["added_files/1-user-guide.png", "added_files/2-user-guide.png", "added_files/3-user-guide.png", "added_files/4-user-guide.png"];
$("#sidepanel").append(`<div class="current-perms-panel-title"><h2>Guide to Changing Permissions</h2></div>`)

$("#sidepanel").append(`

<div class="slider-container-scroll">      
        <img class="slide-image" src="added_files/1-user-guide.png"/>
        <img class="slide-image" src="added_files/2-user-guide.png"/>
        <img class="slide-image" src="added_files/3-user-guide.png"/>
        <img class="slide-image" src="added_files/4-user-guide.png"/>

</div>

`);

$(window).on('unload', function() {
    $(window).scrollTop(0);
 });

//Style the container and the file structure container to display them side by side
$(".float-container").css({
  "padding":"2px",
  "align-items":"center"
  
});

