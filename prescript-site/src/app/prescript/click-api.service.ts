import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class ClickApiService {
  private apiUrl = 'http://localhost:3000/clicks';

  constructor(private http: HttpClient) {}

  increment() {
    return this.http.post<{ count: number }>(this.apiUrl, {});
  }

  getCount() {
    return this.http.get<{ count: number }>(this.apiUrl);
  }
}
