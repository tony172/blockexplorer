package com.blockexplorer.app.controller;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.GetMapping;

@Controller
public class BlockExplorerController {
    @GetMapping("/")
    public String index(Model model) {
        return "index";
    }
}
