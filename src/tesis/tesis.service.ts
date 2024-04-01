import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { AppConfig } from 'src/app/app-config-props';

@Injectable({
  providedIn: 'root'
})
export class TesisService {

  constructor(private http: HttpClient) { }

 
}
