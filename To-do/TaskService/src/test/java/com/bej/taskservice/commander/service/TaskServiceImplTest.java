package com.bej.taskservice.commander.service;

import com.bej.taskservice.domain.Task;
import com.bej.taskservice.domain.TaskStatus;
import com.bej.taskservice.domain.User;

import com.bej.taskservice.repository.UserTaskRepository;
import com.bej.taskservice.service.TaskServiceImpl;
import org.junit.jupiter.api.AfterEach;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;


import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.mockito.ArgumentMatchers.anyString;
import static org.mockito.Mockito.*;


import java.time.LocalDate;
import java.util.Arrays;
import java.util.Date;
import java.util.List;
import java.util.Optional;


@ExtendWith(MockitoExtension.class)
class TaskServiceImplTest {

    @Mock
    private UserTaskRepository userTaskRepository;

    @InjectMocks
    private TaskServiceImpl taskService;
    private Task task1, task2;
    List<Task> taskList;
    User user;

    @BeforeEach
    void setUp() {

        task1 = new Task("track1", LocalDate.of(2024, 02, 15),"Project1","Low", TaskStatus.COMPLETED, false,false);
        task2 = new Task("track2",LocalDate.of(2024, 02, 20),"Project2","Medium", TaskStatus.PENDING,true,false);
        taskList = Arrays.asList(task1, task2);
        user = new User();
        user.setUserName("Abhishek");
        user.setEmail("Abhi12@gmail.com");
        user.setTaskList(taskList);
    }
    @AfterEach
    void tearDown() {
        task1 = null;
        task2 = null;
        user = null;
    }

    @Test
    public void getAllUserTasksFromWishListSuccess() throws Exception {
        when(userTaskRepository.findById(anyString())).thenReturn(Optional.ofNullable(user));
        when(userTaskRepository.findById(anyString())).thenReturn(Optional.of(user));
        assertEquals(taskList,taskService.getAllTasksForUser(user.getEmail()));
        verify(userTaskRepository,times(1)).findById(anyString());

    }
}

