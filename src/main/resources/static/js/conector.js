
//for hard refresh on mac use "command + shift + r" deletes cache
//----------------------------------------------------------

async function populate_selected_mapping() {

    //TODO have filter search for all url mapping like artifacts
    //get all mappings
    //populate in the dropdown
    //add filer search to the input for search
    //on select, populate the mapping
}

function search_list_for_text(event){

    //if key is enter, then populate the artifact content//
    if (event.keyCode == 13) {
        populate_selected_artifact_content().finally();
    }

    let datalist_artifacts = document.getElementById("artifacts-dropdown");
    let search_input = document.getElementById("search_input");
    let search_text = search_input.value.toLowerCase();
    let artifacts = datalist_artifacts.getElementsByTagName("option");

    $.each(artifacts,function (i,option) {
        let optionText = option.textContent;
        if(optionText.toLowerCase().indexOf((search_text) > -1)){
            option.style.display = "";
        } else {
            option.style.display = "none";
        }
    })
}

async function list_artifacts_for_mapping(){

    let url_mapping = document.getElementById("url-url-mapping").value;
    let http_method = document.getElementById("http-method-url-mapping").value;
    let url = "url_mapping/url/" +
        encodeURIComponent(url_mapping) +
        "/http_method/" + http_method;

    let result = await get_json(host + url);

    let artifacts = result.artifacts;
    //console.log(artifacts.length + " artifacts-in-url-mapping");

    let mapping_artifacts = document.getElementById("artifacts-for-url-mapping");
    mapping_artifacts.innerHTML = "";

    $.each(artifacts,async function (i,item) {

        let artifact = await get_json(host + "artifact/" + item);

        let li = document.createElement("li");
        let span = document.createElement("span");

        span.classList.add("close");
        span.appendChild( document.createTextNode("x"));
        span.style.width = close_button_margin;
        span.addEventListener("click", function() {
            this.parentElement.remove();
        });

        let id = "" + artifact.id;
        let name = artifact.name;

        li.setAttribute("artifact_id", id);
        li.appendChild(document.createTextNode(name));
        li.appendChild(span);
        let list = document.getElementById("artifacts-for-url-mapping");
        list.appendChild(li);
    })
}

async function add_artifact_to_mapping() {

    let selected_artifact = document.getElementById('search_input').value;

    if(selected_artifact !== "") {

        let result = await get_json(host + 'artifact/name/' + encodeURIComponent(selected_artifact));

        if (result.status == 500) {
            console.log(selected_artifact + " is no an artifact");
        } else {

            let id = result.id;
            let name = result.name;

            let mapping_artifacts = document.getElementById("artifacts-for-url-mapping");

            let not_added = true;

            let children = mapping_artifacts.childNodes;
            children.item(0).childNodes.item(0)
            $.each(children,function (i,item) {
                if(item.firstChild.textContent == name){
                    not_added = false;
                    return false; // breaks
                }
            })

            if(not_added){

                let li = document.createElement("li");
                let span = document.createElement("span");

                //define span for the x remove button
                span.classList.add("close");
                span.appendChild(document.createTextNode("x"));
                span.style.width = close_button_margin;
                span.addEventListener("click", function () {
                    this.parentElement.remove();
                });

                li.setAttribute("artifact_id", id);
                li.appendChild(document.createTextNode(name));
                li.appendChild(span);
                mapping_artifacts.appendChild(li);
            } else {
                console.log(name + " has already been added to " + document.getElementById("url-url-mapping").value);
            }
        }
    }
}

async function get_all_artifacts(){

    //TODO in the long run this will be tied to a particular project
    let result = await get_json(host + "artifact");

    let ul_dropdown = document.getElementById("artifacts-dropdown");
    ul_dropdown.innerHTML = "";

    $.each(result,function(i,item)
    {
        let option = document.createElement("option");

        let artifact_id = item.id;
        let name = item.name;

        option.setAttribute("artifact_id", artifact_id);
        option.appendChild(document.createTextNode(name));
        ul_dropdown.appendChild(option);
    });
}

async function populate_selected_artifact_content() {

    let name = document.getElementById('search_input').value;

    //prevent null pointers when selecting search input
    if (name != "") {

        let result = await get_json(host + 'artifact/name/' + encodeURIComponent(name));

        let edit_button = document.createElement("button");
        edit_button.addEventListener("click",function () {
            //get the name of the selected artifact and migrate to the artifacts page populated
            edit_artifact_link().finally();
        });
        edit_button.classList.add("btn-link");
        edit_button.classList.add("btn");
        edit_button.appendChild(document.createTextNode("Click to Edit: " + name));

        document.getElementById("content-url-mapping").value = result.content;

        document.getElementById("content-url-mapping-label").innerText = "";
        document.getElementById("content-url-mapping-label").appendChild(edit_button);
    }


    // //Code to check the whole payload returned from get response
    // let result = await get_responce(host + 'artifact/name/' + name);
    //
    // if (result === undefined){
    //     console.log("was null");
    // }
    // else if(result.status === 200){
    //
    //     console.log("status === 200");
    //     console.log("result: " + result);
    //
    //     let result_json = await result.json();
    //     console.log("result_json: " + JSON.stringify(result_json));
    //
    //     let content = result_json.content;
    //     console.log("content: " + content);
    //
    //     document.getElementById("content-url-mapping").value = content;
    // }
    // else {
    //     console.log("not ok: " + result.status);
    // }

}

async function edit_artifact_link(){

    let name = document.getElementById('search_input').value;

    let nav_artifact = document.getElementById("nav-artifact");
    nav_artifact.click();

    let result = await get_json(host + 'artifact/name/' + encodeURIComponent(name));
    document.getElementById("name-artifact").value = result.name;
    document.getElementById("description-artifact").value = result.description;
    document.getElementById("content-type-artifact").value = result.content_type;
    document.getElementById("content-artifact").value = result.content;
}

async function save_urlMapping() {

    let url = document.getElementById("url-url-mapping").value;
    let http_method = document.getElementById("http-method-url-mapping").value;
    let description = document.getElementById("description-url-mapping").value;
    let artifacts_list = document.getElementById("artifacts-for-url-mapping").getElementsByTagName("li");

    if (url === "") {
        console.log("url can't be empty");
    }
    else if (description === "") {
        console.log("description can't be empty");
    } else {

        let artifacts = [];

        if (artifacts_list.length === 0) {
            //console.log("no artifacts");

            //TODO talk to clive about best approach. placeholder artifact?
            //add in place holder due to mandatory min 1 artifact
            let result = await get_json(host + 'artifact/name/' + encodeURIComponent("placeholder"));
            let artifact_id = result.id;
            artifacts.push(artifact_id);

        } else {
            //console.log(artifacts_list.length + " artifacts");

            $.each(artifacts_list, function (i, item) {
                let artifact_id = item.getAttribute("artifact_id");
                artifacts.push(artifact_id);
            });

        }//console.log("artifact id's " + artifacts);

        //make object based on fields to be sent
        let mapping = Object.create(Mapping);
        mapping.url = url;
        mapping.http_method = http_method;
        mapping.description = description;
        mapping.artifacts = artifacts;

        const result = await post_json(host + 'url_mapping', mapping);
        //console.log(result);

        //update the response section
        $("#response").html(JSON.stringify(result, null, 4));

        //refresh the list of artifacts
        list_artifacts_for_mapping().finally();
    }
}

//adding async to allow await keyword
async function save_artifact() {
    let name = document.getElementById("name-artifact").value;
    let description = document.getElementById("description-artifact").value;
    let content_type = document.getElementById("content-type-artifact").value;
    let code = $.trim($("#content-artifact").val());

    let artifact = Object.create(Artifact);
    artifact.name = name;
    artifact.description = description;
    artifact.content_type = content_type;
    artifact.content = code;

    //add in the await keyword to make the result wait until the request comes back
    const result = await post_json(host + 'artifact', artifact);

    //update the response section
    $("#response").html(JSON.stringify(result, null, 4));

}

function navigate(event){

    let current_active_nav = document.querySelectorAll(".active");//returns snapshot list
    let new_active_nav = document.getElementById(event.target.id);;

    current_active_nav[0].classList.remove("active");
    new_active_nav.classList.add("active");//revise

    let all_nav = document.getElementsByClassName("nav-item-content");
    let nav_too = document.getElementById(event.target.getAttribute("nav"));

    $.each(all_nav,function (i,nav) {
        nav.style.display = "none";
    })
    nav_too.style.display = "flex";
}

$(document).ready(function() {

    //-------------------------------for testing

    //artifact testing data
    document.getElementById("name-artifact").setAttribute('value','Test JSON');
    document.getElementById("description-artifact").setAttribute('value','Test JSON description');
    document.getElementById("content-type-artifact").setAttribute('value','JSON');
    document.getElementById("content-artifact").value = "{\"test\":\"123\"}";

    //mapping testing data
    document.getElementById("url-url-mapping").setAttribute('value','/reflect_request');
    document.getElementById("http-method-url-mapping").setAttribute('value','GET');
    document.getElementById("description-url-mapping").setAttribute('value','Reflects back the contents of the HTTP request in the response');
    document.getElementById("content-url-mapping").value =
        "{\"test\":\"123}";

    //fucntion calls for testings
    list_artifacts_for_mapping().finally();

    //-------------------------------

    $('.nav-link').click(function (event) {

        event.preventDefault(); //prevents the default action
        navigate(event);
    })

    $('#artifacts-add-button').click(function(event) {

        event.preventDefault(); //prevents the default action
        add_artifact_to_mapping().finally();
    });

    $('#submit-artifact').click(function(event) {

        event.preventDefault(); //prevents the default action
        save_artifact().finally();
    });

    $('#submit-url-mapping').click(function(event) {

        event.preventDefault(); //prevents the default action
        save_urlMapping().finally();
    });
});