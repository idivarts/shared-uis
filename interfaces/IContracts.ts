export interface IContracts {
  id?: string;
  status: 0 | 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10 | 11 | 12;
  collaborationType?: 'physical_mode' | 'digital_mode' | 'service_mode';
  shippingAddress?: {
    street: string;
    city: string;
    state: string;
    zip: string;
    country: string;
  };
  deliveryConfirmedAt?: number;
  deliveryProof?: string;
  deliveryNotes?: string;
  videoUrl?: string;
  videoSubmittedAt?: number;
  revisionRequest?: {
    reason: string;
    requestedAt: number;
  };
  releaseScheduledFor?: number;
  releasePostedAt?: number;
  feedbackFromInfluencer?: {
    rating: number;
    feedback: string;
    submittedAt: number;
  };
  createdAt?: number;
  updatedAt?: number;
}
