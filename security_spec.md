# Security Specification: TradeMaster India

## Data Invariants
1. A user can only access, create, update, or read documents within `/users/{userId}/**` where `{userId} == request.auth.uid`.
2. Anonymous and authenticated users are supported; however, users cannot manipulate other users' paper trading balances, journals, or quiz scores.
3. User profiles cannot exceed max limits (e.g. displayName <= 100 chars).
4. Subcollections (`progress`, `journal`, `paperTrades`) must validate document IDs and incoming payload schemas.
5. All operations default to deny for unauthenticated or cross-tenant paths.

## The Dirty Dozen Payloads (Security Attack Vectors)
1. **Unauthenticated Read on User Profile**: Attempting `GET /users/victim123` with `auth == null`. Expected: PERMISSION_DENIED.
2. **Cross-Tenant Write on Progress**: User `attacker` attempts `SET /users/victim123/progress/lesson-1`. Expected: PERMISSION_DENIED.
3. **Ghost Field Injection in User Profile**: Adding `{ "isAdmin": true }` to `/users/{userId}`. Expected: PERMISSION_DENIED.
4. **Denial-of-Wallet String Inflation**: Sending 100KB string for `displayName`. Expected: PERMISSION_DENIED.
5. **Path Traversal / Malformed Document ID**: Inserting document ID with malicious characters. Expected: PERMISSION_DENIED.
6. **Cross-User Trading Journal Tampering**: User B attempting `DELETE /users/userA/journal/trade1`. Expected: PERMISSION_DENIED.
7. **Negative Quantity Exploitation in Paper Trades**: Setting `quantity = -500` or invalid side. Expected: PERMISSION_DENIED.
8. **Blanket Query Scraping**: Listing `/users` without scoping to user's own path. Expected: PERMISSION_DENIED.
9. **Fake Lesson Unlock bypass**: Setting `completed: true` without matching `userId`. Expected: PERMISSION_DENIED.
10. **Tampering with Other User's Virtual Capital**: Direct update of another user's balance. Expected: PERMISSION_DENIED.
11. **Orphaned Write outside /users**: Attempting to write into `/global_admin` or root. Expected: PERMISSION_DENIED.
12. **Arbitrary Subcollection Creation**: Attempting write to `/users/{userId}/secret_keys`. Expected: PERMISSION_DENIED.
