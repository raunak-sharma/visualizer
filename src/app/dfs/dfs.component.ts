import { Component, OnInit } from '@angular/core';

import * as d3 from "d3";
export * from 'd3-axis';
export * from 'd3-format';
export * from 'd3-interpolate';
export * from 'd3-scale';
export * from 'd3-selection';
export * from 'd3-shape';
import { hierarchy, tree } from 'd3-hierarchy'


@Component({
  selector: 'app-dfs',
  templateUrl: './dfs.component.html',
  styleUrls: ['./dfs.component.scss']
})
export class DfsComponent implements OnInit {

  constructor() { }

  ngOnInit() {

  }

}
