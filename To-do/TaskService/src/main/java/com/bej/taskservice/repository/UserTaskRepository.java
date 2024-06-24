package com.bej.taskservice.repository;

import com.bej.taskservice.domain.User;
import org.springframework.data.mongodb.repository.MongoRepository;

public interface UserTaskRepository extends MongoRepository<User,String> {

}
