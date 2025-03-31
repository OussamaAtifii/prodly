import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { Member } from '../models/member';
import { Invitation } from '../models/invitation';

@Injectable({
  providedIn: 'root',
})
export class InvitationService {
  private API_URL = `${environment.API_URL}/members`;
  private http = inject(HttpClient);

  sendInvitation(invitationData: Invitation) {
    return this.http.post(`${this.API_URL}/send-invitation`, invitationData, {
      withCredentials: true,
    });
  }

  validInvitation(token: string) {
    return this.http.post<{ projectId: number }>(
      `${this.API_URL}/accept-invitation`,
      { token },
      { withCredentials: true },
    );
  }

  getProjectMembers(projectId: number) {
    return this.http.get<Member[]>(`${this.API_URL}/${projectId}`, {
      withCredentials: true,
    });
  }
}
