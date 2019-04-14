package co.uk.mak.tripmate;

import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@Controller
//@RequestMapping("/")
public class WelcomeController {

	//this loads the index page from temples when / is called
	@GetMapping("/")
	public String welcome() {
		return "index";
	}
	
	@GetMapping("/login")
	public String login() {
		return "login";
	}
	
	@GetMapping(path= "/json", consumes = "application/json", produces = "application/json")
	public ResponseEntity<String> json() {
		return ResponseEntity.ok("{\"test\":\"data\"}");
	}
	
	@GetMapping(path= "/test", produces = "application/json")
	public ResponseEntity<String> test() {
		return ResponseEntity.ok("test");
	}
}
