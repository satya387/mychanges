import { Component, OnInit } from '@angular/core';
import { IronCladService } from 'src/app/main-layout/iron-clad-dashboard/iron-clad.service';

@Component({
  selector: 'app-sidebar',
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.scss']
})
export class SidebarComponent implements OnInit {
  
  isCollapsed = false;
  documentList: any[] = [];

  constructor(private ironService: IronCladService) {}

  ngOnInit(): void {
    this.loadDocuments();
  }

  toggleSidebar() {
    this.isCollapsed = !this.isCollapsed;
  }

loadDocuments() {
  this.ironService.getDocumentTypes(1).subscribe((res: any[]) => {

    this.documentList = res.map(d => ({
      id: d.DocumentId ?? d.id ?? d.ID,   // ✅ FIX HERE
      name: d.name || d.Name
    }));

     console.log("Sidebar IDs:", this.documentList);  

  });
}

getDocumentIcon(docName: string): string {

  const name = (docName || '').toLowerCase();

  if (name.includes('master services agreement')) {
    return 'pi pi-file-edit';
  }

  if (name.includes('statement of work')) {
    return 'pi pi-list-check';
  }

  if (name.includes('change order') || name.includes('amendment')) {
    return 'pi pi-pencil';
  }

  if (name.includes('purchase order') || name.includes('work order')) {
    return 'pi pi-shopping-cart';
  }

  if (name.includes('business associate')) {
    return 'pi pi-users';
  }

  if (name.includes('consulting')) {
    return 'pi pi-briefcase';
  }

  if (name.includes('non disclosure')) {
    return 'pi pi-lock';
  }

  if (name.includes('letter')) {
    return 'pi pi-envelope';
  }

  if (name.includes('agreement')) {
    return 'pi pi-file';
  }

  return 'pi pi-folder';
}
}


