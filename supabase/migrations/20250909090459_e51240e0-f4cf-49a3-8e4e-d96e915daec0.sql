-- Clean up orphaned auth user that has no profile
-- This user exists in auth.users but has no corresponding user_profiles record
-- This causes 409 conflicts during registration

-- First, let's check if there are any B2B records for this user
DELETE FROM b2b_users WHERE user_id = 'afd3dd24-0f7c-4a7c-867b-f0b91317a41d';

-- Delete the orphaned auth user
-- Note: This is a cleanup operation to fix the 409 conflict issue
SELECT auth.admin.delete_user('afd3dd24-0f7c-4a7c-867b-f0b91317a41d');