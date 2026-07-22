import { Injectable, inject } from '@angular/core';
import { HttpClient} from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../env';
@Injectable({
 providedIn:'root'
})
export class MemberService {
private http = inject(HttpClient);
  private api = environment.BASIC_URL + 'membres';
private readonly apiSubmit = environment.BASIC_URL + 'qr-access';


register(data: FormData): Observable<any> {

  console.log('===== FORM DATA =====');


  data.forEach((value, key) => {

    console.log('KEY:', key);


    if (value instanceof Blob) {

      value.text().then(text => {

        console.log('JSON DATA:', JSON.parse(text));

      });

    }
    else {

      console.log('VALUE:', value);

    }

  });


  return this.http.post(
    `${this.apiSubmit}/register`,
    data
  );

}




}
