import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
//import 'rxjs/add/operator/map';
import { map } from 'rxjs/operators';
import Chart from 'chart.js';
import { formatDate } from '@angular/common';
import * as _ from "lodash"
import { element } from 'protractor';
interface Post {
  startdate: Date;
  enddate: Date;
}
@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {
  public chart: any;
  public form: FormGroup;
  public editForm: FormGroup
  post: Post = {
    startdate: new Date(Date.now()),
    enddate: new Date(Date.now())
  }
  Averagekilimiterwise: any[];
  datelist: any;
  monthwiselistCount: any = [];
  fastAstroids : any = [];
  id: any = [];
  list: any = [];
  max: number = 0;
  key = "Zl5ZDEoyJTKoxSmrwLJV2yCu547BMGcSUnnEC1Uy"
  constructor(private _fb: FormBuilder, private http: HttpClient) {
    this.form = _fb.group({
      startdate: [formatDate(this.post.startdate, 'yyyy-MM-dd', 'en'), Validators.required],
      enddate: [formatDate(this.post.enddate, 'yyyy-MM-dd', 'en'), Validators.required]
    })
  }

  ngOnInit(): void {

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
        for (let index = 0; index < datalist.length; index++) {
          const element = datalist[index].length;
          this.monthwiselistCount.push(element);
        }
        var datewisedata: any = []
       
        var fasteravg :any = [];       
        var datewiselistavg = [];
        
        for (let index = 0; index < datalist.length; index++) {
          const elements = datalist[index];
          const div = datalist[index].length;          
          const result = _.sumBy(elements, function (o) { return o.estimated_diameter.kilometers.estimated_diameter_max / div; });
          datewiselistavg.push(result)
          /* var val = _.orderBy(elements, (item) => [item.close_approach_data[0].relative_velocity.kilometers_per_hour], [ 'desc']); */
          var val = _.orderBy(elements, [function (item) { return item.close_approach_data[0].relative_velocity.kilometers_per_hour; }], ["desc"]);
          fasteravg.push(val[0].close_approach_data[0].relative_velocity.kilometers_per_hour)         
        }

      //  console.log("fasteravg",fasteravg)  
        this.fastAstroids = fasteravg;
        this.Averagekilimiterwise = datewiselistavg
        this.createChart(this.datelist, datewisedata, this.id)
      }
      );
  }
  createChart(Date, ki, id) {
    this.chart = new Chart("MyChart", {
      type: 'bar',
      data: {
        labels: Date,
        // labels: ['2022-05-10', '2022-05-11', '2022-05-12', '2022-05-13',
        //   '2022-05-14', '2022-05-15', '2022-05-16', '2022-05-17'],
        datasets: [
       
          {
            label: "Number of Asteroids",
            data: this.monthwiselistCount,
            // data: ['542', '542', '536', '327', '17',
            //   '0.00', '538', '541'],
            backgroundColor: 'green'
          },
        ]
      },
      options: {
        aspectRatio: 2.5
      }

    });
  }
}
