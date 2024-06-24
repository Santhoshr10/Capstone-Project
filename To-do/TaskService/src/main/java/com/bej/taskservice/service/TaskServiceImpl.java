package com.bej.taskservice.service;

import com.bej.taskservice.Proxy.UserProxy;
import com.bej.taskservice.domain.Task;
import com.bej.taskservice.domain.TaskStatus;
import com.bej.taskservice.domain.User;
import com.bej.taskservice.exception.TaskAlreadyExistsException;
import com.bej.taskservice.exception.TaskNotFoundException;
import com.bej.taskservice.exception.UserAlreadyExistsException;
import com.bej.taskservice.exception.UserNotFoundException;

import com.bej.taskservice.repository.UserTaskRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.util.*;
import java.util.stream.Collectors;

@Service
public class TaskServiceImpl implements ITaskService {


    private final UserTaskRepository userTaskRepository;
    private final UserProxy userProxy;
    @Autowired
    public TaskServiceImpl(UserTaskRepository userTaskRepository, UserProxy userProxy){
        this.userTaskRepository=userTaskRepository;
        this.userProxy=userProxy;
    }

    @Override
    public User registerUser(User user) throws UserAlreadyExistsException {
        Optional<User> existingUser = userTaskRepository.findById(user.getEmail());
        if (existingUser.isPresent()) {
            throw new UserAlreadyExistsException();
        }
        ResponseEntity<?> response = userProxy.saveCustomer(user);
        if (response.getStatusCode().is2xxSuccessful()) {
            return userTaskRepository.save(user);
        } else {

            throw new RuntimeException("Failed to save user to external service");
        }
    }

    @Override
    public User getUserById(String userId) throws UserNotFoundException {
        Optional<User> userOptional = userTaskRepository.findById(userId);
        if (userOptional.isPresent()) {
            return userOptional.get();
        } else {
            String email = null;
            throw new UserNotFoundException("User not found with email: " + email);
        }
    }

    @Override
    public Task addTaskForUser(Task task, String email) throws TaskAlreadyExistsException, UserNotFoundException, IllegalArgumentException {
        Optional<User> optionalUser = userTaskRepository.findById(email);
        if (optionalUser.isEmpty()) {
            throw new UserNotFoundException("User not found with email: " + email);
        }
        User user = optionalUser.get();
        List<Task> tasks = user.getTaskList();
        if (tasks == null) {
            tasks = new ArrayList<>();
        }
        if (tasks.stream().anyMatch(t -> t.getTaskId().equals(task.getTaskId()))) {
            throw new TaskAlreadyExistsException();
        }

        LocalDate currentDate = LocalDate.now();
        if (task.getDueDate().isBefore(currentDate)) {
            task.setDueDate(currentDate);
        }

        task.setTaskId(UUID.randomUUID().toString());
        tasks.add(task);
        user.setTaskList(tasks);
        userTaskRepository.save(user);
        return task;
    }


    @Override
    public List<Task> getAllTasksForUser(String email) throws UserNotFoundException {
        Optional<User> optionalUser = userTaskRepository.findById(email);
        if (optionalUser.isEmpty()) {
            throw new UserNotFoundException("User not found with email: " + email);
        }
        User user = optionalUser.get();
        return user.getTaskList().stream()
                .filter(task -> !task.isArchived())
                .collect(Collectors.toList());
    }

    @Override
    public ResponseEntity<String> deleteTask(String email, String taskId) throws TaskNotFoundException, UserNotFoundException {
        Optional<User> optionalUser = userTaskRepository.findById(email);
        if (optionalUser.isEmpty()) {
            throw new UserNotFoundException("User not found with email: " + email);
        }
        User user = optionalUser.get();
        List<Task> tasks = user.getTaskList();
        if (tasks == null || tasks.isEmpty()) {
            throw new TaskNotFoundException();
        }
        boolean found = false;
        for (Task task : tasks) {
            if (task.getTaskId().equals(taskId)) {
                tasks.remove(task);
                found = true;
                if (task.getTaskStatus() == TaskStatus.PENDING) {
                    task.setTaskStatus(TaskStatus.IN_PROGRESS);
                } else {
                    task.setTaskStatus(TaskStatus.COMPLETED);
                }
                break;
            }
        }
        if (!found) {
            throw new TaskNotFoundException();
        }
        user.setTaskList(tasks);
        userTaskRepository.save(user);
        return ResponseEntity.ok().body("Task deleted successfully.");
    }


    @Override
    public Task updateTaskForUser(String email, String taskId, Task updatedTask) throws UserNotFoundException, TaskNotFoundException, TaskAlreadyExistsException {
        Optional<User> optionalUser = userTaskRepository.findById(email);
        if (optionalUser.isEmpty()) {
            throw new UserNotFoundException("User not found with email: " + email);
        }
        User user = optionalUser.get();
        List<Task> tasks = user.getTaskList();
        if (tasks == null || tasks.isEmpty()) {
            throw new TaskNotFoundException();
        }
        boolean taskUpdated = false;
        for (Task task : tasks) {
            if (task.getTaskId().equals(taskId)) {
                if (!updatedTask.getDueDate().isBefore(LocalDate.now())) {

                    task.setTaskName(updatedTask.getTaskName());
                    task.setDueDate(updatedTask.getDueDate());
                    task.setTaskDescription(updatedTask.getTaskDescription());

                    if (updatedTask.getTaskStatus() == null) {
                        updatedTask.setTaskStatus(task.getTaskStatus());
                    }

                    if (updatedTask.getTaskPriority() == null) {
                        updatedTask.setTaskPriority(task.getTaskPriority());
                    }
                    taskUpdated = true;
                    break;
                } else {
                    throw new IllegalArgumentException("Due date should be today's date or in the future.");
                }
            }
        }
        if (!taskUpdated) {
            throw new TaskNotFoundException();
        }
        userTaskRepository.save(user);
        return updatedTask;
    }






    @Override
    public Task archiveTask(String email, String taskId) throws TaskNotFoundException, UserNotFoundException {
        Optional<User> optionalUser = userTaskRepository.findById(email);
        if (optionalUser.isEmpty()) {
            throw new UserNotFoundException("User not found with email: " + email);
        }
        User user = optionalUser.get();
        List<Task> tasks = user.getTaskList();
        if (tasks == null || tasks.isEmpty()) {
            throw new TaskNotFoundException();
        }
        Task taskToArchive = null;
        for (Task task : tasks) {
            if (task.getTaskId().equals(taskId)) {
                taskToArchive = task;
                break;
            }
        }
        if (taskToArchive == null) {
            throw new TaskNotFoundException();
        }
        taskToArchive.setArchived(true);

        userTaskRepository.save(user);
        return taskToArchive;
    }

    @Override
    public Task trashed(String email, String taskId) throws TaskNotFoundException, UserNotFoundException {
        Optional<User> optionalUser = userTaskRepository.findById(email);
        if (optionalUser.isEmpty()) {
            throw new UserNotFoundException("User not found with email: " + email);
        }
        User user = optionalUser.get();
        List<Task> tasks = user.getTaskList();
        if (tasks == null || tasks.isEmpty()) {
            throw new TaskNotFoundException();
        }
        Task taskToTrash = null;
        for (Task task : tasks) {
            if (task.getTaskId().equals(taskId)) {
                taskToTrash = task;
                break;
            }
        }
        if (taskToTrash == null) {
            throw new TaskNotFoundException();
        }
        taskToTrash.setTrashed(true);
        userTaskRepository.save(user);
        return taskToTrash;
    }


    @Override
    public List<Task> getArchivedTasksForUser(String email) throws Exception {
        List<Task> archivedTasks = new ArrayList<>();
        Optional<User> userOptional = userTaskRepository.findById(email);
        if (userOptional.isPresent()) {
            User user = userOptional.get();
            if (user.getTaskList() != null) {
                for (Task task : user.getTaskList()) {
                    if (task.isArchived() && !task.isTrashed()) {
                        archivedTasks.add(task);
                    }
                }
            }
        }
        return archivedTasks;
    }




    @Override
    public Task unarchiveTask(String email, String taskId) throws TaskNotFoundException, UserNotFoundException {
        Optional<User> optionalUser = userTaskRepository.findById(email);
        if (optionalUser.isEmpty()) {
            throw new UserNotFoundException("User not found with email: " + email);
        }
        User user = optionalUser.get();
        List<Task> tasks = user.getTaskList();
        if (tasks == null || tasks.isEmpty()) {
            throw new TaskNotFoundException();
        }
        Task taskToUnarchive = null;
        for (Task task : tasks) {
            if (task.getTaskId().equals(taskId)) {
                taskToUnarchive = task;
                break;
            }
        }
        if (taskToUnarchive == null) {
            throw new TaskNotFoundException();
        }
        taskToUnarchive.setArchived(false);
        userTaskRepository.save(user);
        return taskToUnarchive;
    }

    @Override
    public Task restoreTaskFromTrash(String email, String taskId) throws TaskNotFoundException, UserNotFoundException {
        Optional<User> optionalUser = userTaskRepository.findById(email);
        if (optionalUser.isEmpty()) {
            throw new UserNotFoundException("User not found with email: " + email);
        }
        User user = optionalUser.get();
        List<Task> tasks = user.getTaskList();
        if (tasks == null || tasks.isEmpty()) {
            throw new TaskNotFoundException();
        }
        Task taskToRestore = null;
        for (Task task : tasks) {
            if (task.getTaskId().equals(taskId)) {
                taskToRestore = task;
                break;
            }
        }
        if (taskToRestore == null) {
            throw new TaskNotFoundException();
        }
        taskToRestore.setTrashed(false);
        userTaskRepository.save(user);
        return taskToRestore;
    }

    @Override
    public List<Task> getTrashedTasks(String email) throws Exception {
        List<Task> trashedTasks = new ArrayList<>();
        Optional<User> userOptional = userTaskRepository.findById(email);
        if (userOptional.isPresent()) {
            User user = userOptional.get();
            if (user.getTaskList() != null) {
                for (Task task : user.getTaskList()) {
                    if (task.isTrashed()) {
                        trashedTasks.add(task);
                    }
                }
            }
        }
        return trashedTasks;
    }
    @Override
    public Task updateTaskStatus(String email, String taskId, Task task) throws TaskNotFoundException, UserNotFoundException, TaskAlreadyExistsException {
        Optional<User> optionalUser = userTaskRepository.findById(email);
        if (optionalUser.isEmpty()) {
            throw new UserNotFoundException("User not found with email: " + email);
        }
        User user = optionalUser.get();
        List<Task> tasks = user.getTaskList();
        if (tasks == null || tasks.isEmpty()) {
            throw new TaskNotFoundException();
        }
        for (int i = 0; i < tasks.size(); i++) {
            Task t = tasks.get(i);
            if (t.getTaskId().equals(taskId)) {

                t.setTaskStatus(task.getTaskStatus());
                userTaskRepository.save(user);
                return t;
            }
        }
        throw new TaskNotFoundException();
    }

    @Override
    public List<Task> getInProgressTasksForUser(String email) throws UserNotFoundException {
        Optional<User> optionalUser = userTaskRepository.findById(email);
        if (optionalUser.isEmpty()) {
            throw new UserNotFoundException("User not found with email: " + email);
        }
        User user = optionalUser.get();
        return user.getTaskList().stream()
                .filter(task -> !task.isArchived() && !task.isTrashed() && task.getTaskStatus() == TaskStatus.IN_PROGRESS)
                .collect(Collectors.toList());
    }

    @Override
    public List<Task> getCompletedTasksForUser(String email) throws UserNotFoundException {
        Optional<User> optionalUser = userTaskRepository.findById(email);
        if (optionalUser.isEmpty()) {
            throw new UserNotFoundException("User not found with email: " + email);
        }
        User user = optionalUser.get();
        return user.getTaskList().stream()
                .filter(task -> !task.isArchived() && !task.isTrashed() && task.getTaskStatus() == TaskStatus.COMPLETED)
                .collect(Collectors.toList());
    }

    @Override
    public List<Task> getPendingTasksForUser(String email) throws UserNotFoundException {
        Optional<User> optionalUser = userTaskRepository.findById(email);
        if (optionalUser.isEmpty()) {
            throw new UserNotFoundException("User not found with email: " + email);
        }
        User user = optionalUser.get();
        return user.getTaskList().stream()
                .filter(task -> !task.isArchived() && !task.isTrashed() && task.getTaskStatus() == TaskStatus.PENDING)
                .collect(Collectors.toList());
    }


    @Override
    public Task updateTaskPriority(String email, String taskId, String taskPriority) throws TaskNotFoundException, UserNotFoundException {
        Optional<User> optionalUser = userTaskRepository.findById(email);
        if (optionalUser.isEmpty()) {
            throw new UserNotFoundException("User not found with email: " + email);
        }
        User user = optionalUser.get();
        List<Task> tasks = user.getTaskList();
        if (tasks == null || tasks.isEmpty()) {
            throw new TaskNotFoundException();
        }
        for (Task task : tasks) {
            if (task.getTaskId().equals(taskId)) {

                task.setTaskPriority(taskPriority);

                userTaskRepository.save(user);
                return task;
            }
        }
        throw new TaskNotFoundException();
    }


}
