import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, Subject } from 'rxjs';

export interface ChatResponse {
  response: string;
}

@Injectable({
  providedIn: 'root'
})
export class IaService {
  private apiUrl = `http://localhost:8080/api/ia`;

  // Emisor de contexto proactivo
  private proactiveContextSource = new Subject<string>();
  proactiveContext$ = this.proactiveContextSource.asObservable();

  constructor(private http: HttpClient) { }

  generarRespuesta(prompt: string): Observable<ChatResponse> {
    return this.http.post<ChatResponse>(`${this.apiUrl}/generar`, { prompt });
  }

  // Permite a cualquier componente activar a Nova
  triggerProactiveAdvice(context: string) {
    this.proactiveContextSource.next(context);
  }
}
