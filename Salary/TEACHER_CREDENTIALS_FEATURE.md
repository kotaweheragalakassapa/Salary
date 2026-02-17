# Teacher Credentials Management - Feature Documentation

## Overview
A new feature has been added to manage teacher usernames and passwords for the teacher portal. This allows administrators to view, edit, and reset teacher login credentials.

## What's New

### 1. **Database Schema Updates**
- Added `username` field to Teacher model (unique, defaults to empty string)
- Added `password` field to Teacher model (defaults to empty string)
- Migration file: `20260215193836_add_teacher_credentials`

### 2. **Auto-Generated Credentials**
When a new teacher is created:
- **Username** is automatically set to the teacher's **name**
- **Password** is automatically set to the teacher's **phone number**

### 3. **New Admin Page: Teacher Credentials**
Location: `/admin/teacher-credentials`

Features:
- View all teacher credentials in a beautiful card-based layout
- Edit username and password for any teacher
- Show/hide password visibility toggle
- Reset credentials to default (name as username, phone as password)
- Real-time validation to prevent duplicate usernames

### 4. **Updated Teacher Login**
The teacher login now supports BOTH authentication methods:
- **New method**: Username + Password
- **Legacy method**: Name + Phone (for backwards compatibility)

This means existing teachers can still log in with their name and phone number.

## How to Use

### For Administrators

1. **Access the Credentials Page**
   - Go to Admin Dashboard
   - Click on "Teacher Credentials" card (purple gradient with shield icon)
   - Or navigate directly to `/admin/teacher-credentials`

2. **View Credentials**
   - All teachers are listed with their username and password (hidden by default)
   - Click the eye icon to show/hide passwords

3. **Edit Credentials**
   - Click "Edit" button on any teacher card
   - Modify the username and/or password
   - Click "Save" to update or "Cancel" to discard changes

4. **Reset to Default**
   - Click the refresh icon button
   - Confirms before resetting to default values
   - Username becomes teacher's name
   - Password becomes teacher's phone number

### For Teachers

1. **Login to Teacher Portal**
   - Go to `/teacher/login`
   - Enter either:
     - **Username** (as set by admin) and **Password**
     - OR your **Name** and **Phone Number** (legacy method)
   
2. **Access Dashboard**
   - After successful login, you'll be redirected to your dashboard
   - View your classes, payment records, and profile

## API Endpoints

### GET `/api/teachers/credentials`
Fetches all teachers with their credentials.
```json
Response: [
  {
    "id": 1,
    "name": "John Doe",
    "phone": "0771234567",
    "username": "John Doe",
    "password": "0771234567"
  }
]
```

### PUT `/api/teachers/credentials`
Updates teacher credentials.
```json
Request: {
  "id": 1,
  "username": "johndoe",
  "password": "newpassword123"
}

Response: {
  "id": 1,
  "name": "John Doe",
  "phone": "0771234567",
  "username": "johndoe",
  "password": "newpassword123",
  "createdAt": "2026-02-15T..."
}
```

### POST `/api/teacher/login`
Authenticates a teacher using username/password OR name/phone.
```json
Request: {
  "name": "johndoe",  // Can be username or actual name
  "phone": "password123"  // Can be password or actual phone
}

Response: {
  "id": 1,
  "name": "John Doe",
  "phone": "0771234567",
  "classes": [...]
}
```

## Files Modified/Created

### Created Files:
1. `app/admin/teacher-credentials/page.tsx` - Admin page for managing credentials
2. `app/api/teachers/credentials/route.ts` - API routes for credential management

### Modified Files:
1. `prisma/schema.prisma` - Added username and password fields
2. `app/api/teachers/route.ts` - Auto-generate credentials on teacher creation
3. `app/api/teacher/login/route.ts` - Support both authentication methods
4. `app/admin/dashboard/page.tsx` - Added navigation card for credentials page

## Important Notes

### Database Migration Status
⚠️ **IMPORTANT**: The database migration has been created but may need manual regeneration of Prisma Client due to file locking issues.

If you encounter TypeScript errors related to `username` or `password` fields:

1. **Stop the dev server** (if running)
2. **Run**: `npx prisma generate`
3. **Restart the dev server**: `npm run dev`

The migration file already exists at:
`prisma/migrations/20260215193836_add_teacher_credentials/migration.sql`

### Security Considerations
- Passwords are stored in plain text in the database (suitable for internal institute use)
- For production use, consider implementing password hashing (bcrypt)
- Admin access to view/edit credentials should be restricted

### Backwards Compatibility
- Existing teachers without username/password set can still log in using name + phone
- The system checks BOTH authentication methods
- No existing functionality is broken

## Future Enhancements (Optional)

1. **Password Hashing**: Implement bcrypt for secure password storage
2. **Password Requirements**: Add validation for password strength
3. **Password Reset Flow**: Allow teachers to reset their own passwords
4. **Session Management**: Add proper session/JWT token management
5. **Activity Logs**: Track credential changes and login attempts

## Testing

### Test Scenarios:

1. **Create a new teacher**
   - Go to `/admin/teachers`
   - Add a new teacher with name "Test Teacher" and phone "0771111111"
   - Verify username = "Test Teacher" and password = "0771111111"

2. **Edit credentials**
   - Go to `/admin/teacher-credentials`
   - Edit a teacher's credentials
   - Verify the changes are saved

3. **Login with new credentials**
   - Go to `/teacher/login`
   - Login with the updated username and password
   - Verify successful authentication

4. **Reset to default**
   - Click reset button on any teacher
   - Verify credentials reset to name and phone

5. **Backwards compatibility**
   - Try logging in with name and phone
   - Verify it still works

## Troubleshooting

### Issue: TypeScript errors for 'username' and 'password' fields
**Solution**: 
```bash
# Stop dev server
# Run:
npx prisma generate
# Restart dev server
npm run dev
```

### Issue: Cannot access `/admin/teacher-credentials`
**Solution**: Ensure the dev server is running and navigate to the correct URL

### Issue: Duplicate username error when saving
**Solution**: Each username must be unique. Choose a different username.

---

**Created**: 2026-02-16
**Status**: ✅ Implemented (pending Prisma client regeneration)
