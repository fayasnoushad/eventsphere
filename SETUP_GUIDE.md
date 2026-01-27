# EventSphere Setup & Migration Guide

## Quick Start

### 1. Install Dependencies

```bash
pnpm install
```

### 2. Environment Setup

Create a `.env` file:

```env
MONGODB_URI=mongodb://localhost:27017/eventsphere
JWT_SECRET=change-this-to-a-random-secret-key
NODE_ENV=development
```

### 3. Start Development Server

```bash
pnpm dev
```

Visit: http://localhost:3000

## What Changed?

### Old System (Single Event)

- ❌ Hardcoded event details in code
- ❌ Single event only
- ❌ Admin password in .env
- ❌ Manual code changes for new events

### New System (Multi-Tenant Platform)

- ✅ **User Accounts** - Organizations create accounts
- ✅ **Unlimited Events** - Each organizer manages multiple events
- ✅ **Dynamic Creation** - Create events through UI
- ✅ **Secure Auth** - JWT-based authentication
- ✅ **Data Isolation** - Complete separation between organizers

## Key Features Added

### 1. Authentication System

- Organizer signup/login
- Session management
- Protected routes
- Secure password hashing

### 2. Event Management

- Create events with full details
- Add sub-events/competitions
- Set registration fees
- Publish/unpublish events
- Edit or delete events

### 3. Multi-Tenant Support

- Each organizer has their own events
- Participants register for specific events
- Separate participant lists per event
- Independent check-in systems

### 4. Enhanced Registration

- Event-specific forms
- Sub-event selection
- Meal preferences (optional)
- Approval workflow (optional)
- QR code tickets per event

## Database Structure

### Collections

**users** - Organizer accounts

```javascript
{
  email: string,
  password: string (hashed),
  organizationName: string,
  contactPerson: string,
  phone: string,
  createdAt: Date
}
```

**events** - Tech fests/hackathons

```javascript
{
  organizerId: string,
  name: string,
  slug: string,
  description: string,
  type: "tech-fest" | "hackathon" | "workshop",
  status: "draft" | "published",
  venue: string,
  startDate: Date,
  endDate: Date,
  registrationDeadline: Date,
  registrationFee: number,
  subEvents: [...],
  totalRegistrations: number
}
```

**participants** - Event registrations

```javascript
{
  eventId: string,
  participantId: string,
  name: string,
  email: string,
  phone: string,
  college: string,
  selectedSubEvents: [...],
  status: "pending" | "approved" | "checked-in",
  registeredAt: Date
}
```

**checkins** - Check-in records

```javascript
{
  eventId: string,
  participantId: string,
  checkedInBy: string,
  checkedInAt: Date
}
```

## User Workflows

### Organizer Workflow

1. Sign up at `/auth/signup`
2. Login at `/auth/login`
3. Create event at `/dashboard/events/create`
4. Publish event
5. Monitor registrations at `/dashboard/events/[id]/participants`
6. Check-in participants during event

### Participant Workflow

1. Browse events at `/` (homepage)
2. View event details at `/events/[slug]`
3. Register at `/events/[slug]/register`
4. Receive QR code ticket
5. Present QR at event for check-in

## API Endpoints

### Authentication

- `POST /api/auth/signup` - Create account
- `POST /api/auth/login` - Login
- `POST /api/auth/logout` - Logout
- `GET /api/auth/session` - Get current user

### Events

- `GET /api/events` - List events
- `POST /api/events` - Create event
- `GET /api/events/[id]` - Get event
- `PUT /api/events/[id]` - Update event
- `DELETE /api/events/[id]` - Delete event
- `POST /api/events/[id]/publish` - Change status

### Participants

- `POST /api/register` - Register for event
- `GET /api/participants?eventId=xxx` - List participants
- `POST /api/approve` - Approve participant
- `GET /api/pending?eventId=xxx` - Pending approvals

### Check-in

- `POST /api/checkin` - Check-in participant
- `DELETE /api/checkin` - Remove check-in

## Migration from Old System

If you have existing data:

1. **Export participants** from old `participants` collection
2. **Create organizer account** via signup
3. **Create your event** with all details
4. **Import participants** with the new `eventId`

Note: Old `PASSWORD` env variable is no longer used.

## Security Notes

- Passwords are hashed using SHA-256
- JWT tokens stored in HTTP-only cookies
- CSRF protection via SameSite cookies
- Input validation on all forms
- MongoDB injection prevention

## Deployment

### Environment Variables for Production

```env
MONGODB_URI=mongodb+srv://user:pass@cluster.mongodb.net/eventsphere
JWT_SECRET=use-a-strong-random-secret-here
NODE_ENV=production
```

### Vercel Deployment

1. Push to GitHub
2. Import in Vercel
3. Add environment variables
4. Deploy!

## Troubleshooting

### "Unauthorized" errors

- Check if logged in
- Verify JWT_SECRET is set
- Clear cookies and login again

### Database connection issues

- Verify MONGODB_URI is correct
- Check network access in MongoDB Atlas
- Ensure database exists

### Build errors

- Run `pnpm install` again
- Check TypeScript errors
- Verify all dependencies installed

## Support

For issues:

1. Check console logs
2. Verify environment variables
3. Test API routes directly
4. Review MongoDB connection

## Next Steps

1. Create your first organizer account
2. Set up your event
3. Test registration flow
4. Customize branding
5. Deploy to production

Happy event managing! 🎉
