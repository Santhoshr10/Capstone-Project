package com.bej.taskservice.domain;

import org.springframework.data.annotation.Id;

import java.time.LocalDate;
import java.util.Date;
import java.util.UUID;

public class Task {
    @Id
    private String taskId;
    private String taskName;
    private LocalDate dueDate;
    private String taskDescription;
    private String taskPriority;
    private boolean isArchived;
    private TaskStatus taskStatus;

    private boolean isTrashed;
    public Task(TaskStatus taskStatus) {
        this.taskStatus = taskStatus;
    }

    public Task(String taskName, LocalDate dueDate, String taskDescription, String taskPriority, TaskStatus taskStatus  , boolean isArchived, boolean isTrashed) {
        this.taskId = UUID.randomUUID().toString();
        this.taskName = taskName;
        this.dueDate = dueDate;
        this.taskDescription = taskDescription;
        this.taskPriority = taskPriority;
        this.isArchived = false;
        this.taskStatus = taskStatus;
        this.isTrashed = false;
    }

    public Task() {
    }

    @Override
    public String toString() {
        return "Task{" +
                "taskId='" + taskId + '\'' +
                ", taskName='" + taskName + '\'' +
                ", dueDate=" + dueDate +
                ", taskDescription='" + taskDescription + '\'' +
                ", taskPriority='" + taskPriority + '\'' +
                ", isArchived=" + isArchived +
                ", taskStatus=" + taskStatus +
                ", isTrashed=" + isTrashed +
                '}';
    }

    public String getTaskId() {
        return taskId;
    }

    public void setTaskId(String taskId) {
        this.taskId = taskId;
    }

    public String getTaskName() {
        return taskName;
    }



    public void setTaskName(String taskName) {
        this.taskName = taskName;
    }

    public LocalDate getDueDate() {
        return dueDate;
    }

    public void setDueDate(LocalDate dueDate) {
        this.dueDate = dueDate;
    }

    public String getTaskDescription() {
        return taskDescription;
    }

    public void setTaskDescription(String taskDescription) {
        this.taskDescription = taskDescription;
    }

    public String getTaskPriority() {
        return taskPriority;
    }

    public void setTaskPriority(String taskPriority) {
        this.taskPriority = taskPriority;
    }


    public boolean isArchived() {
        return isArchived;
    }

    public void setArchived(boolean archived) {
        isArchived = archived;
    }

    public TaskStatus getTaskStatus() {
        return taskStatus;
    }

    public void setTaskStatus(TaskStatus taskStatus) {
        this.taskStatus = taskStatus;
    }

    public boolean isTrashed() {
        return isTrashed;
    }

    public void setTrashed(boolean trashed) {
        isTrashed = trashed;
    }
}