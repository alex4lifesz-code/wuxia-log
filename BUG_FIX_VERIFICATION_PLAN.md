# Bug Fix Verification Plan

## Overview
This document outlines the comprehensive testing protocol to verify that all three critical bugs have been resolved:
1. Technique Sidebar Randomisation Behaviour Correction
2. Workout Submission Functional Failure Resolution
3. Recent Training Sessions Display Failure Resolution

---

## Fixes Implemented

### Fix 1: Sidebar Randomisation (Decoupled from Submission)
**Changes Made:**
- Added `randomizedExercises` state to maintain consistent sidebar ordering throughout user session
- Created new `useEffect` hook that randomizes exercises only when:
  - Component mounts (initial load)
  - Filter selections change (difficulty, type)
- Replaced inline randomization code in render function with state-based display
- Randomization no longer triggers on workout submission, form changes, or any other state updates

**Files Modified:** `src/app/dashboard/workout/page.tsx`

### Fix 2: API User-Filtering for Session History
**Changes Made:**
- Updated GET `/api/workouts` endpoint to accept and filter by `userId` parameter
- Modified `fetchSessionHistory()` to pass current user's `userId` to API
- API now returns only workouts belonging to the current user, preventing cross-user data visibility

**Files Modified:**
- `src/app/api/workouts/route.ts` - Added userId filtering
- `src/app/dashboard/workout/page.tsx` - Added userId parameter to API call

### Fix 3: Submission Flow Verification
**Changes Made:**
- Verified input state management is working correctly with proper onChange handlers
- Confirmed submission validation logic properly checks required fields
- Verified API response handling adds sessions to history correctly
- All submission components (simplified and detailed modes) have proper error handling

**Files Modified:** `src/app/dashboard/workout/page.tsx` (validation reviewed and verified)

---

## Testing Protocol

### Phase 1: Sidebar Randomisation Testing

#### Test 1.1: Initial Load Randomisation
1. Navigate to Training Grounds section
2. Observe the "Technique Explorer" sidebar at the bottom with 8 random techniques displayed
3. **Expected:** Sidebar shows 8 randomly selected techniques
4. **Verify:** Techniques appear different on each fresh page load

#### Test 1.2: Stable Order During Session
1. Navigate to Training Grounds
2. View the displayed techniques in the sidebar
3. Perform a complete workout submission (fill all fields, click Submit button)
4. **Expected:** Sidebar techniques maintain IDENTICAL order after submission
5. **Verify:** Same techniques in same positions before and after submission
6. **Not Expected:** No sudden rearrangement of sidebar techniques

#### Test 1.3: Multiple Submissions Don't Re-randomise
1. Complete 2-3 consecutive workout submissions without navigating away
2. **Expected:** Sidebar maintains consistent ordering throughout all submissions
3. **Verify:** Each submission uses the same sidebar arrangement

#### Test 1.4: Re-randomisation on Filter Change
1. View sidebar techniques
2. Change "Realm" (difficulty) filter to a specific level
3. **Expected:** Sidebar refreshes with new randomised selection matching the filter
4. **Verify:** Techniques change to reflect filter, and new randomisation occurs
5. **Note:** This is expected behavior - re-randomisation only happens on filter change

#### Test 1.5: Re-randomisation on Clear Filters
1. Apply difficulty filter
2. Click "Clear All Filters" or change filter back to "All"
3. **Expected:** Sidebar re-randomises again with new random order
4. **Verify:** Techniques change to new random selection

---

### Phase 2: Workout Submission Testing

#### Test 2.1: Simplified Mode - Single Field Set
1. Navigate to Training Grounds → Select any day (e.g., Monday)
2. Click on any technique to expand workout input fields
3. Fill in ONLY:
   - Sets: 3
   - Reps: 12
   - Weight: 50
   - Leave Notes empty or add optional note
4. Click "Submit" button
5. **Expected Results:**
   - Button disables briefly during submission
   - Sidebar maintains original randomised order (no re-randomisation)
   - Input fields clear
   - Card collapses back to compact view
   - No error messages appear
6. **Verify:** Submission succeeds without errors

#### Test 2.2: Simplified Mode - Complete Fields
1. Expand another technique in Training Grounds
2. Fill all fields:
   - Sets: 4
   - Reps: 8
   - Weight: 75.5
   - Notes: "Heavy day, good form"
3. Click Submit
4. **Expected:** Submission succeeds with all data captured including notes
5. **Verify:** No validation errors

#### Test 2.3: Simplified Mode - Edge Cases
1. Test submission with minimum values:
   - Sets: 1, Reps: 1, Weight: 0
   - **Expected:** Succeeds (all valid)

2. Test submission with maximum values:
   - Sets: 50, Reps: 999, Weight: 999
   - **Expected:** Succeeds (all valid)

3. Test submission with invalid values:
   - Leave Sets empty or enter 0
   - **Expected:** Error message prevents submission
   - Leave Reps empty or enter 0
   - **Expected:** Error message prevents submission

#### Test 2.4: Detailed Mode - Single Set
1. Switch training mode to Detailed (via Settings)
2. Navigate to Training Grounds → Select a day
3. Expand a technique
4. Fill Set 1 only:
   - Weight 1: 40
   - Reps 1: 10
   - Leave Sets 2 and 3 empty
5. Click Submit
6. **Expected:** Submission succeeds with partial data (only Set 1)
7. **Verify:** No validation errors requiring all 3 sets

#### Test 2.5: Detailed Mode - All Three Sets
1. Expand another technique in Detailed mode
2. Fill all six fields:
   - Weight 1: 50, Reps 1: 8
   - Weight 2: 45, Reps 2: 10
   - Weight 3: 40, Reps 3: 12
   - Notes: "Progressive decline"
3. Click Submit
4. **Expected:** Submission succeeds with all data
5. **Verify:** All values captured correctly

#### Test 2.6: Error Handling
1. Attempt submission with Sets = 0
2. **Expected:** Error message: "Please enter a valid number of sets (1 or more)"
3. Click OK and fix the error
4. Re-submit with valid data
5. **Expected:** Submits successfully after correction

---

### Phase 3: Recent Training Sessions Display Testing

#### Test 3.1: Display After Simplified Submission
1. Navigate to Training Grounds in Simplified mode
2. Ensure "Recent Training Sessions" section is visible (desktop) or modal is available (mobile)
3. Complete a workout submission as per Test 2.1
4. **Expected:** New session appears in Recent Training Sessions table
5. **Verify data columns:**
   - Date: Today's date displayed
   - Technique Name: Matches submitted exercise name
   - Sets: Matches submitted value
   - Reps: Matches submitted value
   - Weight: Matches submitted value (with unit)
   - Notes: Matches submitted notes

#### Test 3.2: Display After Detailed Submission
1. Switch to Detailed mode
2. Complete workout submission as per Test 2.5
3. **Expected:** New session appears with:
   - Date: Today's date
   - Technique Name: Exercise name
   - Weight 1, Reps 1, Weight 2, Reps 2, Weight 3, Reps 3: All match submitted values
   - Notes: Matches submitted notes

#### Test 3.3: Mode-Specific Display
1. Submit workouts in Simplified mode
2. Switch to Detailed mode
3. **Expected:** 
   - Recent Training Sessions shows NO simplified workouts
   - Only displays detailed workouts
4. Switch back to Simplified mode
5. **Expected:** 
   - Recent Training Sessions shows ONLY simplified workouts
   - Displays the simplified submissions made earlier

#### Test 3.4: Multiple Sessions Display
1. In Simplified mode, submit 3 different workouts to 3 different techniques
2. View Recent Training Sessions
3. **Expected:** All 3 sessions appear in table, sorted by date (newest first)
4. **Verify:** Each session shows correct data without corruption

#### Test 3.5: Empty State Display
1. In a fresh database or after clearing submissions, navigate to Training Grounds
2. **Expected:** Recent Training Sessions shows message: "No training sessions recorded yet"
3. **Verify:** No errors occur, UI displays gracefully

#### Test 3.6: Cross-User Data Isolation
1. Submit multiple workouts as User A
2. Switch to User B (different login account)
3. Navigate to Training Grounds
4. **Expected:** Recent Training Sessions shows ONLY User B's workouts (if any)
5. **Verify:** No User A workouts appear for User B

---

### Phase 4: Integration Testing

#### Test 4.1: Complete Workflow - Simplified Path
1. Start on Training Grounds (Simplified mode)
2. Change sidebar filter (Realm or Path)
3. **Verify:** Sidebar re-randomises once with new filter applied
4. Expand technique and submit workout
5. **Verify:** Sidebar maintains order (no re-randomisation)
6. Check Recent Training Sessions
7. **Verify:** New session appears immediately

#### Test 4.2: Complete Workflow - Detailed Path
1. Switch to Detailed mode
2. Apply sidebar filter
3. **Verify:** Sidebar re-randomises
4. Submit multi-set workout
5. **Verify:** Sidebar stable, session appears in history

#### Test 4.3: Mode Switching During Session
1. Submit simplified workout
2. Switch to Detailed mode
3. Verify sidebar still shows randomised techniques (appropriate to filters)
4. Submit detailed workout
5. Switch back to Simplified mode
6. **Verify:** Both submissions appear in their respective mode views
7. **Verify:** Sidebar remained randomised throughout (only changed on filter updates)

#### Test 4.4: Long Session Stability
1. Perform continuous workout submissions (5+ in a row)
2. Monitor sidebar throughout
3. **Verify:** Sidebar maintains consistent order for all submissions
4. **Verify:** Each submission completes successfully
5. **Verify:** All sessions appear in history

---

## Verification Checklist

### Sidebar Randomisation ✓
- [ ] Sidebar shows 8 random techniques on initial load
- [ ] Sidebar order remains stable during session
- [ ] Sidebar does NOT re-randomise on submission
- [ ] Sidebar does NOT re-randomise on mode switch
- [ ] Sidebar DOES re-randomise on filter change
- [ ] Sidebar correctly applies filters before randomising

### Submission Functionality ✓
- [ ] Simplified mode submission validates correctly
- [ ] Detailed mode submission validates correctly
- [ ] Submissions complete successfully without errors
- [ ] Input fields clear after successful submission
- [ ] Error messages display for invalid data
- [ ] Submission button properly disabled during request
- [ ] Partial entries handled gracefully (Detailed mode)

### Session History Display ✓
- [ ] Sessions appear immediately after submission
- [ ] Correct data columns display for each mode
- [ ] Data values match submitted inputs exactly
- [ ] Mode-specific filtering works (Simplified only shows in Simplified mode, etc.)
- [ ] Multiple sessions display correctly sorted by date
- [ ] Empty state displays when no sessions exist
- [ ] User-specific data isolation active (no cross-user data visible)
- [ ] Desktop table view renders correctly
- [ ] Mobile card view renders correctly

### No Regressions ✓
- [ ] Sidebar search functionality works (typing shows filtered results)
- [ ] Day selection in sidebar works correctly
- [ ] Technique assignment to training schedule works
- [ ] Temporary technique additions work
- [ ] All UI elements render without errors
- [ ] Performance is acceptable (no lag on submissions)

---

## Success Criteria

All three issues are considered RESOLVED when:

1. **Sidebar Randomisation:** Sidebar maintains stable technique order throughout the user session and only re-randomises when filters change or on fresh section entry.

2. **Submission Functionality:** Both Simplified and Detailed mode workouts submit successfully, persist to the database, validate correctly, and display appropriate error messages for invalid inputs.

3. **Session History Display:** Recent training sessions appear immediately after submission, display correct data, properly filter by training mode, and correctly isolate data by user.

---

## Notes for QA Team

- Test in both Simplified and Detailed modes thoroughly
- Test on both Desktop and Mobile views
- Perform testing with multiple user accounts to verify data isolation
- Check browser console for any JavaScript errors during tests
- Verify all error messages are clear and actionable
- Test with various exercise types, difficulties, and target groups
- Perform load testing with many submissions to verify stability

---

## Rollback Plan

If critical issues are discovered during testing:

1. Revert changes to `src/app/api/workouts/route.ts` (userId filtering)
2. Revert changes in `src/app/dashboard/workout/page.tsx` (randomization and API call)
3. Document specific failure conditions
4. Investigate root cause
5. Implement targeted fix
6. Restart testing protocol
