
package com.blockexplorer.app;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.web.bind.annotation.RestController;
@SpringBootApplication
@RestController
public class BlockExplorerMain {

    public static void main(String[] args) {
        SpringApplication.run(BlockExplorerMain.class, args);
    }
}
            