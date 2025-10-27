# Supabase Setup Guide

## 📋 Database Setup

Your fitness app is now connected to Supabase! Follow these steps to set up the database.

### 1. Run the SQL Schema

1. Go to your [Supabase Dashboard](https://supabase.com/dashboard)
2. Select your project
3. Navigate to **SQL Editor** (left sidebar)
4. Click **New Query**
5. Copy the contents of `supabase-schema.sql` and paste it into the editor
6. Click **Run** (or press Cmd/Ctrl + Enter)

This will create:

- ✅ `workouts` table with proper structure
- ✅ Row Level Security (RLS) policies
- ✅ Indexes for better performance
- ✅ Automatic timestamp updates

### 2. Verify Setup

Check that the table was created successfully:

```sql
SELECT * FROM workouts;
```

You should see an empty table with columns:

- `id` (uuid)
- `user_id` (uuid)
- `name` (text)
- `emoji` (text)
- `date` (date)
- `sets` (jsonb)
- `completed` (boolean)
- `created_at` (timestamp)
- `updated_at` (timestamp)

### 3. Test Your App

1. Sign in to your app
2. Add a workout
3. Check Supabase Dashboard > **Table Editor** > `workouts` to see your data

## 🔒 Security

Row Level Security (RLS) is enabled, which means:

- ✅ Users can only see their own workouts
- ✅ Users can only modify their own data
- ✅ All operations require authentication

## 🎯 Features

### What's Connected:

- ✅ **Create** workouts with sets and reps
- ✅ **Read** workouts filtered by date
- ✅ **Update** workout progress (complete sets)
- ✅ **Delete** workouts
- ✅ Real-time data sync across devices

### Data Structure:

Each workout stores:

```typescript
{
  id: string;
  user_id: string;
  name: "Bench Press";
  emoji: "🏋️";
  date: "2025-10-27";
  sets: [
    { reps: 10, completed: false },
    { reps: 10, completed: false },
    { reps: 10, completed: false },
  ];
  completed: false;
}
```

## 🔧 Troubleshooting

### "Failed to load workouts"

- Check that you ran the SQL schema
- Verify RLS policies are active
- Ensure user is authenticated

### "Failed to add workout"

- Check your environment variables
- Verify Supabase URL and anon key
- Check network connection

### Data not showing

- Refresh the app
- Check the selected date
- Verify data in Supabase Dashboard

## 📱 How It Works

1. **On app load**: Fetches workouts for selected date
2. **Add workout**: Inserts into Supabase, updates local state
3. **Tap card**: Updates specific set, syncs to Supabase
4. **Change date**: Fetches new workouts for that date
5. **Delete**: Removes from Supabase and local state

All operations are optimistic - UI updates immediately while Supabase syncs in the background!

## 🚀 Next Steps

Consider adding:

- 📊 Statistics and analytics
- 🔔 Workout reminders
- 📈 Progress charts
- 👥 Social features
- 🎯 Workout templates
- 📱 Offline support with sync

Happy tracking! 💪
