import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
//import 'rxjs/add/operator/map';
import { map } from 'rxjs/operators';
import Chart from 'chart.js';


@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {
  public chart: any;
  public form: FormGroup;  
  datelist :any; 
  id:any =[];
  list:any =[];
  key = "Zl5ZDEoyJTKoxSmrwLJV2yCu547BMGcSUnnEC1Uy"  
  constructor(private _fb: FormBuilder, private http: HttpClient) {
    this.form = _fb.group({
      startdate: [null, Validators.required],
      enddate: [null, Validators.required]
    })
  }

  ngOnInit(): void {
   //this.createChart();
  }

  Submit() {
    const urlofApi = 'https://api.nasa.gov/neo/rest/v1/feed?start_date=' + this.form.value.startdate + '&end_date=' + this.form.value.enddate + '&api_key=' + this.key;
    this.http.get(urlofApi)
      .subscribe((res) => {
        const searchResult = res;
        var data = []; 
        var datalist = [];            
        this.list = searchResult;    
        data = this.list.near_earth_objects
        this.datelist = Object.keys(data);
        datalist = Object.values(data);
       var datewisedata = []
       var datewiseid = []
        for (let index = 0; index < datalist.length; index++) {
          const element = datalist[index];
          this.id.push(element[index].id) 
         // console.log(Math.max(element[index].estimated_diameter.kilometers.estimated_diameter_max));        
          datewisedata.push(element[index].estimated_diameter.kilometers.estimated_diameter_max) 
                                      
        }  
       // console.log(datewisedata)  
       this.createChart(this.datelist,datewisedata,this.id)
      
      }
      );
  }
  createChart(Date,ki,id) {
    this.chart = new Chart("MyChart", {
      type: 'bar',
      data: {
        labels : Date,
        // labels: ['2022-05-10', '2022-05-11', '2022-05-12', '2022-05-13',
        //   '2022-05-14', '2022-05-15', '2022-05-16', '2022-05-17'],
        datasets: [              
          {
            label: "Number of Asteroids",            
            data:ki,
            // data: ['542', '542', '536', '327', '17',
            //   '0.00', '538', '541'],
            backgroundColor: 'green'
          }
        ]
      },
      options: {
        aspectRatio: 2.5
      }

    });
  }
}
