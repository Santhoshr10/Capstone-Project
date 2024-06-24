package com.bej.taskservice.Proxy;

import com.bej.taskservice.domain.User;
import org.springframework.cloud.openfeign.FeignClient;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;

@FeignClient(name = "authentication-service",url = "localhost:8083")
public interface UserProxy {
    @PostMapping("/api/v1/saveCustomer")
     ResponseEntity<?> saveCustomer(@RequestBody User user);

}
