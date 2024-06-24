package com.bej.authentication.controller;

import com.bej.authentication.exception.UserAlreadyExistsException;
import com.bej.authentication.exception.InvalidCredentialsException;
import com.bej.authentication.security.JWTSecurityTokenGeneratorImpl;
import com.bej.authentication.security.SecurityTokenGenerator;
import com.bej.authentication.service.IUserService;
import com.bej.authentication.domain.User;
import com.bej.authentication.service.UserServiceImpl;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping("/api/v1")
public class UserController {
    private UserServiceImpl userService;
    private ResponseEntity responseEntity;
    private JWTSecurityTokenGeneratorImpl jwtSecurityTokenGenerator;

    @Autowired
    public UserController(UserServiceImpl userService,JWTSecurityTokenGeneratorImpl jwtSecurityTokenGenerator){
        this.userService=userService;
        this.jwtSecurityTokenGenerator=jwtSecurityTokenGenerator;
    }

    @PostMapping("/saveCustomer")
    public ResponseEntity<?> saveCustomer(@RequestBody User user) throws UserAlreadyExistsException {
        try {
           User user1= userService.saveUser(user);
           responseEntity=new ResponseEntity(user,HttpStatus.CREATED);
        } catch (UserAlreadyExistsException e) {
            throw new UserAlreadyExistsException();
        }catch (Exception e){
            return new ResponseEntity<>(e.getMessage(),HttpStatus.INTERNAL_SERVER_ERROR);
        }
        return responseEntity;
    }
    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody User user) throws InvalidCredentialsException {
        User user1=userService.getUserByEmailAndPassword(user.getEmail(), user.getPassword());
        if(user1==null){
            throw new InvalidCredentialsException();
        }
        String token=jwtSecurityTokenGenerator.createToken(user1);
        Map<String,String> data=new HashMap<>();
        data.put("token",token);
        data.put("Email", user1.getEmail());
        return ResponseEntity.ok().body(data);
    }
}
