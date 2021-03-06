import { Component, OnInit } from '@angular/core';
import * as go from "gojs"; //importing Go.js

import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Feedback } from '../shared/feedback';
import { Graph } from '../shared/graph';
import { ArrLabelsBFS } from '../shared/graphLabels';
import { ArrConections } from '../shared/graphConnections';

@Component({
  selector: 'app-bfs',
  templateUrl: './bfs.component.html',
  styleUrls: ['./bfs.component.scss']
})
export class BfsComponent implements OnInit {

  feedbackForm : FormGroup;
  feedback: Feedback;

  constructor(private fb: FormBuilder) {
    this.createForm();
  }

  // initializing the form for vertex addition
  createForm() {
    this.feedbackForm = this.fb.group({parent : ''});
  }

  // an array of JavaScript objects, one per node declaration
  arrLabels = ArrLabelsBFS;

  // an array of JavaScript objects, one per connection
  arrConections = ArrConections;

  // a vector of vector of the initial graph
  graph = Graph;

  // the tree traversal data
  traversal = [];
  traversalMessage = "Node with label 0 is the Root";
  parents = [];
  selectedParent;
  nodes = [0];
  lastV = 0;
  nextB = true;

  // Declaring the diagram at one scope above ngOnInit so that vertex updation can be performed
  diagram : any;

  // Breadth first search traversal function
  bfs () {
    // Queue declaration
    var queue = [];
    // visited array
    var visited = new Array;

    // initializing the visited array to 0
    for(var i = 0; i < this.arrLabels.length; i++) {
      visited[i] = 0;
    }

    // push 0 into the queue as 0 is always visited first
    queue.push(0);

    // reinitialize traversal array and then push 0 into it
    this.traversal = [];
    this.traversal.push(0);

    while(queue.length > 0) {
      //pop the visited vertex out of the queue
      let ver = queue.shift();
      for(var i = 0; i < this.graph[ver].length; i++)  {
        // if the vertex is not visited
        if( visited[this.graph[ver][i]] == 0 )  {
          // push it into the queue
          queue.push(this.graph[ver][i]);
          // set visited to 1 for the vertex
          visited[this.graph[ver][i]] = 1;
          // push the vertex in traversal arrary
          this.traversal.push(this.graph[ver][i]);
        }
      }
    }
    console.log("The traversal order : " + this.traversal);
  }

  ngOnInit() {

    for( var i=0; i < this.graph.length; i++) {
      this.parents.push(i);
    }

    // calling the bfs function to store the traversal order
    this.bfs();

    // targetting the div with myDiagramDiv id
    this.diagram = new go.Diagram("myDiagramDiv");

    // For conciseness. See the "Building Parts" intro page for more
    var $ = go.GraphObject.make;

    // the node template describes how each Node should be constructed
    this.diagram.nodeTemplate =
      $(go.Node, "Auto",  // the Shape automatically fits around the TextBlock
        $(go.Shape, "Ellipse",  // use this kind of figure for the Shape
          // bind Shape.fill to Node.data.color
          new go.Binding("fill", "color")),
        $(go.TextBlock,
          { margin: 10 },  // some room around the text
          // bind TextBlock.text to Node.data.key
          new go.Binding("text", "key"))
      );

    // the Model holds only the essential information describing the diagram
    this.diagram.model = new go.GraphLinksModel( this.arrLabels, this.arrConections );
    // centering the tree
    this.diagram.initialContentAlignment = go.Spot.Center;
    // enable Ctrl-Z to undo and Ctrl-Y to redo
    this.diagram.undoManager.isEnabled = true;

  }

  // fuction for next button
  onNext() {

    // incrementing the last visited
    this.lastV++;

    // when traversal is not completed
    if(this.lastV < this.traversal.length) {

      // push node in traversal order array
      this.nodes.push( this.traversal[this.lastV] );

      // fill the visited vertex with red
      (this.lastV == 1) ? this.arrLabels["0"]["color"] = "red"
      : this.arrLabels[this.traversal[this.lastV].toString()]["color"] = "red";

      // updating the diagram
      this.diagram.model = new go.GraphLinksModel( this.arrLabels, this.arrConections );

      // traversal message
      this.traversalMessage = "Node " + (this.traversal[this.lastV]) + " is visited after node " + (this.traversal[this.lastV - 1]);

    }

    // when the tree traversal is completed
    else {
      this.nextB = false;
      this.traversalMessage = "Tree travesal completed. Please Reset !";
    }

  }

  // reload the window
  onReset() {
    window.location.reload();
  }

  // function to add a new vertex in the graph
  onSubmit() {
    // Obtain the selected parent from the form
    this.feedback = this.feedbackForm.value;
    this.feedbackForm.reset();
    this.selectedParent = this.feedback.parent;
    console.log("parent you selected : ", this.selectedParent.toString());

    // push new vertex into the graph diagram
    this.arrLabels.push( { key: (this.graph.length).toString(), color: "skyblue" } );
    this.arrConections.push( { from: this.selectedParent.toString(), to: (this.graph.length).toString()} );
    this.parents.push(this.graph.length);

    // push new vertex into the graph vector of vectors
    this.graph.push([]);
    this.graph[this.selectedParent].push(this.graph.length-1);

    // Calling the BFS function for new graph
    this.bfs();

    // Reloading the graph
    this.diagram.model = new go.GraphLinksModel( this.arrLabels, this.arrConections );
  }

}