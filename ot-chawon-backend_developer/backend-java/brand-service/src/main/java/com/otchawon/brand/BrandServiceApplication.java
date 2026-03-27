package com.otchawon.brand;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.cloud.openfeign.EnableFeignClients;

@SpringBootApplication
@EnableFeignClients
public class BrandServiceApplication {

    public static void main(String[] args) {
        SpringApplication.run(BrandServiceApplication.class, args);
    }
}
