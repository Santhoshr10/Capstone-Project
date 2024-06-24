package com.bej.taskservice.service;

import com.bej.taskservice.domain.Task;
import com.bej.taskservice.domain.TaskStatus;
import com.bej.taskservice.domain.User;
import com.bej.taskservice.exception.TaskAlreadyExistsException;
import com.bej.taskservice.exception.TaskNotFoundException;
import com.bej.taskservice.exception.UserAlreadyExistsException;
import com.bej.taskservice.exception.UserNotFoundException;
import org.springframework.http.ResponseEntity;

import java.util.List;

public interface ITaskService {
    User registerUser(User user) throws UserAlreadyExistsException;
    Task addTaskForUser(Task task, String email) throws TaskAlreadyExistsException, UserNotFoundException;
    List<Task> getAllTasksForUser(String email) throws UserNotFoundException;
    ResponseEntity<String> deleteTask(String email, String taskId) throws TaskNotFoundException, UserNotFoundException;
    Task updateTaskForUser(String email, String taskId, Task task) throws UserNotFoundException, TaskNotFoundException, TaskAlreadyExistsException;
    Task archiveTask(String email, String taskId) throws TaskNotFoundException, UserNotFoundException;
    Task trashed(String email, String taskId) throws TaskNotFoundException, UserNotFoundException;
    List<Task> getArchivedTasksForUser(String email) throws Exception;
    User getUserById(String userId) throws UserNotFoundException;
    Task unarchiveTask(String email, String taskId) throws Exception;
    Task restoreTaskFromTrash(String email, String taskId) throws Exception;
    List<Task> getTrashedTasks(String email) throws Exception;
    Task updateTaskStatus(String email, String taskId, Task task) throws TaskNotFoundException, UserNotFoundException, TaskAlreadyExistsException;
    List<Task> getInProgressTasksForUser(String email) throws UserNotFoundException;

    List<Task> getCompletedTasksForUser(String email) throws UserNotFoundException;

    List<Task> getPendingTasksForUser(String email) throws UserNotFoundException;

    Task updateTaskPriority(String email, String taskId, String taskPriority) throws TaskNotFoundException, UserNotFoundException;
}

