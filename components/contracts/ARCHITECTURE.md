```
CONTRACT STATUS MANAGEMENT - COMPONENT ARCHITECTURE
====================================================

┌─────────────────────────────────────────────────────────────────┐
│                        ActionContainer                          │
│  Main orchestrator component for contract status display       │
│                                                                   │
│  • Manages 13 distinct statuses (S0-S12)                        │
│  • Renders status-specific UI and actions                       │
│  • Controls modal visibility                                     │
│  • Handles conditional rendering (physical_mode)                │
└───────────────────────┬─────────────────────────────────────────┘
                        │
                        │ Opens/Manages
                        │
        ┌───────────────┼───────────────┬─────────────────┐
        │               │               │                 │
        ▼               ▼               ▼                 ▼
┌──────────────┐ ┌──────────────┐ ┌─────────────┐ ┌─────────────┐
│  Shipping    │ │   Confirm    │ │    Video    │ │  Feedback   │
│   Address    │ │   Delivery   │ │   Upload    │ │   Modal     │
│    Modal     │ │    Modal     │ │    Modal    │ │  (existing) │
│              │ │              │ │             │ │             │
│ Status 4     │ │ Status 5     │ │ Status 6,8  │ │ Status 12   │
└──────────────┘ └──────┬───────┘ └─────────────┘ └─────────────┘
                        │
                        │ Uses
                        │
                ┌───────┴────────┐
                │                │
                ▼                ▼
        ┌──────────────┐  ┌──────────────┐
        │    Custom    │  │    Video     │
        │   Checkbox   │  │   Download   │
        │              │  │     Card     │
        └──────────────┘  └──────────────┘


STATUS FLOW DIAGRAM
===================

START
  │
  ├─ Status 0: Application Accepted (Success)
  │    └─> Auto-advance by brand
  │
  ├─ Status 1: Contract Sent (Info)
  │    └─> View Contract → Influencer signs
  │
  ├─ Status 2: Contract Signed (Success)
  │    └─> Auto-advance by brand
  │
  ├─ Status 3: Collaboration Confirmed (Success)
  │    └─> Auto-advance by brand
  │
  ├─ [PHYSICAL MODE ONLY]
  │   │
  │   ├─ Status 4: Shipping Pending (Warning)
  │   │    └─> Update Address → Brand ships
  │   │
  │   └─ Status 5: Delivery Pending (Warning)
  │        └─> Confirm Delivery + Upload Proof → Advance
  │
  ├─ Status 6: Video Pending (Warning)
  │    └─> Upload Video → Advance
  │
  ├─ Status 7: Review Pending (Info)
  │    └─> Brand reviews → Approve or Request Revision
  │    │
  │    ├─ If Approved: Go to Status 9
  │    │
  │    └─ If Revision Needed: Go to Status 8
  │         │
  │         └─ Status 8: Revision Pending (Warning)
  │              └─> Reupload Video → Back to Status 7
  │
  ├─ Status 9: Release Pending (Success)
  │    └─> Brand schedules → Advance
  │
  ├─ Status 10: Release Scheduled (Info)
  │    └─> Influencer posts on date → Advance
  │
  ├─ Status 11: Video Posted (Success)
  │    └─> Brand processes payment → Advance
  │
  └─ Status 12: Settlement Done (Success)
       └─> Give Feedback → END


FILE STRUCTURE
==============

/components/contracts/
├── ActionContainer.tsx           # Main component (456 lines)
├── ShippingAddressModal.tsx      # Address form (221 lines)
├── ConfirmDeliveryModal.tsx      # Delivery confirmation (219 lines)
├── VideoUploadModal.tsx          # Video upload (254 lines)
├── VideoDownloadCard.tsx         # Video preview (143 lines)
├── CustomCheckbox.tsx            # Custom checkbox (53 lines)
├── index.tsx                     # Exports (13 lines)
├── example-usage.tsx             # Integration example (265 lines)
├── README.md                     # Usage guide (471 lines)
├── CHANGELOG.md                  # Feature docs (242 lines)
├── TEST_GUIDELINES.md            # Test cases (245 lines)
└── IMPLEMENTATION_SUMMARY.md     # Overview (232 lines)

/interfaces/
└── IContracts.ts                 # TypeScript interface (32 lines)


COMPONENT DEPENDENCIES
======================

ActionContainer
├── Uses: ShippingAddressModal
├── Uses: ConfirmDeliveryModal
├── Uses: VideoUploadModal
├── Uses: VideoDownloadCard
├── Uses: FeedbackModal (existing)
└── Props: IContracts interface

ShippingAddressModal
├── Uses: TextInput (react-native-paper)
├── Uses: Button (react-native-paper)
└── Uses: Modal (react-native)

ConfirmDeliveryModal
├── Uses: CustomCheckbox
├── Uses: TextInput (react-native-paper)
├── Uses: Button (react-native-paper)
└── Uses: Modal (react-native)

VideoUploadModal
├── Uses: Button (react-native-paper)
├── Uses: Modal (react-native)
└── Uses: ActivityIndicator (react-native)

VideoDownloadCard
├── Uses: Button (react-native-paper)
└── Uses: FontAwesome icons

CustomCheckbox
├── Uses: Pressable (react-native)
└── Uses: FontAwesome check icon


DATA FLOW
=========

User Action → Modal Opens → User Fills Form
     ↓
Firebase Handler Called
     ↓
Upload to Storage (if file)
     ↓
Update Firestore Document
     ↓
Contract State Updates
     ↓
ActionContainer Re-renders
     ↓
New Status UI Displayed


INTEGRATION POINTS
==================

1. Firebase Storage
   ├── /contracts/{id}/videos/{timestamp}.mp4
   └── /contracts/{id}/delivery-proof/{timestamp}.jpg

2. Firestore Collections
   ├── users → shippingAddress
   └── contracts → status, videoUrl, deliveryProof, etc.

3. Expo APIs
   ├── expo-image-picker → Image/Video selection
   └── expo-file-system → File downloads

4. Navigation
   └── router.push('/messages') → Chat navigation


STYLING SYSTEM
==============

Colors (Theme-aware)
├── Warning Box: #FFC107 (Yellow)
├── Success Box: #C8E6C9 (Green)
└── Info Box: theme.gray200 (Blue/Gray)

Icons (FontAwesome)
├── faClock → Warning
├── faCheckCircle → Success
├── faCircleInfo → Info
├── faUpload → Upload
├── faDownload → Download
└── faPlay → Video preview

Buttons (react-native-paper)
├── contained → Primary actions
├── outlined → Secondary actions
└── text → Tertiary actions
```
