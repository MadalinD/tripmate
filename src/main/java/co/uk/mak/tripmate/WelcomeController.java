package co.uk.mak.tripmate;

import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;

@Controller
public class WelcomeController {

	//this loads the index page from temples when / is called
	@GetMapping("/")
	public String welcome() {
		return "index";
	}
	
}
