import { Routes } from '@angular/router';

export const appRoutes: Routes = [
  { path: '', loadChildren: './portal/portal.module#PortalModule' },
  { path: '', loadChildren: './authentication/authentication.module#AuthenticationModule' }
];
