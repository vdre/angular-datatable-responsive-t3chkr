import {
  Component,
  Input,
  ChangeDetectionStrategy,
  AfterContentInit,
  QueryList,
  ContentChildren,
  TemplateRef,
  EventEmitter,
  Output,
  ElementRef,
  OnDestroy,
  ViewChild,
  ChangeDetectorRef,
  NgZone,
  OnInit,
} from '@angular/core';
import { ViewportRuler } from '@angular/cdk/scrolling';
import { FormControl } from '@angular/forms';
import {
  MatTableDataSource,
  MatTable,
  MatSort,
  PageEvent,
  MatPaginator,
} from '@angular/material';
import {
  trigger,
  state,
  style,
  animate,
  transition,
} from '@angular/animations';
import { Subscription } from 'rxjs';

import { Column } from './../column.type';

@Component({
  selector: 'shared-table',
  templateUrl: './shared-table.component.html',
  styleUrls: ['./shared-table.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  animations: [
    trigger('detailExpand', [
      state(
        'collapsed',
        style({ height: '0px', minHeight: '0', visibility: 'hidden' })
      ),
      state('expanded', style({ height: '*', visibility: 'visible' })),
      transition(
        'expanded <=> collapsed',
        animate('225ms cubic-bezier(0.4, 0.0, 0.2, 1)')
      ),
    ]),
  ],
})
export class SharedTableComponent
  implements AfterContentInit, OnDestroy, OnInit
{
  public MIN_COLUMN_WIDTH: number = 200;

  // Filter Fields
  generalFilter = new FormControl();

  // Visible Hidden Columns
  visibleColumns: Column[];
  hiddenColumns: Column[];
  expandedElement = {};

  // MatPaginator Inputs
  length = 100;
  pageSize = 5;
  pageSizeOptions: number[] = [5, 10, 25, 100];

  // MatPaginator Output
  pageEvent: PageEvent;

  // Shared Variables
  @Input() dataSource: MatTableDataSource<any>;
  @Input() columnsdef: Column[];

  // MatTable
  @ViewChild(MatTable, { static: true }) dataTable: MatTable<Element>;
  @ViewChild(MatSort, { static: true }) sort: MatSort;
  @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator;

  private rulerSubscription: Subscription;

  get visibleColumnsIds() {
    const visibleColumnsIds = this.visibleColumns.map((column) => column.id);

    return this.hiddenColumns.length
      ? ['trigger', ...visibleColumnsIds]
      : visibleColumnsIds;
  }

  get hiddenColumnsIds() {
    return this.hiddenColumns.map((column) => column.id);
  }

  isExpansionDetailRow = (index, item) => item.hasOwnProperty('detailRow');

  constructor(
    private ruler: ViewportRuler,
    private _changeDetectorRef: ChangeDetectorRef,
    private zone: NgZone
  ) {
    this.rulerSubscription = this.ruler.change(100).subscribe((data) => {
      // accesing clientWidth cause browser layout, cache it!
      // const tableWidth = this.table.nativeElement.clientWidth;
      this.toggleColumns(
        this.dataTable['_elementRef'].nativeElement.clientWidth
      );
    });
  }

  /**
   * Lifecycle Hook Start
   */

  ngOnInit() {}
  ngAfterContentInit() {
    debugger;
    console.log(this.dataTable['_elementRef'].nativeElement.clientWidth);
    this.toggleColumns(this.dataTable['_elementRef'].nativeElement.clientWidth);
    this.dataSource.sort = this.sort;
    this.dataSource.paginator = this.paginator;

    this.dataSource.sortingDataAccessor = (data: any, sortHeaderId: string) => {
      const value: any = data[sortHeaderId];
      return typeof value === 'string' ? value.toLowerCase() : value;
    };
  }

  ngOnDestroy() {
    this.rulerSubscription.unsubscribe();
  }

  /**
   * Lifecycle Hook End
   */

  applyFilter(filterValue: string) {
    filterValue = filterValue.trim(); // Remove whitespace
    filterValue = filterValue.toLowerCase(); // MatTableDataSource defaults to lowercase matches
    this.dataSource.filter = filterValue;
  }

  toggleColumns(tableWidth: number) {
    //console.log('tableWidth',tableWidth)
    this.zone.runOutsideAngular(() => {
      const sortedColumns = this.columnsdef
        .slice()
        .map((column, index) => ({ ...column, order: index }))
        .sort((a, b) => a.hideOrder - b.hideOrder);

      for (const column of sortedColumns) {
        const columnWidth = column.width ? column.width : this.MIN_COLUMN_WIDTH;
        //console.log('columnWidth',columnWidth)

        if (column.hideOrder && tableWidth < columnWidth) {
          column.visible = false;

          continue;
        }

        tableWidth -= columnWidth;
        column.visible = true;
      }

      this.columnsdef = sortedColumns.sort((a, b) => a.order - b.order);
      this.visibleColumns = this.columnsdef.filter((column) => column.visible);
      this.hiddenColumns = this.columnsdef.filter((column) => !column.visible);
    });

    this._changeDetectorRef.detectChanges();
  }
}
