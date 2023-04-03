// ---- Define your dialogs  and panels here ----
// Create a container to hold the file structure and images

var steps = ["added_files/1-user-guide.png", "added_files/2-user-guide.png", "added_files/3-user-guide.png", "added_files/4-user-guide.png"];

$("#filestructure").before(`

<div class="slider-container">
  <div class="slider">
        <div class="slides">

            <div id="slides__1" class="slide">
                <span class="slide__text">
                    <h2 class="title-phrase">Step-by-Step Guide to Change Permissions</h2>
                </span>
                <a class="slide__prev" href="#slides__7d" title="Next"></a>
                <a class="slide__next" href="#slides__2" title="Next"></a>
            </div>

            <div id="slides__2" class="slide">
                <span class="slide__text">
                    <img class="slide-image" src="added_files/Step1.png"/>
                </span>
                <a class="slide__prev" href="#slides__1" title="Prev"></a>
                <a class="slide__next" href="#slides__3" title="Next"></a>
            </div>

            <div id="slides__3" class="slide">
                <span class="slide__text">
                    <img class="slide-image" src="added_files/Step2.png"/>
                </span>
                <a class="slide__prev" href="#slides__2" title="Prev"></a>
                <a class="slide__next" href="#slides__4" title="Next"></a>
            </div>

            <div id="slides__4" class="slide">
                <span class="slide__text">
                    <img class="slide-image" src="added_files/Step3.png"/>
                </span>
                <a class="slide__prev" href="#slides__3" title="Prev"></a>
                <a class="slide__next" href="#slides__5" title="Prev"></a>
            </div>

            <div id="slides__5" class="slide">
                <span class="slide__text">
                    <img class="slide-image" src="added_files/Step4.png"/>
                </span>
                <a class="slide__prev" href="#slides__4" title="Prev"></a>
                <a class="slide__next" href="#slides__6" title="Prev"></a>
            </div>

            <div id="slides__6" class="slide">
                <span class="slide__text">
                    <img class="slide-image" src="added_files/Step5.png"/>
                </span>
                <a class="slide__prev" href="#slides__5" title="Prev"></a>
                <a class="slide__next" href="#slides__7a" title="Prev"></a>
            </div>

            <div id="slides__7a" class="slide">
                <span class="slide__text">
                    <img class="slide-image" src="added_files/Step6.png"/>
                </span>
                <a class="slide__prev" href="#slides__6" title="Prev"></a>
                <a class="slide__next" href="#slides__7b" title="Prev"></a>
            </div>

            <div id="slides__7b" class="slide">
                <span class="slide__text">
                    <img class="slide-image" src="added_files/Step7a.png"/>
                </span>
                <a class="slide__prev" href="#slides__7a" title="Prev"></a>
                <a class="slide__next" href="#slides__7c" title="Prev"></a>
            </div>

            <div id="slides__7c" class="slide">
                <span class="slide__text">
                    <img class="slide-image" src="added_files/Step7b.png"/>
                </span>
                <a class="slide__prev" href="#slides__7b" title="Prev"></a>
                <a class="slide__next" href="#slides__7d" title="Prev"></a>
            </div>

            <div id="slides__7d" class="slide">
                <span class="slide__text">
                    <img class="slide-image" src="added_files/Step7c.png"/>
                </span>
                <a class="slide__prev" href="#slides__7c" title="Prev"></a>
                <a class="slide__next" href="#slides__1" title="Prev"></a>
            </div>

        </div>


        </div>
    
    </div>
</div>

<div class="float-container">
    <br>
    <a class="instructions" href="added_files/instructions.html" title="Prev"><b>Instructional Guide (right click to open in new tab!)</b></a>
    <br><br>

    <div id="filestructure-container" class="float-child">
      <div id="filestructure"></div>
    </div>

</div>

`);

// $(window).on('unload', function() {
//     $(window).scrollTop(0);
//  });

// Style the container and the file structure container to display them side by side
$(".float-container").css({
  "padding":"2px",
  "align-items":"center"
});



// ---- Display file structure ----

// (recursively) makes and returns an html element (wrapped in a jquery object) for a given file object
function make_file_element(file_obj) {
    let file_hash = get_full_path(file_obj)

    if(file_obj.is_folder) {
        let folder_elem = $(`<div class='folder' id="${file_hash}_div">
            <h3 id="${file_hash}_header">
                <span class="oi oi-folder" id="${file_hash}_icon"/> ${file_obj.filename} 
                <button class="ui-button ui-widget ui-corner-all permbutton" path="${file_hash}" id="${file_hash}_permbutton"> 
                    <span class="oi oi-lock-unlocked" id="${file_hash}_permicon"/> 
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
            <span class="oi oi-file" id="${file_hash}_icon"/> ${file_obj.filename}
            <button class="ui-button ui-widget ui-corner-all permbutton" path="${file_hash}" id="${file_hash}_permbutton"> 
                <span class="oi oi-lock-unlocked" id="${file_hash}_permicon"/> 
            </button>
        </div>`)
    }
}

for(let root_file of root_files) {
    let file_elem = make_file_element(root_file)
    $( "#filestructure" ).append( file_elem);    
}



// make folder hierarchy into an accordion structure
$('.folder').accordion({
    collapsible: true,
    heightStyle: 'content'
}) // TODO: start collapsed and check whether read permission exists before expanding?


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