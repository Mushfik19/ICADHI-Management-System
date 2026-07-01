# Database

This project is configured for MySQL through Prisma.

Local setup:

```sql
CREATE DATABASE icadhi CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
```

Use this connection format in `.env`:

```env
DATABASE_URL=mysql://root:your_mysql_password@127.0.0.1:3306/icadhi
```

Then run:

```powershell
npm.cmd install
npm.cmd --prefix backend run db:generate
npm.cmd --prefix backend run db:push
npm.cmd --prefix backend run db:seed
```

Planned tables: Users, Roles, Permissions, Participants, Speakers, Sessions, Workshops, Abstracts, Reviews, Sponsors, Exhibitors, Booths, Hotels, Rooms, Vehicles, Drivers, FoodItems, MealLogs, Certificates, Badges, Attendance, QRScans, Notifications, Messages, AuditLogs, Invoices, Payments, Expenses, Settings, Countries, Universities, MedicalLogs, EmergencyContacts.
