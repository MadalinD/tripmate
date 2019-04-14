async function login(){

	console.log("in login js fucntion"); 
	
	let result = await fetch("http://localhost:8080/json",{
    	headers: {
            "Content-Type": "application/json"
        }
    	})
        .then(function (response) {
            return response.json();
        })
        .catch(error => {
            console.error('Error:', error);
            return error;
        });
	
   console.log("ok return " + result.status); 
   
}