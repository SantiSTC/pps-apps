import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import Chart from 'chart.js/auto';
import { FirestoreService } from 'src/app/services/firestore.service';

@Component({
  selector: 'app-stats-lindas',
  templateUrl: './stats-lindas.page.html',
  styleUrls: ['./stats-lindas.page.scss'],
})
export class StatsLindasPage implements OnInit {
  pieChart: any;
  photosData: any = [];
  likesData: any = [];
  photoNames: any = [];

  constructor(private router: Router, private firestore: FirestoreService) { }
  
  ngOnInit() {
    this.firestore.traer('likes').subscribe((data)=>{
      this.photosData = data;
      this.likesData = this.photosData.map((photo:any) => {
        if(photo.atributo === 'lindas'){
    //       alert("AAAAAAAAAAA")
          return photo.likes;
        }
      });
      this.photoNames = this.photosData.map((photo:any) => photo.duenio);
      this.createPieChart(this.photosData);
    });
  }
  
  createPieChart(fotos:any) {
    this.pieChart = new Chart('canvas', {
      type: 'pie',
      data: {
        labels: [],
        datasets: [{
            label: '',
            data: this.likesData,
            backgroundColor: [
              '#21A6E5', '#063752', '#BAD696', '#3C6C83','#282728', '#202B2C',
              '#00A1FD','#fcb7af','#fdf9c4','#ffe4e1','#b2e2f2','#ff6961'
            ],
            borderWidth: 1.5,
          },
        ],
      },
      options: {
        plugins: {
          tooltip: {
            usePointStyle: true,
            borderColor: '#C5DB8F',
            borderWidth: 3,
            boxHeight: 130,
            boxWidth: 130,
            cornerRadius: 8,
            displayColors: true,
            bodyAlign: 'center',
            callbacks: {
              //@ts-ignore
              labelPointStyle(context) 
              {
                const value = context.parsed;
                const nombre = fotos[context.dataIndex].duenio;

                context.label = `${value} Likes - ${nombre}`;
                let image = new Image(130, 130);
                image.src = fotos[context.dataIndex].url;
                return{
                  pointStyle: image
                }
              },
            },
            legend: {
              display: false,
            },
            datalabels: {
              color: '#ffffff',
              anchor: 'end',
              align: 'center',
              font: {
                size: 30,
                weight: 'bold',
              },
              offset: 5,
              borderColor: '#ffffff',
              borderWidth: 1,
              borderRadius: 10,
              padding: 5,
              textShadowBlur: 10,
              textShadowColor: '#000000',
            },
          },
        },
      },
    });
  }

  redirectTo(url: string){
    this.router.navigateByUrl(url);
  }
}
