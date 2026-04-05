## Multi-User Access System

### Part 1: Accountant Access (Sharon viewing/editing all client portals)

Sharon's master accounts (`info@sharonogier.com`, `sharon@sharonogier.com`) already exist in the system. We need:

1. **Database: User roles table** — Create `user_roles` table with roles: `admin` (Sharon), `owner` (business owner), `member` (invited team)
2. **Database: Security definer function** — `has_role()` function to check roles without RLS recursion
3. **Update RLS policies** — All `sas_*` tables need updated policies:
   - Admins can access ALL rows
   - Owners access their own rows
   - Members access rows of the user who invited them
4. **Client switcher UI** — Sharon sees a dropdown/list of all portal users and can switch between them
5. **Seed admin role** — Insert admin role for Sharon's accounts

### Part 2: Team Member Invitations

1. **Database: Team invitations table** — `sas_team_invitations` (inviter_id, email, role, status, accepted_at)
2. **Database: Team members table** — `sas_team_members` (owner_user_id, member_user_id, role, created_at)
3. **RLS updates** — Members can access data belonging to their team owner
4. **Invitation flow** — Owner sends invite email → recipient signs up → auto-linked to team
5. **Settings UI** — "Team" tab in settings to manage members and send invitations
6. **Permission levels** — `viewer` (read-only) and `editor` (full access) for team members

### Implementation Order
1. Create all database tables and functions (single migration)
2. Update RLS policies on all sas_* tables
3. Seed Sharon's admin role
4. Build the client switcher UI for admin
5. Build the team management UI
6. Build the invitation email flow
