import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { Task } from './task';
import { TaskStatus } from './task-status.enum';

@Injectable({
  providedIn: 'root'
})
export class TaskService {
  private baseUrl = 'http://localhost:9000/api/v2';

  constructor(private http: HttpClient) { }

  getAllTasks(): Observable<Task[]> {
    return this.http.get<Task[]>(`${this.baseUrl}/user/tasks`)
      .pipe(
        catchError(this.handleError)
      );
  }

  addTask(task: Task): Observable<Task> {
      return this.http.post<Task>(`${this.baseUrl}/user/task`, task)
        .pipe(
          catchError(this.handleError)
        );
  }

  updateTask(updatedTask: Task): Observable<Task> {
    return this.http.put<Task>(`${this.baseUrl}/user/task/${updatedTask.taskId}`, updatedTask)
      .pipe(
        catchError(this.handleError)
      );
  }

  updateTaskPriority(taskId: string, priority: string): Observable<Task> {
    return this.http.put<Task>(`${this.baseUrl}/user/task/priority/${taskId}`, { taskPriority: priority })
      .pipe(
        catchError(this.handleError)
      );
  }
  
  deleteTask(taskId: string): Observable<any> {
    return this.http.delete(`${this.baseUrl}/user/task/${taskId}`)
      .pipe(
        catchError(this.handleError)
      );
  }

  trashTask(taskId: string): Observable<any> {
    return this.http.put<Task>(`${this.baseUrl}/user/task/trash/${taskId}`, null)
      .pipe(
        catchError(this.handleError)
      );
  }


  archiveTask(taskId: string): Observable<Task> {
    return this.http.put<Task>(`${this.baseUrl}/user/task/archive/${taskId}`, null)
      .pipe(
        catchError(this.handleError)
      );
  }

  unarchiveTask(taskId: string): Observable<Task> {
    return this.http.put<Task>(`${this.baseUrl}/user/task/unarchive/${taskId}`, null)
      .pipe(
        catchError(this.handleError)
      );
  }  

  updateTaskStatus(taskId: string, newStatus: TaskStatus): Observable<Task> {
    return this.http.put<Task>(`${this.baseUrl}/user/task/updateTaskStatus/${taskId}`, { taskStatus: newStatus })
      .pipe(
        catchError(this.handleError)
      );
  }
  
  restoreTaskFromTrash(taskId: string): Observable<Task> {
    return this.http.put<Task>(`${this.baseUrl}/user/task/restore/${taskId}`, null)
      .pipe(
        catchError(this.handleError)
      );
  }

  getArchivedTasks(): Observable<Task[]> {
    return this.http.get<Task[]>(`${this.baseUrl}/user/tasks/archive`)
      .pipe(
        catchError(this.handleError)
      );
  }

  getTrashedTasks(): Observable<Task[]> {
    return this.http.get<Task[]>(`${this.baseUrl}/user/tasks/trash`)
      .pipe(
        catchError(this.handleError)
      );
  }


  getInProgressTasks(): Observable<Task[]> {
    return this.http.get<Task[]>(`${this.baseUrl}/user/tasks/in-progress`)
      .pipe(
        catchError(this.handleError)
      );
  }

  getCompletedTasks(): Observable<Task[]> {
    return this.http.get<Task[]>(`${this.baseUrl}/user/tasks/completed`)
      .pipe(
        catchError(this.handleError)
      );
  }

  getPendingTasks(): Observable<Task[]> {
    return this.http.get<Task[]>(`${this.baseUrl}/user/tasks/pending`)
      .pipe(
        catchError(this.handleError)
      );
  }

  updateInProgressTask(taskId: string, updatedTask: Task): Observable<Task> {
    return this.http.put<Task>(`${this.baseUrl}/user/task/update-in-progress/${taskId}`, updatedTask)
      .pipe(
        catchError(this.handleError)
      );
  }

  updatePendingTask(taskId: string, updatedTask: Task): Observable<Task> {
    return this.http.put<Task>(`${this.baseUrl}/user/task/update-pending/${taskId}`, updatedTask)
      .pipe(
        catchError(this.handleError)
      );
  }

  private handleError(error: HttpErrorResponse) {
    let errorMessage = 'An error occurred';
    if (error.error instanceof ErrorEvent) {
      errorMessage = `Error: ${error.error.message}`;
    } else {
      errorMessage = `Error Code: ${error.status}\nMessage: ${error.message}`;
    }
    console.error(errorMessage);
    return throwError(errorMessage);
  }
}
