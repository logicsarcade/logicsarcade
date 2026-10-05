-- Run once in Supabase Dashboard → SQL Editor
-- Bookings are now read/written only by the server (service role key),
-- so the public (anon) access policies are removed.
drop policy if exists "Users can read own bookings" on bookings;
drop policy if exists "Anyone can create a booking" on bookings;
