
//----------------------------------------------------------

const host = `http://localhost:8080/`;//can update this when deployed

const close_button_margin = '40px';

const Mapping = {
    url: ``,
    http_method: `GET`,
    description: ``,
    artifacts: []
};

const Artifact = {
    name : ``,
    description : ``,
    content_type : ``,
    content : ``
};

function post_json(url = ``, data = ``) {
    // Default options are marked with *
    return fetch(url, {
        method: "POST", // *GET, POST, PUT, DELETE, etc.
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
    })
        .then(response => {

            //console.log(response.status + ` ` + response.url);
            return response.json();
        })
        .catch(error => {
            // console.error('Error:', error)
            return error;
        });
}

function get_json(url = ``) {
    return fetch(url)
        .then(function (response) {
            return response.json();
        })
        .catch(error => {
            console.error('Error:', error);
            return error;
        });
}

function get_responce(url = ``) {
    return fetch(url)
        .catch(error => {
            console.error('Error:', error);
            return error;
        });
}
