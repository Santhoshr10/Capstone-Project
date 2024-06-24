package com.bej.authentication.commander.repository;
 import com.bej.authentication.domain.User;
 import com.bej.authentication.repository.UserRepository;
 import org.junit.jupiter.api.AfterEach;
 import org.junit.jupiter.api.BeforeEach;
 import org.junit.jupiter.api.Test;

 import org.springframework.beans.factory.annotation.Autowired;

 import org.springframework.boot.test.autoconfigure.jdbc.AutoConfigureTestDatabase;
 import org.springframework.boot.test.autoconfigure.orm.jpa.DataJpaTest;

 import static org.junit.jupiter.api.Assertions.assertEquals;

@DataJpaTest
@AutoConfigureTestDatabase(replace = AutoConfigureTestDatabase.Replace.NONE)

 public class UserRepositoryTest {

     @Autowired
     private UserRepository userRepository;

     private User user;

     @BeforeEach
     public void setUp() throws Exception {
         user = new User("sandy@gmail.com", "111");

     }

     @AfterEach
     public void tearDown() throws Exception {
         user = null;

 }


     @Test
     public void testSaveUserSuccess() {
         userRepository.save(user);
         User object = userRepository.findById(user.getEmail()).get();
         assertEquals(user.getEmail(), object.getEmail());
     }

     @Test
     public void testLoginUserSuccess() {
         userRepository.save(user);
         User object = userRepository.findById(user.getEmail()).get();
         assertEquals(user.getEmail(), object.getEmail());
     }

 }
