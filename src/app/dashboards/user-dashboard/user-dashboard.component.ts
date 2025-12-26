// dashboards/user-dashboard/user-dashboard.component.ts
import { Component, OnDestroy, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Router } from '@angular/router';
import { FormsModule } from '@angular/forms';

import { Chart, ChartConfiguration, registerables } from 'chart.js';
import { NgChartsModule } from 'ng2-charts';

enum PaymentStatus {
  COMPLETED = 'completed',
  PENDING = 'pending',
  FAILED = 'failed',
}

type Property = {
  id: string;
  name: string;
  plotNo: string;
  block?: string;
  size?: string;
  status?: 'active' | 'pending' | 'blocked' | string;
};

type Payment = {
  id: string;
  propertyId: string;
  propertyName: string;
  amount: number;
  status: PaymentStatus | 'completed' | 'pending' | 'failed';
  paidDate?: string; // ISO
  dueDate?: string;  // ISO
};

type DashboardStats = {
  totalProperties: number;
  activeProperties: number;
  completedProperties: number;
  pendingProperties: number;
  totalPaid: number;
  totalDue: number;
  nextPaymentAmount: number;
  nextPaymentDate: Date;
  overduePaymentsCount: number;
  upcomingPaymentsCount: number;
};

type ProfileStatus = {
  kyc: 'verified' | 'pending' | 'rejected' | 'unknown' | string;
  completion: number;
};

type DueBreakdown = {
  installments: number;
  development: number;
  other: number;
  surcharge: number;
};

type InstallmentRow = {
  id: any;
  dueDate: Date | string;
  amount: number;
  status: 'paid' | 'due' | 'overdue';
  propertyId?: any;
  propertyName?: string;
};

@Component({
  selector: 'app-user-dashboard',
  standalone: true,
  imports: [CommonModule, RouterModule, FormsModule, NgChartsModule],
  templateUrl: './user-dashboard.component.html',
  styleUrls: ['./user-dashboard.component.css'],
})
export class UserDashboardComponent implements OnInit, OnDestroy {
  PaymentStatus = PaymentStatus;

  private readonly BRAND_BLUE = '#4988C4';
  private readonly BRAND_BLUE_LIGHT = '#6aa6de';

  // UI
  isLoading = true;
  hasNotifications = true;
  illustration = false;

  // User (dummy)
  memberName = 'Guest User';
  memberCNIC = '00000-0000000-0';
  profileStatus: ProfileStatus = { kyc: 'pending', completion: 65 };

  // Filters
  selectedPropertyId: string = 'all';
  dateRange = {
    start: new Date(new Date().getFullYear(), 0, 1).toISOString().slice(0, 10),
    end: new Date().toISOString().slice(0, 10),
  };

  // Data
  properties: Property[] = [];
  selectedProperty: Property | null = null;

  dashboardStats: DashboardStats = {
    totalProperties: 0,
    activeProperties: 0,
    completedProperties: 0,
    pendingProperties: 0,
    totalPaid: 0,
    totalDue: 0,
    nextPaymentAmount: 0,
    nextPaymentDate: new Date(),
    overduePaymentsCount: 0,
    upcomingPaymentsCount: 0,
  };

  dueBreakdown: DueBreakdown = { installments: 0, development: 0, other: 0, surcharge: 0 };
  recentPayments: Payment[] = [];
  upcomingPayments: Payment[] = [];
  installmentPlan: InstallmentRow[] = [];
  notifications: any[] = [];

  // Charts
  public paymentChartData: ChartConfiguration<'line'>['data'] = {
    labels: [],
    datasets: [
      {
        data: [],
        label: 'Payments Made',
        fill: true,
        tension: 0.45,
        borderColor: this.BRAND_BLUE,
        backgroundColor: 'rgba(73,136,196,0.14)',
        pointBackgroundColor: this.BRAND_BLUE,
        pointBorderColor: '#ffffff',
        pointBorderWidth: 2,
        pointRadius: 3.5,
        pointHoverRadius: 5,
        borderWidth: 2,
      },
    ],
  };

  public propertyChartData: ChartConfiguration<'doughnut'>['data'] = {
    labels: ['Completed', 'In Progress', 'Upcoming'],
    datasets: [
      {
        data: [0, 0, 0],
        backgroundColor: [this.BRAND_BLUE, this.BRAND_BLUE_LIGHT, '#cfe2f6'],
        borderColor: 'rgba(255,255,255,0.9)',
        borderWidth: 2,
        hoverOffset: 6,
      },
    ],
  };

  public chartOptions: ChartConfiguration['options'] = {
    responsive: true,
    maintainAspectRatio: false,
    interaction: { mode: 'index', intersect: false },
    plugins: {
      legend: {
        display: true,
        position: 'top',
        labels: {
          boxWidth: 10,
          boxHeight: 10,
          padding: 14,
          font: { size: 12, weight: 600 },
          color: 'rgba(15,23,42,.80)',
        },
      },
      tooltip: {
        enabled: true,
        backgroundColor: 'rgba(15,23,42,.92)',
        titleColor: '#fff',
        bodyColor: '#fff',
        padding: 12,
        cornerRadius: 12,
        displayColors: true,
      },
    },
    scales: {
      x: {
        grid: { color: 'rgba(15,23,42,.06)' },
        ticks: { color: 'rgba(15,23,42,.65)', font: { weight: 600 } },
      },
      y: {
        grid: { color: 'rgba(15,23,42,.06)' },
        ticks: { color: 'rgba(15,23,42,.65)', font: { weight: 600 } },
      },
    },
  };

  constructor(private router: Router) {
    Chart.register(...registerables);
  }

  ngOnInit(): void {
    this.loadDummyDashboard();
  }

  // ✅ HTML compatibility: Apply Filter button calls this
  loadDashboardData(): void {
    this.applyFilters();
  }

  // Dummy data load (no backend)
  loadDummyDashboard(): void {
    this.isLoading = true;

    this.properties = [
      { id: 'p1', name: 'Al Noor City', plotNo: 'A-12', block: 'A', size: '5 Marla', status: 'active' },
      { id: 'p2', name: 'Sky View Villas', plotNo: 'B-07', block: 'B', size: '10 Marla', status: 'pending' },
      { id: 'p3', name: 'Green Residency', plotNo: 'C-19', block: 'C', size: '1 Kanal', status: 'active' },
    ];

    this.recentPayments = [
      { id: 'PMT-1001', propertyId: 'p1', propertyName: 'Al Noor City — A-12', amount: 25000, status: PaymentStatus.COMPLETED, paidDate: this.daysAgo(5) },
      { id: 'PMT-1002', propertyId: 'p3', propertyName: 'Green Residency — C-19', amount: 40000, status: PaymentStatus.COMPLETED, paidDate: this.daysAgo(18) },
      { id: 'PMT-1003', propertyId: 'p2', propertyName: 'Sky View Villas — B-07', amount: 30000, status: PaymentStatus.PENDING, dueDate: this.daysAgo(2) },
      { id: 'PMT-1004', propertyId: 'p1', propertyName: 'Al Noor City — A-12', amount: 25000, status: PaymentStatus.COMPLETED, paidDate: this.daysAgo(42) },
      { id: 'PMT-1005', propertyId: 'p3', propertyName: 'Green Residency — C-19', amount: 40000, status: PaymentStatus.COMPLETED, paidDate: this.daysAgo(70) },
    ];

    this.upcomingPayments = [
      { id: 'DUE-2001', propertyId: 'p1', propertyName: 'Al Noor City — A-12', amount: 25000, status: PaymentStatus.PENDING, dueDate: this.daysFromNow(10) },
      { id: 'DUE-2002', propertyId: 'p2', propertyName: 'Sky View Villas — B-07', amount: 30000, status: PaymentStatus.PENDING, dueDate: this.daysFromNow(18) },
      { id: 'DUE-2003', propertyId: 'p3', propertyName: 'Green Residency — C-19', amount: 40000, status: PaymentStatus.PENDING, dueDate: this.daysFromNow(28) },
    ];

    this.notifications = [
      { title: 'New installment schedule uploaded', date: new Date(), type: 'Update' },
      { title: 'Payment received for Al Noor City', date: new Date(Date.now() - 5 * 86400000), type: 'Payment' },
      { title: 'Document verification pending', date: new Date(Date.now() - 2 * 86400000), type: 'Documents' },
    ];

    this.recomputeAll();
    this.selectedPropertyId = this.selectedPropertyId || 'all';
    this.updateSelectedProperty();

    setTimeout(() => (this.isLoading = false), 250);
  }

  refreshDashboard(): void {
    this.loadDummyDashboard();
  }

  filterByProperty(): void {
    this.updateSelectedProperty();
    // optional: apply date range too
    this.applyFilters();
  }

  // frontend-only filters (property + date range)
  applyFilters(): void {
    // Reload base dummy then apply filters on top
    const currentSelected = this.selectedPropertyId;
    const start = new Date(this.dateRange.start);
    const end = new Date(this.dateRange.end);

    this.loadDummyDashboard();

    setTimeout(() => {
      const inRange = (d?: string) => {
        if (!d) return false;
        const dt = new Date(d);
        dt.setHours(0,0,0,0);
        const s = new Date(start); s.setHours(0,0,0,0);
        const e = new Date(end);   e.setHours(23,59,59,999);
        return dt >= s && dt <= e;
      };

      if (currentSelected !== 'all') {
        this.recentPayments = this.recentPayments.filter(p => p.propertyId === currentSelected);
        this.upcomingPayments = this.upcomingPayments.filter(p => p.propertyId === currentSelected);
      }

      this.recentPayments = this.recentPayments.filter(p => inRange(p.paidDate || p.dueDate));
      this.upcomingPayments = this.upcomingPayments.filter(p => inRange(p.dueDate));

      this.selectedPropertyId = currentSelected;
      this.updateSelectedProperty();
      this.recomputeAll();
    }, 0);
  }

  // Optional compatibility (in case you call it later)
  loadPropertySpecificData(propertyId: string): void {
    this.selectedPropertyId = propertyId;
    this.filterByProperty();
  }

  private updateSelectedProperty(): void {
    if (this.selectedPropertyId === 'all') {
      this.selectedProperty = this.properties?.[0] ?? null;
    } else {
      this.selectedProperty =
        this.properties.find(p => String(p.id) === String(this.selectedPropertyId)) ?? null;
    }
  }

  private recomputeAll(): void {
    const totalProperties = this.properties.length;
    const active = this.properties.filter(p => p.status === 'active').length;
    const pending = this.properties.filter(p => p.status === 'pending').length;
    const completed = Math.max(0, totalProperties - active - pending);

    const totalPaid = this.recentPayments
      .filter(p => String(p.status) === PaymentStatus.COMPLETED)
      .reduce((s, p) => s + (p.amount || 0), 0);

    const totalDue = this.upcomingPayments.reduce((s, p) => s + (p.amount || 0), 0);

    const next = this.upcomingPayments
      .slice()
      .sort((a, b) => new Date(a.dueDate || '').getTime() - new Date(b.dueDate || '').getTime())[0];

    const overdueCount = this.recentPayments.filter(p => {
      const due = new Date(p.dueDate || p.paidDate || new Date());
      const isPaid = String(p.status) === PaymentStatus.COMPLETED;
      return due.getTime() < Date.now() && !isPaid;
    }).length;

    this.dashboardStats = {
      totalProperties,
      activeProperties: active,
      completedProperties: completed,
      pendingProperties: pending,
      totalPaid,
      totalDue,
      nextPaymentAmount: next?.amount ?? 0,
      nextPaymentDate: next?.dueDate ? new Date(next.dueDate) : new Date(),
      overduePaymentsCount: overdueCount,
      upcomingPaymentsCount: this.upcomingPayments.length,
    };

    // breakdown (dummy split)
    this.dueBreakdown = {
      installments: Math.round(totalDue * 0.75),
      development: Math.round(totalDue * 0.15),
      other: Math.round(totalDue * 0.05),
      surcharge: Math.round(totalDue * 0.05),
    };

    // property chart
    this.propertyChartData = {
      ...this.propertyChartData,
      datasets: [
        {
          ...(this.propertyChartData.datasets[0] as any),
          data: [completed, active, pending],
          backgroundColor: [this.BRAND_BLUE, this.BRAND_BLUE_LIGHT, '#cfe2f6'],
          borderColor: 'rgba(255,255,255,0.9)',
          borderWidth: 2,
          hoverOffset: 6,
        },
      ],
    };

    // payment chart
    this.buildPaymentChartFromRecent();

    // installment plan
    this.installmentPlan = this.upcomingPayments.map((p) => ({
      id: p.id,
      dueDate: p.dueDate || new Date(),
      amount: p.amount,
      status: 'due',
      propertyId: p.propertyId,
      propertyName: p.propertyName,
    }));
  }

  private buildPaymentChartFromRecent(): void {
    const months = this.lastNMonthsLabels(12);
    const totals = new Map<string, number>();
    months.forEach(m => totals.set(m, 0));

    this.recentPayments.forEach(p => {
      const d = new Date(p.paidDate || p.dueDate || new Date());
      const label = d.toLocaleString('default', { month: 'short' });
      if (!totals.has(label)) return;
      const isPaid = String(p.status) === PaymentStatus.COMPLETED;
      if (isPaid) totals.set(label, (totals.get(label) || 0) + (p.amount || 0));
    });

    this.paymentChartData = {
      ...this.paymentChartData,
      labels: months,
      datasets: [
        {
          ...(this.paymentChartData.datasets[0] as any),
          data: months.map(m => totals.get(m) || 0),
          borderColor: this.BRAND_BLUE,
          backgroundColor: 'rgba(73,136,196,0.14)',
          pointBackgroundColor: this.BRAND_BLUE,
        },
      ],
    };
  }

  // Routes
  viewPropertyDetails(propertyId: any): void {
    this.router.navigate(['/property-details', propertyId]);
  }

  makePayment(paymentId: any): void {
    this.router.navigate(['/make-payment', paymentId]);
  }

  downloadPropertyLedger(propertyId: any): void {
    this.router.navigate(['/reports'], { queryParams: { type: 'ledger', propertyId } });
  }

  // No backend actions
  downloadStatement(): void {
    alert('Backend not connected yet: Statement download will be available after API integration.');
  }

  exportToExcel(): void {
    alert('Backend not connected yet: Excel export will be available after API integration.');
  }

  // Utils
  private daysAgo(days: number): string {
    const d = new Date();
    d.setDate(d.getDate() - days);
    return d.toISOString();
  }

  private daysFromNow(days: number): string {
    const d = new Date();
    d.setDate(d.getDate() + days);
    return d.toISOString();
  }

  private lastNMonthsLabels(n: number): string[] {
    const labels: string[] = [];
    const d = new Date();
    d.setDate(1);
    for (let i = n - 1; i >= 0; i--) {
      const x = new Date(d.getFullYear(), d.getMonth() - i, 1);
      labels.push(x.toLocaleString('default', { month: 'short' }));
    }
    return labels;
  }

  ngOnDestroy(): void {}
}
