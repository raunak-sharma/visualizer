import { Component, OnInit } from '@angular/core';
import * as go from "gojs"; //importing Go.js

import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Feedback } from '../shared/feedback';
import { Graph } from '../shared/graph';
import { ArrLabelsDFS } from '../shared/graphLabels';
import { ArrConections } from '../shared/graphConnections';

@Component({
  selector: 'app-dfs',
  templateUrl: './dfs.component.html',
  styleUrls: ['./dfs.component.scss']
})
export class DfsComponent implements OnInit {

  // form for selecting the traversal option
  feedbackForm : FormGroup;
  feedback: Feedback;

  constructor(private fb: FormBuilder) {
    this.createForm();
  }

  // initializing the form
  createForm() {
    this.feedbackForm = this.fb.group({parent : ''});
  }

  // an array of JavaScript objects, one per node declaration
  arrLabels = ArrLabelsDFS;

  // an array of JavaScript objects, one per connection
  arrConections = ArrConections;

  // a vector of vector of the initial graph
  graph = Graph;

  // Declaring the diagram at one scope above ngOnInit so that vertex updation can be performed
  diagram : any;

  // the tree traversal data
  traversal = [];
  selectedParent;

  // traversal order array
  nodes = [];

  // last visited position variable
  lastV = 0;
  nextB = true;

  // all the order traversal data
  inV = false;
  postV = false;
  preV = false;
  // pre calculated traversal data fora a satic tree
  preorder = ["0", "1", "3", "4", "6", "5", "2"];
  inorder = ["3", "1", "6", "4", "5", "0", "2"];
  postorder = ["3", "6", "5", "4", "1", "2", "0"];
  parents = ["In-Order", "Pre-Order", "Post-Order"];
  traversalMessage = "Node with label 0 is the Root";

  // Determining the order of traversal
  dfs (inV, preV, postV) {

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

    // making the pointer to 0th position and empyting the traversal list
    this.lastV = 0;
    this.nodes = [];
    console.log("The traversal order : " + this.traversal);
  }

  ngOnInit() {

    // calling the dfs function to store the traversal order
    this.dfs(true, false, false);

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

    // when traversal is not completed
    if(this.lastV < this.traversal.length) {

      // push node in traversal order array
      this.nodes.push( this.traversal[this.lastV] );

      // fill the visited vertex with red
      for( var i = 0; i < this.arrLabels.length; i++ ) {
        if(this.arrLabels[i]["key"] == this.traversal[this.lastV]) {
          this.arrLabels[i]["color"] = "red";
        }
      }

      // updating the diagram
      this.diagram.model = new go.GraphLinksModel( this.arrLabels, this.arrConections );

      // traversal message
      (this.lastV == 0) ? this.traversalMessage = "Node " + (this.traversal[this.lastV]) + " is visited first."
      : this.traversalMessage = "Node " + (this.traversal[this.lastV]) + " is visited after node " + (this.traversal[this.lastV - 1]);

      // incrementing the last visited
      this.lastV++;

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
    console.log("order you selected : ", this.selectedParent.toString());

    // Calling the DFS function for new graph
    if(this.selectedParent == "In-Order") {
      this.dfs(true, false, false);
    }
    else if(this.selectedParent == "Pre-Order") {
      this.dfs(false, true, false);
    }
    else if(this.selectedParent == "Post-Order") {
      this.dfs(false, false, true);
    }

    // reinitializing the graph
    for( var i = 0; i < this.arrLabels.length; i++ ) {
      i == 1 ? this.arrLabels[i]["color"] = "orange"
      : this.arrLabels[i]["color"] = "skyblue";
    }

    this.nextB = true;
    this.lastV = 0;
    // updating the diagram
    this.diagram.model = new go.GraphLinksModel( this.arrLabels, this.arrConections );
  }

}