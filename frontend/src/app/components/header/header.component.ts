import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { formatUsername, getAvatarText } from '@core/utils/utils';
import { AuthService } from '@features/auth/services/auth.service';

@Component({
  selector: 'app-header',
  imports: [],
  templateUrl: './header.component.html',
  styleUrl: './header.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class HeaderComponent {
  private authService = inject(AuthService);
  user = this.authService.user;

  get avatarText() {
    return getAvatarText(this.user()?.email);
  }

  get username() {
    return formatUsername(this.user()?.username);
  }

  get email() {
    return this.user()?.email;
  }
}
