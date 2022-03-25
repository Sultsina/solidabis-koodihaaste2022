package com.solidabis.koodihaaste22;

import org.springframework.web.bind.annotation.CookieValue;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RestController;

import javax.servlet.http.Cookie;
import javax.servlet.http.HttpServletResponse;

@RestController
public class LounaspaikkaController {
    @GetMapping("/lounaspaikat/{city}")
    public String haeLounasPaikat(@CookieValue(name="VOTERID", required = false) String voterIdCookie,
                                  @PathVariable("city") String city,
                                  HttpServletResponse response) {
        if(voterIdCookie==null) {
            // lähetä cookie
            var cookie = new Cookie("VOTERID", "432432432432");
            cookie.setHttpOnly(true);
            response.addCookie(cookie);
        }
        return "";
    }
}