package com.bej.taskservice.commander.controller;

import com.bej.taskservice.controller.TaskController;
import com.bej.taskservice.domain.Task;
import com.bej.taskservice.domain.TaskStatus;
import com.bej.taskservice.domain.User;
import com.bej.taskservice.exception.UserAlreadyExistsException;
import com.bej.taskservice.service.TaskServiceImpl;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.junit.jupiter.api.AfterEach;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.http.MediaType;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.test.web.servlet.request.MockMvcRequestBuilders;
import org.springframework.test.web.servlet.result.MockMvcResultHandlers;
import org.springframework.test.web.servlet.setup.MockMvcBuilders;

import java.time.LocalDate;
import java.util.Arrays;
import java.util.Date;
import java.util.List;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

@ExtendWith(MockitoExtension.class)
class TaskControllerTest {

    private MockMvc mockMvc;

    @Mock
    private TaskServiceImpl taskService;

    @InjectMocks
    private TaskController taskController;

    private Task task1, task2;

    private User user;


    @BeforeEach
    void setUp() {

        task1 = new Task("task1", LocalDate.of(2024, 02, 15),"Project1","High", TaskStatus.COMPLETED, false, false);
        task2 = new Task("task2", LocalDate.of(2024, 02, 20),"Project2", "Medium" , TaskStatus.PENDING, true, false);
        List<Task> taskList = Arrays.asList(task1, task2);

        user = new User();
        user.setUserName("Santhosh");
        user.setEmail("santhosh23@gmail.com");
        user.setTaskList(taskList);

        mockMvc = MockMvcBuilders.standaloneSetup(taskController).build();
    }

    @AfterEach
    void tearDown() {
        user = null;
    }

    @Test
    public void registerUserSuccess() throws Exception {
        when(taskService.registerUser(any())).thenReturn(user);
        mockMvc.perform(MockMvcRequestBuilders.post("/api/v2/register")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(asJSONString(user)))
                .andExpect(status().isCreated())
                .andDo(MockMvcResultHandlers.print());
    }

    @Test
    public void registerUserFailure() throws Exception {
        doThrow(UserAlreadyExistsException.class).when(taskService).registerUser(any());
        mockMvc.perform(MockMvcRequestBuilders.post("/api/v2/register")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(asJSONString(user)))
                .andExpect(status().isConflict())
                .andDo(MockMvcResultHandlers.print());
    }

    private static String asJSONString(Object obj) {
        try {
            return new ObjectMapper().writeValueAsString(obj);
        } catch (Exception e) {
            throw new RuntimeException(e);
        }
    }
}
