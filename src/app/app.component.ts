import { Component, ViewChild, OnInit } from "@angular/core";


import {
  ChartComponent,
  ApexAxisChartSeries,
  ApexChart,
  ApexYAxis,
  ApexXAxis,
  ApexTitleSubtitle
} from "ng-apexcharts";
import { HttpClient } from '@angular/common/http';

export type ChartOptions = {
  series: ApexAxisChartSeries;
  chart: ApexChart;
  xaxis: ApexXAxis;
  yaxis: ApexYAxis;
  title: ApexTitleSubtitle;
};

@Component({
  selector: "app-root",
  templateUrl: "./app.component.html",
  styleUrls: ["./app.component.css"]
})
export class AppComponent implements OnInit {
  @ViewChild("chart") chart: ChartComponent;
  public chartOptions: Partial<ChartOptions>;
  private chartDisplayFlag:boolean=false;
  constructor(private http: HttpClient) {
  }

  ngOnInit() {
    this.getStockData().subscribe(data => {
      let dataArray=[];
      for (let key in data['Time Series (Daily)']) {
        dataArray.push({x:new Date(Date.parse(key)),
          y:[
            +data['Time Series (Daily)'][key]["1. open"],
            +data['Time Series (Daily)'][key]["2. high"],
            +data['Time Series (Daily)'][key]["3. low"],
            +data['Time Series (Daily)'][key]["4. close"],
          ]});
      }
      this.chartDisplayFlag=true;
      this.displayCandleStick(dataArray);
    });
  }
  getStockData() {
    return this.http.get(
      "https://www.alphavantage.co/query?function=TIME_SERIES_DAILY&symbol=NSE:ceatltd&interval=5min&apikey=9AB5HJGWWF4SPGQ1");
  }
  displayCandleStick(data: any) {

    this.chartOptions = {
      series: [
        {
          name: "candle",
          data: data
        }
      ],
      chart: {
        type: "candlestick",
        height: 350
      },
      title: {
        text: "CandleStick Chart",
        align: "left"
      },
      xaxis: {
        type: "datetime"
      },
      yaxis: {
        tooltip: {
          enabled: true
        }
      }
    };
  }
  public generateDayWiseTimeSeries(baseval, count, yrange) {
    var i = 0;
    var series = [];
    while (i < count) {
      var y =
        Math.floor(Math.random() * (yrange.max - yrange.min + 1)) + yrange.min;

      series.push([baseval, y]);
      baseval += 86400000;
      i++;
    }
    return series;
  }
}
