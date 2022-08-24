import { Component, OnInit, ViewChild } from '@angular/core';
import { DataSource } from '@angular/cdk/table';
import { BehaviorSubject, Observable } from 'rxjs';
import { of } from 'rxjs';

// Interfaces
import { Column } from './../column.type';
// Services
import { GeneralService } from './../general.service';
import { MatTableDataSource } from '@angular/material';

@Component({
  selector: 'app-example',
  templateUrl: './example.component.html',
  styleUrls: ['./example.component.scss']
})
export class ExampleComponent implements OnInit {

  public dataSource = new MatTableDataSource();


  columns:Column[]=[
    {id:'id',label:'S. No.',hideOrder:0,width:75},
    {id:'name',label:'Name',hideOrder:1},
    {id:'username',label:'Username',hideOrder:3},
    {id:'email',label:'Email',hideOrder:4},
    {id:'phone',label:'Phone No.',hideOrder:5},
    {id:'website',label:'Website',hideOrder:6},
    {id:'action',label:'Action',hideOrder:0, width:80}
  ]

  constructor(private service:GeneralService) { 

  }

  ngOnInit(){

    this.service.getUsers().subscribe( result => {
      
      if(result.length > 0){
        const rows = [];

        result.forEach((element:any,index:number)=> {
          element['recId'] = index +1;
          rows.push(element)
        });

        this.dataSource.data = rows;
      }
    })
    
  }

  public onNumberGenerated(randomNumber: number) {
    console.log(randomNumber)
  }
 
}
 