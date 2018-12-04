import { Component, OnInit } from '@angular/core';
import * as go from "gojs"; //importing Go.js

import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Feedback } from '../shared/feedback';

@Component({
  selector: 'app-dfs',
  templateUrl: './dfs.component.html',
  styleUrls: ['./dfs.component.scss']
})
export class DfsComponent implements OnInit {

  feedbackForm : FormGroup;
  feedback: Feedback;

  constructor(private fb: FormBuilder) {
    this.createForm();
  }

  createForm() {
    this.feedbackForm = this.fb.group({parent : ''});
  }

  // an array of JavaScript objects, one per node declaration
  arrLabels = [
    { key: "1", color: "skyblue" },
    { key: "0", color: "red" },
    { key: "2", color: "skyblue" },
    { key: "3", color: "skyblue" },
    { key: "4", color: "skyblue" },
    { key: "5", color: "skyblue" },
    { key: "6", color: "skyblue" }
  ];

  arrLabelsDup = [];

  // an array of JavaScript objects, one per connection
  arrConections = [
    { from: "0", to: "2" },
    { from: "0", to: "1" },
    { from: "1", to: "4" },
    { from: "1", to: "3" },
    { from: "4", to: "6" },
    { from: "4", to: "5" },
  ];

  // a vector of vector of the initial graph
  graph = [
    [1, 2],
    [3, 4],
    [],
    [],
    [5, 6],
    [],
    []
  ];

  // the tree traversal data
  traversal = [];
  traversalMessage = "Node with label 0 is the Root";
  parents = ["In-Order", "Pre-Order", "Post-Order"];
  selectedParent;
  nodes = [0];
  lastV = 0;
  // Declaring the diagram at one scope above ngOnInit so that vertex updation can be performed
  diagram : any;

  inV = false;
  preV = false;
  postV = false;
  inorder = ["0", "2", "3", "4", "1", "5"]
  preorder = ["1", "2", "3", "4", "0", "5"]
  postorder = ["2", "1", "3", "4", "0", "5"]

  // Determining the order of traversal
  bfs (inV, preV, postV) {

    if(inV == true) {
      this.inV = true;
      this.preV = false;
      this.postV = false;
      this.traversal = this.inorder;
    }

    else if(preV == true) {
      this.inV = false;
      this.preV = true;
      this.postV = false;
      this.traversal = this.preorder;
    }

    else if(postV == true) {
      this.inV = false;
      this.preV = false;
      this.postV = true;
      this.traversal = this.postorder;
    }

    console.log("The traversal order : " + this.traversal);
  }

  ngOnInit() {

    // calling the bfs function to store the traversal order
    this.bfs(true, false, false);

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
      this.traversalMessage = "Tree travesal completed. Please Reset !";
    }

  }

  // fuction for previous button
  onPrev() {
    console.log("Previous clicked");
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

    // Calling the BFS function for new graph
    if(this.selectedParent == "In-Order") {
      this.bfs(true, false, false);
    }
    else if(this.selectedParent == "Pre-Order") {
      this.bfs(false, true, false);
    }
    else if(this.selectedParent == "Post-Order") {
      this.bfs(false, false, true);
    }

    // Reloading the graph
    this.diagram.model = new go.GraphLinksModel( this.arrLabels, this.arrConections );
  }

}
