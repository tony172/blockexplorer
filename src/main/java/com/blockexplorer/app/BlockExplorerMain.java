
package com.blockexplorer.app;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.boot.context.properties.EnableConfigurationProperties;
import org.springframework.web.bind.annotation.RestController;

@SpringBootApplication
@RestController
@EnableConfigurationProperties(ConfigProperties.class)
public class BlockExplorerMain {

    public static void main(String[] args) {
        SpringApplication.run(BlockExplorerMain.class, args);
    }
}
            