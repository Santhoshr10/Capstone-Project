package com.bej.taskservice.commander.repository;

import com.bej.taskservice.domain.Task;
import com.bej.taskservice.domain.TaskStatus;
import com.bej.taskservice.domain.User;
import com.bej.taskservice.repository.UserTaskRepository;
import org.junit.jupiter.api.AfterEach;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;

import org.springframework.boot.test.autoconfigure.data.mongo.DataMongoTest;


import java.time.LocalDate;
import java.util.Arrays;
import java.util.Date;
import java.util.List;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;

@DataMongoTest
class UserTaskRepositoryTest {

    @Autowired
    private UserTaskRepository userTaskRepository;
    private Task task1, task2;
    private User user;
    List<Task> taskList;

    @BeforeEach
    void setUp() {
        task1 = new Task("task1", LocalDate.of(2024, 02, 15),"Project1","High" , TaskStatus.COMPLETED, true, false);
        task2 = new Task("task2",LocalDate.of(2024, 02, 20),"Project2","Low", TaskStatus.PENDING, false, false);
        user = new User();
        user.setUserName("Ramu");
        user.setEmail("Ramu123@gmail.com");
        taskList = Arrays.asList(task1,task2);
        user.setTaskList(taskList);

    }

    @AfterEach
    void tearDown() {
        task1 = task2 = null;
        userTaskRepository.deleteAll();
    }

    @Test
    void givenUserTaskToSaveShouldReturnSavedTask() {
        userTaskRepository.save(user);
        User user1 = userTaskRepository.findById(user.getEmail()).get();

        assertNotNull(user1);
        assertEquals(user1.getEmail(), user.getEmail());
    }
    @Test
    public void givenTaskToDeleteShouldDeleteTask() {
        userTaskRepository.insert(user);
        User user1 = userTaskRepository.findById(user.getEmail()).get();
        userTaskRepository.delete(user1);
        assertEquals(Optional.empty(), userTaskRepository.findById(user.getEmail()));
    }







}

