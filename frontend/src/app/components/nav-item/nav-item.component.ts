import { NgClass, NgComponentOutlet } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  computed,
  inject,
  input,
  OnInit,
} from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { ProjectService } from '@features/projects/services/project.service';

@Component({
  selector: 'app-nav-item',
  imports: [RouterLink, NgComponentOutlet, NgClass],
  templateUrl: './nav-item.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class NavItemComponent implements OnInit {
  private projectService = inject(ProjectService);
  private router = inject(Router);
  linkData = input.required<{ name: string; href: string; icon: any }>();

  ngOnInit(): void {
    console.log(this.projectService.project());
    console.log(this.linkData().href === this.router.url);
  }

  isSelected = computed(() => {
    const project = this.projectService.project();
    return this.linkData().href === this.router.url && !project;
  });
}
