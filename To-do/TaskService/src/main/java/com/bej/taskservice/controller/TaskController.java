package com.bej.taskservice.controller;

import com.bej.taskservice.domain.Task;
import com.bej.taskservice.domain.TaskStatus;
import com.bej.taskservice.domain.User;
import com.bej.taskservice.exception.TaskAlreadyExistsException;
import com.bej.taskservice.exception.TaskNotFoundException;
import com.bej.taskservice.exception.UserAlreadyExistsException;
import com.bej.taskservice.exception.UserNotFoundException;
import com.bej.taskservice.service.TaskServiceImpl;
import io.jsonwebtoken.Claims;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import javax.servlet.http.HttpServletRequest;
import java.util.List;
import java.util.Map;

@RestController

@RequestMapping("/api/v2")
public class TaskController {
    private final TaskServiceImpl taskService;

    @Autowired
    public TaskController(TaskServiceImpl taskService){
        this.taskService = taskService;
    }

    @PostMapping("/register")
    public ResponseEntity<?> registerUser(@RequestBody User user) throws UserAlreadyExistsException {
        try {
            taskService.registerUser(user);
            return new ResponseEntity<>(user, HttpStatus.CREATED);
        } catch (UserAlreadyExistsException e) {
            throw new UserAlreadyExistsException();
        } catch (Exception e){
            return new ResponseEntity<>(e.getMessage(), HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
    @GetMapping("/user/{userId}")
    public ResponseEntity<?> getUserById(@PathVariable String userId) {
        try {
            User user = taskService.getUserById(userId);
            return ResponseEntity.ok(user);
        } catch (UserNotFoundException e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(e.getMessage());
        }
    }

    @PostMapping("/user/task")
    public ResponseEntity<?> addTask(@RequestBody Task task, HttpServletRequest request) throws UserNotFoundException, TaskAlreadyExistsException {
        String email = null;
        try {
            Claims claims = (Claims) request.getAttribute("claims");
            email = claims.getSubject();
            if (task.getTaskStatus() == null) {
                task.setTaskStatus(TaskStatus.PENDING);
            }
            if (task.getTaskPriority() == null) {
                task.setTaskPriority("Low");
            }
            Task addedTask = taskService.addTaskForUser(task, email);
            return new ResponseEntity<>(addedTask, HttpStatus.CREATED);
        } catch (UserNotFoundException e) {
            throw new UserNotFoundException("User not found with email: " + email);
        } catch (TaskAlreadyExistsException e) {
            throw new TaskAlreadyExistsException();
        } catch (Exception e) {
            return new ResponseEntity<>(e.getMessage(), HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    @GetMapping("/user/tasks")
    public ResponseEntity<?> getAllTasks(HttpServletRequest request) {
        try {
            Claims claims = (Claims) request.getAttribute("claims");
            String email = claims.getSubject();
            List<Task> tasks = taskService.getAllTasksForUser(email);
            return new ResponseEntity<>(tasks, HttpStatus.OK);
        } catch (Exception e){
            return new ResponseEntity<>(e.getMessage(), HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    @DeleteMapping("/user/task/{taskId}")
    public ResponseEntity<?> deleteTask(@PathVariable String taskId, HttpServletRequest request) throws TaskNotFoundException, UserNotFoundException {
        String email = null;
        try {
            Claims claims = (Claims) request.getAttribute("claims");
            email = claims.getSubject();
            return new ResponseEntity<>(taskService.deleteTask(email, taskId), HttpStatus.OK);
        } catch (UserNotFoundException e) {
            throw new UserNotFoundException("User not found with email: " + email);
        } catch (TaskNotFoundException e) {
            throw new TaskNotFoundException();
        } catch (Exception e) {
            return new ResponseEntity<>(e.getMessage(), HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    @GetMapping("/user/tasks/trash")
    public ResponseEntity<List<Task>> getTrashedTasks(HttpServletRequest request) {
        try {
            Claims claims = (Claims) request.getAttribute("claims");
            String email = claims.getSubject();
            List<Task> trashedTasks = taskService.getTrashedTasks(email);
            return ResponseEntity.ok().body(trashedTasks);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(null);
        }
    }

    @PutMapping("/user/task/{taskId}")
    public ResponseEntity<?> updateTask(@PathVariable String taskId, @RequestBody Task task, HttpServletRequest request) throws TaskAlreadyExistsException, TaskNotFoundException, UserNotFoundException {
        String email = null;
        try {
            Claims claims = (Claims) request.getAttribute("claims");
            email = claims.getSubject();

            Task updatedTask = taskService.updateTaskForUser(email, taskId, task);

            updatedTask.setTaskId(taskId);

            return new ResponseEntity<>(updatedTask, HttpStatus.OK);
        } catch (UserNotFoundException e) {
            throw new UserNotFoundException("User not found with email: " + email);
        } catch (TaskNotFoundException e) {
            throw new TaskNotFoundException();
        } catch (TaskAlreadyExistsException e) {
            throw new TaskAlreadyExistsException();
        } catch (Exception e) {
            return new ResponseEntity<>(e.getMessage(), HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }



    @PutMapping("/user/task/archive/{taskId}")
    public ResponseEntity<?> archiveTask(@PathVariable String taskId, HttpServletRequest request) {
        try {
            Claims claims = (Claims) request.getAttribute("claims");
            String email = claims.getSubject();
            Task archivedTask = taskService.archiveTask(email, taskId);
            return ResponseEntity.ok().body(archivedTask);
        } catch (UserNotFoundException | TaskNotFoundException e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(e.getMessage());
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(e.getMessage());
        }
    }


    @GetMapping("/user/tasks/archive")
    public ResponseEntity<List<Task>> getArchivedTasksForUser(HttpServletRequest request) {
        try {
            Claims claims = (Claims) request.getAttribute("claims");
            String email = claims.getSubject();
            List<Task> archivedTasks = taskService.getArchivedTasksForUser(email);
            return ResponseEntity.ok().body(archivedTasks);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(null);
        }
    }

    @PutMapping("/user/task/unarchive/{taskId}")
    public ResponseEntity<?> unarchiveTask(@PathVariable String taskId, HttpServletRequest request) {
        try {
            Claims claims = (Claims) request.getAttribute("claims");
            String email = claims.getSubject();
            Task unarchivedTask = taskService.unarchiveTask(email, taskId);
            return ResponseEntity.ok().body(unarchivedTask);
        } catch (UserNotFoundException | TaskNotFoundException e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(e.getMessage());
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(e.getMessage());
        }
    }

    @PutMapping("/user/task/restore/{taskId}")
    public ResponseEntity<?> restoreTaskFromTrash(@PathVariable String taskId, HttpServletRequest request) {
        try {
            Claims claims = (Claims) request.getAttribute("claims");
            String email = claims.getSubject();
            Task restoredTask = taskService.restoreTaskFromTrash(email, taskId);
            return ResponseEntity.ok().body(restoredTask);
        } catch (UserNotFoundException | TaskNotFoundException e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(e.getMessage());
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(e.getMessage());
        }
    }

    @PutMapping ("/user/task/trash/{taskId}")
    public ResponseEntity<?> moveTrash(@PathVariable String taskId, HttpServletRequest request) {
        try {
            Claims claims = (Claims) request.getAttribute("claims");
            String email = claims.getSubject();
            Task trashedTask = taskService.trashed(email, taskId);
            return ResponseEntity.ok().body(trashedTask);
        } catch (UserNotFoundException | TaskNotFoundException e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(e.getMessage());
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(e.getMessage());
        }
    }

    @PutMapping("/user/task/updateTaskStatus/{taskId}")
    public ResponseEntity<?> updateTaskStatus(@PathVariable String taskId, @RequestBody Task task, HttpServletRequest request) throws TaskAlreadyExistsException, TaskNotFoundException, UserNotFoundException {
        String email = null;
        try {
            Claims claims = (Claims) request.getAttribute("claims");
            email = claims.getSubject();
            return new ResponseEntity<>(taskService.updateTaskStatus(email, taskId, task), HttpStatus.OK);
        } catch (UserNotFoundException e) {
            throw new UserNotFoundException("User not found with email: " + email);
        } catch (TaskNotFoundException e) {
            throw new TaskNotFoundException();
        } catch (TaskAlreadyExistsException e) {
            throw new TaskAlreadyExistsException();
        } catch (Exception e) {
            return new ResponseEntity<>(e.getMessage(), HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    @GetMapping("user/tasks/in-progress")
    public ResponseEntity<List<Task>> getInProgressTasksForUser(@PathVariable String email) {
        try {
            List<Task> inProgressTasks = taskService.getAllTasksForUser(email);
            return new ResponseEntity<>(inProgressTasks, HttpStatus.OK);
        } catch (UserNotFoundException e) {
            return new ResponseEntity<>(HttpStatus.NOT_FOUND);
        }
    }

    @GetMapping("user/tasks/completed")
    public ResponseEntity<List<Task>> getCompletedTasksForUser(@PathVariable String email) {
        try {
            List<Task> completedTasks = taskService.getCompletedTasksForUser(email);
            return new ResponseEntity<>(completedTasks, HttpStatus.OK);
        } catch (UserNotFoundException e) {
            return new ResponseEntity<>(HttpStatus.NOT_FOUND);
        }
    }

    @GetMapping("user/tasks/pending")
    public ResponseEntity<List<Task>> getPendingTasksForUser(@PathVariable String email) {
        try {
            List<Task> pendingTasks = taskService.getPendingTasksForUser(email);
            return new ResponseEntity<>(pendingTasks, HttpStatus.OK);
        } catch (UserNotFoundException e) {
            return new ResponseEntity<>(HttpStatus.NOT_FOUND);
        }
    }

    @PutMapping("/user/task/priority/{taskId}")
    public ResponseEntity<?> updateTaskPriority(@PathVariable String taskId, @RequestBody Map<String, String> requestBody, HttpServletRequest request) {
        String email = null;
        try {
            Claims claims = (Claims) request.getAttribute("claims");
            email = claims.getSubject();

            String taskPriority = requestBody.get("taskPriority");
            Task updatedTask = taskService.updateTaskPriority(email, taskId, taskPriority);
            return ResponseEntity.ok(updatedTask);
        } catch (UserNotFoundException | TaskNotFoundException e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(e.getMessage());
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(e.getMessage());
        }
    }

}