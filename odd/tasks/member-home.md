# Feature: member home (mobile)

## Objective
Replace the post-login stub (`app/index.tsx`) with a real member home that mirrors the web member dashboard essentials, using only RLS-protected Supabase reads the app can call directly.

## Why
After login members land on a placeholder. The web dashboard already defines what a member needs first: greeting, membership status, today's workout and weekly progress.

## Scope (v1)
- Greeting by Argentina hour + first name (`profiles.full_name`).
- Membership status from `daysUntilAR(membership_expires_at)`; warning at <= 7 days. No in-app payment (Mercado Pago checkout is server-only on the web).
- Today's workout: newest non-template `workout_plans` assigned to the member, `workout_plan_days` for today (`(dayOfWeekAR()+6)%7`, 0 = Monday) with exercises (name, sets, reps/reps_max, duration).
- Weekly progress: completed days this week vs planned days, plus consecutive-day streak (ported `lib/activity-days.ts`).
- Sign out.

## Out of scope (later)
Workout session runner, check-in QR, nutrition/water/weight, achievements, leaderboard, payments, AI chat, exercise media.

## Constraints
- Every query scoped to the signed-in member (RLS); no service role in the app.
- Argentina timezone via ported `lib/date-ar.ts` helpers, never UTC date math.
- TDD mode: not configured for this repo (source: no project setting); tests still required with each behavior. Runner: `npx jest`.

## Tasks
- [x] T1 Port date/activity helpers + data loader with tests (route: delegated writer, 2+ non-trivial files)
- [x] T2 Home screen UI + sign out, with screen tests (route: delegated writer, same unit)
- [ ] T3 Animated red/black gradient on login (route: delegated writer)

## Acceptance
- `npx jest` and `npx tsc --noEmit` clean; `npx expo export --platform android` bundles.
- Device check in Expo Go pending (owner away).

## Progress / evidence

### T1 + T2 (delegated writer)
- RED: `npx jest lib/date-ar lib/activity-days` -> 8 failed (missing hourAR/dayOfWeekAR/mondayOfWeekAR/daysUntilAR now arg), activity-days suite failed to resolve; `lib/home/*` suites failed ("Cannot find module"); `app/index.test.tsx` -> 15 failed, 1 passed against the old stub.
- `npx jest`: 15 suites, 144 tests, all passing (baseline 11 / 87).
- `npx tsc --noEmit`: 0 errors.
- `npx expo export --platform android --output-dir <temp>`: bundled (1 android bundle, 3.3MB); temp dir deleted.
- Files: lib/date-ar.ts (+hourAR, dayOfWeekAR, mondayOfWeekAR, optional `now` on todayAR/daysUntilAR), lib/activity-days.ts, lib/home/{memberHome,loadMemberHome}.ts, components/home/*, app/index.tsx (+ tests).
- Not verified: device rendering in Expo Go (owner away).
