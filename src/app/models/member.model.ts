// ============================================
// BASE USER INTERFACES
// ============================================

export interface BaseUser {
  id: string;
  cnic: string;
  fullName: string;
  email: string;
  phone: string;
  dateOfBirth?: Date;
  gender?: 'male' | 'female' | 'other';
  profileImage?: string;
  address?: string;
  city?: string;
  state?: string;
  country: string;
  postalCode?: string;
  joinDate: Date;
  status: UserStatus;
  lastLogin?: Date;
  isActive: boolean;
  createdBy?: string;
  createdAt: Date;
  updatedBy?: string;
  updatedAt: Date;
}

export interface Member extends BaseUser {
  memberId: string;
  membershipNo: string;
  membershipDate: Date;
  membershipType: MembershipType;
  membershipStatus: 'active' | 'expired' | 'suspended' | 'cancelled';
  nomineeName?: string;
  nomineeCNIC?: string;
  nomineeRelation?: string;
  nomineeContact?: string;
  emergencyContactName?: string;
  emergencyContactPhone?: string;
  emergencyContactRelation?: string;
  occupation?: string;
  companyName?: string;
  designation?: string;
  sourceOfIncome?: string;
  annualIncome?: number;
  referredBy?: string;
  referralCode?: string;
  marketingConsent: boolean;
  communicationPreferences: CommunicationPreferences;
  kycStatus: 'pending' | 'verified' | 'rejected';
  kycVerifiedDate?: Date;
  totalInvestment: number;
  totalPaid: number;
  totalDue: number;
  creditScore?: number;
  riskProfile?: 'low' | 'medium' | 'high';
  propertiesCount: number;
}

export interface AdminUser extends BaseUser {
  adminId: string;
  employeeId: string;
  department: Department;
  designation: string;
  role: AdminRole;
  permissions: Permission[];
  reportingTo?: string;
  hireDate: Date;
  isSuperAdmin: boolean;
  canManageUsers: boolean;
  canManageProperties: boolean;
  canManagePayments: boolean;
  canGenerateReports: boolean;
  assignedRegions: string[];
}

// ============================================
// PROPERTY RELATED INTERFACES
// ============================================

export interface Property {
  id: string;
  propertyId: string;
  memberId: string;
  memberName: string;
  
  // Basic Details
  name: string;
  projectName: string;
  projectPhase: string;
  plotNo: string;
  block: string;
  sector: string;
  type: PropertyType;
  category: 'residential' | 'commercial' | 'agricultural' | 'industrial';
  
  // Size Details
  size: string; // e.g., "5 Marla", "10 Marla", "1 Kanal"
  areaInSqFt: number;
  areaInSqYards: number;
  dimensions?: string; // e.g., "50x90"
  
  // Location Details
  address: string;
  city: string;
  state: string;
  country: string;
  coordinates?: {
    latitude: number;
    longitude: number;
  };
  mapUrl?: string;
  landmark?: string;
  
  // Financial Details
  totalPrice: number;
  bookingAmount: number;
  downPayment: number;
  developmentCharges: number;
  otherCharges: number;
  installmentAmount: number;
  installmentFrequency: InstallmentFrequency;
  totalInstallments: number;
  paidInstallments: number;
  remainingInstallments: number;
  paidAmount: number;
  dueAmount: number;
  discountAmount?: number;
  taxAmount?: number;
  
  // Payment Schedule
  paymentSchedule: PaymentSchedule[];
  
  // Dates
  bookingDate: Date;
  allotmentDate?: Date;
  startDate: Date;
  expectedCompletionDate?: Date;
  actualCompletionDate?: Date;
  possessionDate?: Date;
  nextDueDate?: Date;
  
  // Status
  status: PropertyStatus;
  completionPercentage: number;
  isMortgaged: boolean;
  mortgageDetails?: MortgageDetails;
  
  // Documents
  documents: PropertyDocument[];
  
  // Amenities
  amenities: string[];
  
  // Development Updates
  developmentUpdates: DevelopmentUpdate[];
  
  // Metadata
  createdBy: string;
  createdAt: Date;
  updatedBy: string;
  updatedAt: Date;
}

export interface PaymentSchedule {
  id: string;
  scheduleId: string;
  propertyId: string;
  installmentNo: number;
  dueDate: Date;
  amount: number;
  principal: number;
  interest?: number;
  lateFee?: number;
  status: PaymentScheduleStatus;
  paidDate?: Date;
  paidAmount?: number;
  outstandingAmount: number;
  isOverdue: boolean;
  overdueDays?: number;
  remarks?: string;
}

export interface PropertyDocument {
  id: string;
  documentId: string;
  propertyId: string;
  documentType: DocumentType;
  documentName: string;
  description?: string;
  documentUrl: string;
  thumbnailUrl?: string;
  fileSize: number;
  fileType: string;
  isVerified: boolean;
  verifiedBy?: string;
  verifiedDate?: Date;
  verificationRemarks?: string;
  uploadedBy: string;
  uploadedDate: Date;
  expiryDate?: Date;
  isExpired: boolean;
  tags?: string[];
}

export interface MortgageDetails {
  mortgageId?: string;
  bankName: string;
  branchName: string;
  loanAmount: number;
  interestRate: number;
  tenureMonths: number;
  startDate: Date;
  endDate: Date;
  emiAmount: number;
  remainingEMIs: number;
  nextEMIDate?: Date;
  collateralDetails?: string;
  contactPerson?: string;
  contactPhone?: string;
  remarks?: string;
}

export interface DevelopmentUpdate {
  id: string;
  updateId: string;
  propertyId: string;
  title: string;
  description: string;
  phase: string;
  percentageComplete: number;
  images: string[];
  videos?: string[];
  postedBy: string;
  postDate: Date;
  isImportant: boolean;
  tags?: string[];
}

// ============================================
// PAYMENT RELATED INTERFACES
// ============================================

export interface Payment {
  id: string;
  paymentId: string;
  transactionId: string;
  referenceNo: string;
  receiptNo: string;
  
  // Payment Details
  memberId: string;
  memberName: string;
  propertyId: string;
  propertyName: string;
  installmentNo: number;
  
  // Amount Details
  amount: number;
  principalAmount: number;
  interestAmount?: number;
  lateFeeAmount?: number;
  discountAmount?: number;
  taxAmount?: number;
  netAmount: number;
  
  // Payment Method
  paymentMethod: PaymentMethod;
  paymentChannel?: PaymentChannel;
  bankName?: string;
  branchCode?: string;
  accountNumber?: string;
  chequeNo?: string;
  payOrderNo?: string;
  onlineGateway?: string;
  gatewayTransactionId?: string;
  
  // Status & Dates
  status: PaymentStatus;
  dueDate: Date;
  paidDate: Date;
  clearedDate?: Date;
  reversalDate?: Date;
  
  // Verification
  verifiedBy?: string;
  verifiedDate?: Date;
  verificationRemarks?: string;
  
  // Attachments
  attachments: PaymentAttachment[];
  
  // Metadata
  remarks?: string;
  createdBy?: string;
  createdAt: Date;
  updatedBy?: string;
  updatedAt: Date;
}

export interface PaymentAttachment {
  id: string;
  paymentId: string;
  fileName: string;
  fileUrl: string;
  fileType: string;
  fileSize: number;
  uploadedBy: string;
  uploadedDate: Date;
}

export interface PaymentReceipt {
  receiptId: string;
  paymentId: string;
  memberId: string;
  receiptDate: Date;
  receiptAmount: number;
  receiptUrl: string;
  downloadCount: number;
  lastDownloaded?: Date;
  isVerified: boolean;
}

// ============================================
// NOTIFICATION & ACTIVITY INTERFACES
// ============================================

export interface Notification {
  id: string;
  notificationId: string;
  memberId: string;
  title: string;
  message: string;
  type: NotificationType;
  priority: NotificationPriority;
  data?: any; // Additional data in JSON format
  isRead: boolean;
  isActionable: boolean;
  actionUrl?: string;
  actionLabel?: string;
  sentVia: NotificationChannel[];
  sentDate: Date;
  readDate?: Date;
  expiryDate?: Date;
  isExpired: boolean;
  createdBy?: string;
}

export interface ActivityLog {
  id: string;
  activityId: string;
  memberId: string;
  activityType: ActivityType;
  description: string;
  ipAddress?: string;
  userAgent?: string;
  deviceInfo?: string;
  location?: string;
  metadata?: any;
  timestamp: Date;
  status: 'success' | 'failure' | 'warning';
  errorMessage?: string;
}

// ============================================
// DASHBOARD & REPORT INTERFACES
// ============================================

export interface DashboardStats {
  // Property Stats
  totalProperties: number;
  activeProperties: number;
  completedProperties: number;
  pendingProperties: number;
  
  // Financial Stats
  totalInvestment: number;
  totalPaid: number;
  totalDue: number;
  totalOverdue: number;
  nextPaymentAmount: number;
  
  // Payment Stats
  paymentsThisMonth: number;
  paymentsThisYear: number;
  averagePaymentAmount: number;
  largestPaymentAmount: number;
  
  // Timeline Stats
  nextPaymentDate?: Date;
  lastPaymentDate?: Date;
  overduePaymentsCount: number;
  upcomingPaymentsCount: number;
  
  // Document Stats
  pendingDocuments: number;
  verifiedDocuments: number;
  expiredDocuments: number;
  
  // Recent Activity
  recentActivities: ActivityLog[];
  recentPayments: Payment[];
  recentNotifications: Notification[];
  
  // Charts Data
  monthlyPaymentData: MonthlyPaymentData[];
  propertyDistributionData: PropertyDistributionData[];
  paymentMethodDistribution: PaymentMethodDistribution[];
}

export interface MonthlyPaymentData {
  month: string;
  year: number;
  paidAmount: number;
  dueAmount: number;
  overdueAmount: number;
}

export interface PropertyDistributionData {
  propertyType: string;
  count: number;
  totalInvestment: number;
}

export interface PaymentMethodDistribution {
  method: string;
  count: number;
  totalAmount: number;
  percentage: number;
}

// ============================================
// REQUEST/RESPONSE INTERFACES
// ============================================

export interface LoginRequest {
  cnic: string;
  securityPin: string;
  rememberMe?: boolean;
  deviceId?: string;
  deviceName?: string;
}

export interface LoginResponse {
  success: boolean;
  token: string;
  refreshToken: string;
  expiresIn: number;
  expiresAt: Date;
  member: Member;
  permissions: string[];
  message?: string;
}

export interface RegisterRequest {
  fullName: string;
  cnic: string;
  email: string;
  phone: string;
  dateOfBirth?: Date;
  gender?: string;
  address?: string;
  city?: string;
  occupation?: string;
  referredBy?: string;
  securityPin: string;
  confirmPin: string;
  marketingConsent: boolean;
}

export interface PaymentRequest {
  propertyId: string;
  installmentNo: number;
  amount: number;
  paymentMethod: PaymentMethod;
  paymentDate: Date;
  transactionId?: string;
  bankName?: string;
  branchCode?: string;
  chequeNo?: string;
  payOrderNo?: string;
  onlineGateway?: string;
  remarks?: string;
  attachments?: File[];
}

export interface PaymentResponse {
  success: boolean;
  paymentId: string;
  transactionId: string;
  receiptNo: string;
  amount: number;
  paymentDate: Date;
  message: string;
  receiptUrl?: string;
}

export interface DocumentUploadRequest {
  propertyId: string;
  documentType: DocumentType;
  file: File;
  description?: string;
  expiryDate?: Date;
  tags?: string[];
}

export interface DocumentUploadResponse {
  success: boolean;
  documentId: string;
  documentName: string;
  documentUrl: string;
  thumbnailUrl?: string;
  message: string;
}

export interface ChangePinRequest {
  oldPin: string;
  newPin: string;
  confirmPin: string;
}

export interface ForgotPinRequest {
  cnic: string;
  email: string;
}

export interface ResetPinRequest {
  token: string;
  newPin: string;
  confirmPin: string;
}

export interface ProfileUpdateRequest {
  fullName?: string;
  email?: string;
  phone?: string;
  dateOfBirth?: Date;
  gender?: string;
  address?: string;
  city?: string;
  state?: string;
  country?: string;
  postalCode?: string;
  occupation?: string;
  companyName?: string;
  emergencyContactName?: string;
  emergencyContactPhone?: string;
  emergencyContactRelation?: string;
  nomineeName?: string;
  nomineeCNIC?: string;
  nomineeRelation?: string;
  marketingConsent?: boolean;
}

export interface ContactRequest {
  name: string;
  email: string;
  phone: string;
  subject: string;
  message: string;
  propertyId?: string;
  attachment?: File;
}

// ============================================
// FILTER & PAGINATION INTERFACES
// ============================================

export interface PaymentFilter {
  propertyId?: string;
  paymentMethod?: PaymentMethod;
  status?: PaymentStatus;
  startDate?: Date;
  endDate?: Date;
  minAmount?: number;
  maxAmount?: number;
  searchTerm?: string;
}

export interface PropertyFilter {
  type?: PropertyType;
  status?: PropertyStatus;
  city?: string;
  projectName?: string;
  minPrice?: number;
  maxPrice?: number;
  searchTerm?: string;
}

export interface PaginationParams {
  page: number;
  pageSize: number;
  sortBy?: string;
  sortDirection?: 'asc' | 'desc';
}

export interface PaginatedResponse<T> {
  items: T[];
  totalCount: number;
  page: number;
  pageSize: number;
  totalPages: number;
  hasPrevious: boolean;
  hasNext: boolean;
}

export interface ApiResponse<T> {
  success: boolean;
  data: T;
  message?: string;
  errors?: string[];
  timestamp: Date;
  statusCode: number;
}

// ============================================
// SETTINGS & PREFERENCES
// ============================================

export interface CommunicationPreferences {
  emailNotifications: boolean;
  smsNotifications: boolean;
  pushNotifications: boolean;
  paymentReminders: boolean;
  dueDateReminders: boolean;
  marketingEmails: boolean;
  announcementEmails: boolean;
  statementEmails: boolean;
  documentUpdateAlerts: boolean;
}

export interface UserSettings {
  theme: 'light' | 'dark' | 'auto';
  language: string;
  timezone: string;
  dateFormat: string;
  currency: string;
  notificationSound: boolean;
  autoLogoutMinutes: number;
  twoFactorAuth: boolean;
  dataRefreshInterval: number;
}

// ============================================
// ENUMS
// ============================================

export enum UserStatus {
  ACTIVE = 'active',
  INACTIVE = 'inactive',
  PENDING = 'pending',
  SUSPENDED = 'suspended',
  BLOCKED = 'blocked',
  DELETED = 'deleted'
}

export enum MembershipType {
  REGULAR = 'regular',
  SILVER = 'silver',
  GOLD = 'gold',
  PLATINUM = 'platinum',
  VIP = 'vip',
  CORPORATE = 'corporate'
}

export enum PropertyType {
  RESIDENTIAL_PLOT = 'residential_plot',
  COMMERCIAL_PLOT = 'commercial_plot',
  RESIDENTIAL_HOUSE = 'residential_house',
  COMMERCIAL_SHOP = 'commercial_shop',
  APARTMENT = 'apartment',
  FARM_HOUSE = 'farm_house',
  AGRICULTURAL_LAND = 'agricultural_land',
  INDUSTRIAL_LAND = 'industrial_land',
  OFFICE_SPACE = 'office_space',
  WAREHOUSE = 'warehouse'
}

export enum PropertyStatus {
  BOOKED = 'booked',
  ALLOTTED = 'allotted',
  UNDER_CONSTRUCTION = 'under_construction',
  COMPLETED = 'completed',
  POSSESSION_GRANTED = 'possession_granted',
  SOLD = 'sold',
  TRANSFERRED = 'transferred',
  CANCELLED = 'cancelled',
  DEFAULTED = 'defaulted',
  LEGAL_ISSUE = 'legal_issue'
}

export enum InstallmentFrequency {
  MONTHLY = 'monthly',
  QUARTERLY = 'quarterly',
  HALF_YEARLY = 'half_yearly',
  YEARLY = 'yearly',
  BI_MONTHLY = 'bi_monthly',
  CUSTOM = 'custom'
}

export enum PaymentScheduleStatus {
  PENDING = 'pending',
  DUE = 'due',
  OVERDUE = 'overdue',
  PAID = 'paid',
  PARTIALLY_PAID = 'partially_paid',
  WAIVED = 'waived',
  CANCELLED = 'cancelled'
}

export enum PaymentStatus {
  PENDING = 'pending',
  PROCESSING = 'processing',
  COMPLETED = 'completed',
  FAILED = 'failed',
  CANCELLED = 'cancelled',
  REFUNDED = 'refunded',
  PARTIALLY_REFUNDED = 'partially_refunded',
  ON_HOLD = 'on_hold',
  REVERSED = 'reversed'
}

export enum PaymentMethod {
  CASH = 'cash',
  BANK_TRANSFER = 'bank_transfer',
  CHEQUE = 'cheque',
  PAY_ORDER = 'pay_order',
  DEMAND_DRAFT = 'demand_draft',
  ONLINE_BANKING = 'online_banking',
  CREDIT_CARD = 'credit_card',
  DEBIT_CARD = 'debit_card',
  JAZZ_CASH = 'jazz_cash',
  EASY_PAISA = 'easypaisa',
  SADA_PAY = 'sadapay',
  NAYA_PAY = 'nayapay',
  OTHER = 'other'
}

export enum PaymentChannel {
  BANK_COUNTER = 'bank_counter',
  ATM = 'atm',
  ONLINE = 'online',
  MOBILE_APP = 'mobile_app',
  BRANCH_OFFICE = 'branch_office',
  AGENT = 'agent'
}

export enum DocumentType {
  CNIC_FRONT = 'cnic_front',
  CNIC_BACK = 'cnic_back',
  ALLOTMENT_LETTER = 'allotment_letter',
  PAYMENT_RECEIPT = 'payment_receipt',
  BOOKING_FORM = 'booking_form',
  AGREEMENT = 'agreement',
  POSSESSION_LETTER = 'possession_letter',
  TITLE_DEED = 'title_deed',
  NOC = 'noc',
  MAP = 'map',
  SITE_PLAN = 'site_plan',
  APPROVAL_PLAN = 'approval_plan',
  TAX_CERTIFICATE = 'tax_certificate',
  UTILITY_BILL = 'utility_bill',
  BANK_STATEMENT = 'bank_statement',
  INCOME_PROOF = 'income_proof',
  PHOTOGRAPH = 'photograph',
  OTHER = 'other'
}

export enum NotificationType {
  PAYMENT_REMINDER = 'payment_reminder',
  PAYMENT_CONFIRMATION = 'payment_confirmation',
  PAYMENT_OVERDUE = 'payment_overdue',
  DOCUMENT_UPLOADED = 'document_uploaded',
  DOCUMENT_VERIFIED = 'document_verified',
  DOCUMENT_EXPIRED = 'document_expired',
  PROFILE_UPDATED = 'profile_updated',
  PASSWORD_CHANGED = 'password_changed',
  PIN_CHANGED = 'pin_changed',
  NEW_PROPERTY_ALLOTTED = 'new_property_allotted',
  POSSESSION_GRANTED = 'possession_granted',
  DEVELOPMENT_UPDATE = 'development_update',
  ANNOUNCEMENT = 'announcement',
  SYSTEM_MAINTENANCE = 'system_maintenance',
  SECURITY_ALERT = 'security_alert',
  MARKETING = 'marketing',
  FEEDBACK_REQUEST = 'feedback_request'
}

export enum NotificationPriority {
  LOW = 'low',
  MEDIUM = 'medium',
  HIGH = 'high',
  URGENT = 'urgent'
}

export enum NotificationChannel {
  EMAIL = 'email',
  SMS = 'sms',
  PUSH = 'push',
  IN_APP = 'in_app',
  WHATSAPP = 'whatsapp'
}

export enum ActivityType {
  LOGIN = 'login',
  LOGOUT = 'logout',
  LOGIN_FAILED = 'login_failed',
  PASSWORD_CHANGE = 'password_change',
  PIN_CHANGE = 'pin_change',
  PROFILE_UPDATE = 'profile_update',
  PAYMENT_MADE = 'payment_made',
  PAYMENT_FAILED = 'payment_failed',
  DOCUMENT_UPLOAD = 'document_upload',
  DOCUMENT_DOWNLOAD = 'document_download',
  STATEMENT_DOWNLOAD = 'statement_download',
  REPORT_GENERATED = 'report_generated',
  PROPERTY_VIEWED = 'property_viewed',
  NOTIFICATION_READ = 'notification_read',
  SETTINGS_CHANGED = 'settings_changed',
  CONTACT_REQUEST = 'contact_request',
  FEEDBACK_SUBMITTED = 'feedback_submitted'
}

export enum Department {
  ADMINISTRATION = 'administration',
  SALES = 'sales',
  FINANCE = 'finance',
  CUSTOMER_SERVICE = 'customer_service',
  LEGAL = 'legal',
  TECHNICAL = 'technical',
  MARKETING = 'marketing',
  IT = 'it'
}

export enum AdminRole {
  SUPER_ADMIN = 'super_admin',
  ADMIN = 'admin',
  MANAGER = 'manager',
  EXECUTIVE = 'executive',
  SUPPORT = 'support',
  VIEWER = 'viewer'
}

export interface Permission {
  module: string;
  canView: boolean;
  canCreate: boolean;
  canEdit: boolean;
  canDelete: boolean;
  canApprove: boolean;
  canExport: boolean;
}

// ============================================
// HELPER TYPES
// ============================================

export type SuccessResponse = {
  success: boolean;
  message: string;
  data?: any;
};

export type ErrorResponse = {
  success: boolean;
  message: string;
  errors?: string[];
  errorCode?: string;
};

export type FileUploadProgress = {
  fileName: string;
  progress: number;
  status: 'uploading' | 'completed' | 'failed';
  error?: string;
};
// In src/app/models/member.model.ts
export interface DashboardStats {
  // Property Stats
  totalProperties: number;
  activeProperties: number;
  completedProperties: number;
  pendingProperties: number;
  
  // Financial Stats
  totalInvestment: number;    // ✅ This is the correct property name
  totalPaid: number;
  totalDue: number;
  totalOverdue: number;
  nextPaymentAmount: number;
  
  // Payment Stats
  paymentsThisMonth: number;
  paymentsThisYear: number;
  averagePaymentAmount: number;
  largestPaymentAmount: number;
  
  // Timeline Stats
  nextPaymentDate?: Date;
  lastPaymentDate?: Date;
  overduePaymentsCount: number;  // ✅ This is the correct property name
  upcomingPaymentsCount: number;
  
  // Document Stats
  pendingDocuments: number;
  verifiedDocuments: number;
  expiredDocuments: number;
  
  // Recent Activity
  recentActivities: ActivityLog[];
  recentPayments: Payment[];
  recentNotifications: Notification[];
  
  // Charts Data
  monthlyPaymentData: MonthlyPaymentData[];
  propertyDistributionData: PropertyDistributionData[];
  paymentMethodDistribution: PaymentMethodDistribution[];
}

// ============================================
// CONSTANTS
// ============================================

export const PAYMENT_METHODS = [
  { value: PaymentMethod.CASH, label: 'Cash', icon: 'fa-money-bill' },
  { value: PaymentMethod.BANK_TRANSFER, label: 'Bank Transfer', icon: 'fa-university' },
  { value: PaymentMethod.CHEQUE, label: 'Cheque', icon: 'fa-money-check' },
  { value: PaymentMethod.PAY_ORDER, label: 'Pay Order', icon: 'fa-file-invoice-dollar' },
  { value: PaymentMethod.ONLINE_BANKING, label: 'Online Banking', icon: 'fa-globe' },
  { value: PaymentMethod.JAZZ_CASH, label: 'JazzCash', icon: 'fa-mobile-alt' },
  { value: PaymentMethod.EASY_PAISA, label: 'Easypaisa', icon: 'fa-wallet' }
];

export const PROPERTY_TYPES = [
  { value: PropertyType.RESIDENTIAL_PLOT, label: 'Residential Plot' },
  { value: PropertyType.COMMERCIAL_PLOT, label: 'Commercial Plot' },
  { value: PropertyType.RESIDENTIAL_HOUSE, label: 'Residential House' },
  { value: PropertyType.APARTMENT, label: 'Apartment' },
  { value: PropertyType.FARM_HOUSE, label: 'Farm House' },
  { value: PropertyType.AGRICULTURAL_LAND, label: 'Agricultural Land' }
];

export const DOCUMENT_TYPES = [
  { value: DocumentType.CNIC_FRONT, label: 'CNIC (Front)' },
  { value: DocumentType.CNIC_BACK, label: 'CNIC (Back)' },
  { value: DocumentType.ALLOTMENT_LETTER, label: 'Allotment Letter' },
  { value: DocumentType.PAYMENT_RECEIPT, label: 'Payment Receipt' },
  { value: DocumentType.AGREEMENT, label: 'Agreement' },
  { value: DocumentType.POSSESSION_LETTER, label: 'Possession Letter' },
  { value: DocumentType.TITLE_DEED, label: 'Title Deed' }
];

// ============================================
// TYPE GUARDS
// ============================================

export function isMember(user: any): user is Member {
  return user && 'memberId' in user && 'membershipNo' in user;
}

export function isAdmin(user: any): user is AdminUser {
  return user && 'adminId' in user && 'employeeId' in user;
}

export function isPaymentComplete(payment: Payment): boolean {
  return payment.status === PaymentStatus.COMPLETED;
}

export function isPropertyCompleted(property: Property): boolean {
  return property.status === PropertyStatus.COMPLETED || 
         property.status === PropertyStatus.POSSESSION_GRANTED;
}

// ============================================
// UTILITY FUNCTIONS
// ============================================

export function calculateRemainingAmount(property: Property): number {
  return property.totalPrice - property.paidAmount;
}

export function calculateCompletionPercentage(property: Property): number {
  if (property.totalInstallments === 0) return 0;
  return (property.paidInstallments / property.totalInstallments) * 100;
}

export function getNextDueDate(property: Property): Date | null {
  const pendingSchedule = property.paymentSchedule.find(
    schedule => schedule.status === PaymentScheduleStatus.PENDING || 
                schedule.status === PaymentScheduleStatus.DUE
  );
  return pendingSchedule ? pendingSchedule.dueDate : null;
}

export function getOverdueAmount(property: Property): number {
  return property.paymentSchedule
    .filter(schedule => schedule.status === PaymentScheduleStatus.OVERDUE)
    .reduce((sum, schedule) => sum + schedule.outstandingAmount, 0);
}

// ============================================
// DEFAULT VALUES
// ============================================

export const DEFAULT_MEMBER: Partial<Member> = {
  status: UserStatus.ACTIVE,
  membershipType: MembershipType.REGULAR,
  membershipStatus: 'active',
  marketingConsent: false,
  kycStatus: 'pending',
  totalInvestment: 0,
  totalPaid: 0,
  totalDue: 0,
  propertiesCount: 0,
  communicationPreferences: {
    emailNotifications: true,
    smsNotifications: true,
    pushNotifications: true,
    paymentReminders: true,
    dueDateReminders: true,
    marketingEmails: false,
    announcementEmails: true,
    statementEmails: true,
    documentUpdateAlerts: true
  }
};

export const DEFAULT_DASHBOARD_STATS: DashboardStats = {
  totalProperties: 0,
  activeProperties: 0,
  completedProperties: 0,
  pendingProperties: 0,
  totalInvestment: 0,
  totalPaid: 0,
  totalDue: 0,
  totalOverdue: 0,
  nextPaymentAmount: 0,
  paymentsThisMonth: 0,
  paymentsThisYear: 0,
  averagePaymentAmount: 0,
  largestPaymentAmount: 0,
  overduePaymentsCount: 0,
  upcomingPaymentsCount: 0,
  pendingDocuments: 0,
  verifiedDocuments: 0,
  expiredDocuments: 0,
  recentActivities: [],
  recentPayments: [],
  recentNotifications: [],
  monthlyPaymentData: [],
  propertyDistributionData: [],
  paymentMethodDistribution: []
};