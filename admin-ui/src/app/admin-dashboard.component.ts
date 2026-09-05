import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { AdminApiService, BankData, BankProfile, BankSummary } from './admin-api.service';

@Component({
  selector: 'admin-dashboard',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './admin-dashboard.component.html',
  styleUrl: './admin-dashboard.component.scss'
})
export class AdminDashboardComponent {
  private readonly api = inject(AdminApiService);
  username = '';
  password = '';
  loading = false;
  signedIn = false;
  error = '';
  notice = '';
  banks: BankSummary[] = [];
  selected?: BankData;
  selectedProfile?: BankProfile;
  editing = false;

  signIn(): void {
    this.error = '';
    this.notice = '';
    this.api.setCredentials(this.username.trim(), this.password);
    this.loadBanks(true);
  }

  signOut(): void {
    this.api.clearCredentials();
    this.signedIn = false;
    this.password = '';
    this.banks = [];
    this.selected = undefined;
    this.selectedProfile = undefined;
  }

  loadBanks(initial = false): void {
    this.loading = true;
    this.error = '';
    this.api.listBanks().subscribe({
      next: (page) => {
        this.banks = page.content ?? [];
        this.signedIn = true;
        this.loading = false;
        if (initial) this.notice = `${this.banks.length} bank configurations loaded.`;
      },
      error: (err) => {
        this.loading = false;
        this.signedIn = false;
        this.error = err.status === 401 || err.status === 403 ? 'Credentials rejected or Admin API is disabled.' : 'Gateway unavailable. Check the API URL and network.';
      }
    });
  }

  inspect(bank: BankSummary): void {
    this.loading = true;
    this.error = '';
    this.api.getBank(bank.uuid).subscribe({
      next: (data) => {
        this.selected = data;
        this.selectedProfile = data.profiles?.[0];
        this.editing = false;
        this.loading = false;
      },
      error: () => {
        this.loading = false;
        this.error = 'Unable to retrieve the selected bank configuration.';
      }
    });
  }

  newBank(): void {
    this.selected = {
      bank: { uuid: crypto.randomUUID(), name: '', bic: '', bankCode: '', isActive: true },
      profiles: []
    };
    this.selectedProfile = undefined;
    this.editing = true;
    this.notice = '';
    this.error = '';
  }

  editSelected(): void {
    this.editing = true;
  }

  saveSelected(): void {
    if (!this.selected?.bank.uuid || !this.selected.bank.name.trim()) {
      this.error = 'Bank UUID and name are required.';
      return;
    }
    this.loading = true;
    const exists = this.banks.some((bank) => bank.uuid === this.selected?.bank.uuid);
    this.api.saveBank(this.selected.bank.uuid, this.selected, exists).subscribe({
      next: (data) => {
        this.selected = data;
        this.editing = false;
        this.loading = false;
        this.notice = 'Bank configuration saved.';
        this.loadBanks();
      },
      error: () => {
        this.loading = false;
        this.error = 'The gateway rejected the bank configuration. Validate the profile fields.';
      }
    });
  }

  deleteSelected(): void {
    const uuid = this.selected?.bank.uuid;
    if (!uuid || !confirm('Delete this bank configuration? This cannot be undone.')) return;
    this.loading = true;
    this.api.deleteBank(uuid).subscribe({
      next: () => {
        this.selected = undefined;
        this.selectedProfile = undefined;
        this.loading = false;
        this.notice = 'Bank configuration deleted.';
        this.loadBanks();
      },
      error: () => {
        this.loading = false;
        this.error = 'The bank configuration could not be deleted.';
      }
    });
  }

  selectProfile(profile: BankProfile): void {
    this.selectedProfile = profile;
  }
}
