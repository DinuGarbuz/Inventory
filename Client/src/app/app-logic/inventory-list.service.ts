import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { InventoryItem } from './inventory-item';
import { Observable } from 'rxjs';
import { tap, map, delay } from 'rxjs/operators';
import { stringify } from 'querystring';

@Injectable({
  providedIn: 'root',
})
export class InventoryListService {
  constructor(private http: HttpClient) {}
  getData(pageNumber = 1, pageSize = 5, activeOnly = false, sorting = ''): Observable<[InventoryItem[], number]> {
    let params = new HttpParams()
      .set('activeOnly', activeOnly ? 'true' : 'false')
      .set('pageNumber', pageNumber.toString())
      .set('pageSize', pageSize.toString())
    if (sorting) params = params.set('sort', sorting);

    return this.http
      .get<InventoryItem[]>('/api/inventory-items', {
        params: params,
        observe: 'response'
      })
      .pipe(
        tap((resp) => {
          
          console.log('Inventory items fetched', resp.body);
        }),
        map((resp) => {
          return [resp.body, parseInt(resp.headers.get('X-Count'))];
        })
      );
  }

  getDataById(id: string) {
    return this.http.get<InventoryItem>('/api/inventory-items/' + id);
  }

  addData(item: InventoryItem) {
    return this.http
      .post<InventoryItem>('/api/inventory-items/', item)
      .pipe(tap(() => console.log('Item ', item.id, ' was created')));
  }

  updateData(item: InventoryItem) {
    return this.http
      .put<InventoryItem>('/api/inventory-items/' + item.id, item)
      .pipe(tap(() => console.log('Item ', item.id, ' was updated')));
  }

  deleteData(id: string){
    return this.http.delete<InventoryItem>('/api/inventory-items/' + id);
  }

 
}
