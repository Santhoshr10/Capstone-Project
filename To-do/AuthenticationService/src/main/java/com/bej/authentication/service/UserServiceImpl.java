package com.bej.authentication.service;

import com.bej.authentication.domain.User;
import com.bej.authentication.exception.UserAlreadyExistsException;
import com.bej.authentication.exception.InvalidCredentialsException;
import com.bej.authentication.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

@Service
public class UserServiceImpl implements IUserService {

private UserRepository userRepository;

    @Autowired
    public UserServiceImpl(UserRepository userRepository){
        this.userRepository=userRepository;
    }

    @Override
    public User saveUser(User user) throws UserAlreadyExistsException {

       if(userRepository.findById(user.getEmail()).isPresent()){
           throw new UserAlreadyExistsException();
       }
        return userRepository.save(user);
    }

    @Override
    public User getUserByEmailAndPassword(String email, String password) throws InvalidCredentialsException {

        User user=userRepository.findByEmailAndPassword(email,password);
        if(user==null){
            throw  new InvalidCredentialsException();
        }
        return user;
    }

}
