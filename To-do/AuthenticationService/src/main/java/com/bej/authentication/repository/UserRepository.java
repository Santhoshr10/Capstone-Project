package com.bej.authentication.repository;

import com.bej.authentication.domain.User;
import org.springframework.data.jpa.repository.JpaRepository;

public interface UserRepository extends JpaRepository<User, String> {
    User findByEmailAndPassword(String email, String password);
}
