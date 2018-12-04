import { Routes } from '@angular/router';

// Importing the components
import { BfsComponent } from '../bfs/bfs.component';
import { DfsComponent } from '../dfs/dfs.component';


// Declrating the path for each component
export const routes: Routes = [
    { path: 'bfs', component: BfsComponent },
    { path: 'dfs', component: DfsComponent},
    { path: '', redirectTo: '/bfs', pathMatch: 'full' }
];