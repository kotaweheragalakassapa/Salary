# Student-Based Payment System Migration

## Overview
The Nexus Institute payroll system has been successfully migrated from a **commission-based** system to a **student-based** payment system. This document outlines all the changes made and how the new system works.

---

## ⚙️ How the New System Works

### Old System (Commission-Based)
- Teachers receive a percentage (e.g., 80%) of total class fees collected
- Manual entry of total collection amount
- Simple commission calculation

### New System (Student-Based)
- Each class has **per-student** rates:
  - **Fee per Student** (e.g., Rs. 1,000) - Amount collected from each student
  - **Tute Cost per Student** (e.g., Rs. 200) - Materials/study aids cost
  - **Postal Fee per Student** (e.g., Rs. 300) - Delivery/shipping cost
  - **Institute Fee (%)** (e.g., 20%) - Percentage of total collection retained

- Collections are recorded with **number of students present** on that day
- Amount is auto-calculated: `studentCount × feePerStudent`

### Payment Calculation Formula
```
Total Collection = Sum of (studentCount × feePerStudent) for all classes
Tute Costs = Sum of (studentCount × tuteCostPerStudent)
Postal Fees = Sum of (studentCount × postalFeePerStudent)
Institute Fee = Total Collection × (Institute Fee Percentage / 100)

Gross Pay = Total Collection
Automatic Deductions = Tute Costs + Postal Fees + Institute Fee
Manual Deductions = Advances, loans, etc.
Total Deductions = Automatic Deductions + Manual Deductions

Net Pay = Gross Pay - Total Deductions
```

---

## 🗃️ Database Changes

### Modified Tables

#### `Class` Table
**New Fields Added:**
- `feePerStudent` (Float, default: 0) - Fee collected per student
- `tuteCostPerStudent` (Float, default: 0) - Material cost per student
- `postalFeePerStudent` (Float, default: 0) - Delivery cost per student
- `instituteFeePercentage` (Float, default: 0) - Percentage of total to deduct

#### `DailyCollection` Table
**New Field Added:**
- `studentCount` (Int, default: 0) - Number of students present in the class

**Modified Field:**
- `amount` - Now calculated automatically: `studentCount × class.feePerStudent`

---

## 📦 File Changes

### 1. Database Schema
**File:** `prisma/schema.prisma`
- Added 3 new fields to `Class` model
- Added `studentCount` field to `DailyCollection` model

### 2. Class Management
**File:** `app/admin/classes/page.tsx`
- Complete UI redesign with modern card layout
- Added input fields for:
  - Fee per Student
  - Tute Cost per Student
  - Postal Fee per Student
- Visual display of all fee structures per class
- Color-coded fee badges (Blue=Fees, Orange=Tute, Purple=Postal)

**File:** `app/api/classes/route.ts`
- Updated POST method to accept and save new fee fields

### 3. Collection Recording
**File:** `app/staff/collection/page.tsx`
- Changed from "Amount" input to "Student Count" input
- Auto-calculation display showing:
  - Fee per student for selected class
  - Total collection (students × fee)
- Real-time calculation preview
- Modern, premium UI with gradient styling

**File:** `app/api/collection/route.ts`
- Updated POST method to accept `studentCount`
- Stores both studentCount and calculated amount

### 4. Salary Calculation
**File:** `app/api/salary/route.ts`
- **Complete rewrite** of payment calculation logic
- New calculation based on student attendance
- Tracks:
  - Total students across all classes
  - Total tute costs (auto-calculated)
  - Total postal fees (auto-calculated)
  - Automatic deductions (tute + postal)
  - Manual deductions (advances, etc.)
- Returns comprehensive breakdown by class

### 5. Pay Slip
**File:** `app/admin/salary/print/page.tsx`
- Updated interface to show student-based data
- New table columns:
  - Students (count)
  - Fee per Student
  - Collection (total)
  - Tute Cost (total)
  - Postal Fee (total)
- Enhanced deductions section showing:
  - Institute Costs box (tute + postal)
  - Other deductions (advances, etc.)
  - Total deductions
- Professional, bank-ready design

### 6. Payroll Management
**File:** `app/admin/salary/page.tsx`
- Premium data table with modern styling
- Shows comprehensive payment breakdown
- Enhanced visual design with:
  - Teacher avatars (initials)
  - Color-coded amounts
  - Interactive button styles
  - Premium shadow effects

---

## 🎨 UI/UX Improvements

All pages now feature:
- Modern, rounded card designs
- Vibrant color coding:
  - **Blue** for fees/collections
  - **Orange** for tute costs
  - **Purple** for postal fees
  - **Red** for deductions
- Micro-animations and hover effects
- Better typography with clear hierarchies
- Responsive layouts
- Print-optimized pay slips

---

## 📊 Example Workflow

### Step 1: Create a Class
1. Go to **Admin → Manage Classes**
2. Enter class details:
   - Name: "Prachina Sinhala"
   - Fee per Student: Rs. 1,000
   - Tute Cost: Rs. 200
   - Postal Fee: Rs. 300
3. Click "Create Class"

### Step 1.1: Edit a Class
1. Go to **Admin → Manage Classes**
2. In the "Existing Classes" list, click the **✏️ Edit** button next to a class
3. The form at the top will switch to "Edit Class" mode
4. Update the details (e.g., change Fee or Institute Percentage)
5. Click "Update Class" to save changes

### Step 2: Assign Teacher to Class
1. Go to **Admin → Teachers**
2. Select a teacher
3. Assign the class (rate percentage is no longer used)

### Step 3: Record Daily Collection
1. Staff goes to **Staff → Daily Collection**
2. Select Date, Teacher, and Class
3. System shows fee per student (Rs. 1,000)
4. Enter number of students present: **20**
5. System calculates total: **Rs. 20,000**
6. Click "Save Collection"

### Step 4: View Pay Slip
1. Go to **Admin → Payroll Processing**
2. Select month
3. For the teacher:
   - **Total Collection**: Rs. 20,000 (20 students × Rs. 1,000)
   - **Tute Cost**: Rs. 4,000 (20 students × Rs. 200)
   - **Postal Fee**: Rs. 6,000 (20 students × Rs. 300)
   - **Automatic Deductions**: Rs. 10,000
   - **Manual Deductions**: Rs. 0 (if none)
   - **Net Pay**: Rs. 10,000
4. Click "View Slip" to download PDF

---

## 🔄 Migration Notes

### Existing Data
- **Classes**: Existing classes will have default fee values of 0. You need to update them with proper per-student fees.
- **Collections**: Old collections without studentCount will have default value of 0. Historical data may need manual adjustment.
- **Teacher Rates**: The percentage field is still in the database but is no longer used in calculations. You can remove teacher rates or keep them for reference.

### Backward Compatibility
The system is **NOT backward compatible** with the percentage-based model. All future calculations use the student-based approach.

---

## 🚀 Next Steps

1. **Update All Classes**: Go through each existing class and set the per-student fees
2. **Train Staff**: Ensure collection staff understand the new student count entry
3. **Verify Calculations**: Run a test month with both old and new calculations to verify accuracy
4. **Archive Old Data**: Consider exporting/backing up pre-migration salary data

---

## 🛠️ Technical Notes

### Server Status
- Development server running on: **http://localhost:3001**
- Prisma client auto-regenerated
- All TypeScript type errors resolved

### Known Limitations
- The old "percentage" field in TeacherRate table is still present but unused
- You may want to remove it in a future cleanup migration

### Troubleshooting
If you see TypeScript errors about missing fields:
1. Run `npx prisma generate` to regenerate Prisma client
2. Restart the development server: `npm run dev`

---

## 📝 Summary

The system has been successfully converted to track:
- ✅ Per-class, per-student fee structures
- ✅ Daily student attendance in collections
- ✅ Automatic calculation of institutional costs
- ✅ Detailed breakdown in pay slips
- ✅ Modern, premium UI across all pages

The new system provides better transparency, automatic cost calculation, and more accurate payment tracking based on actual attendance rather than estimated percentages.
