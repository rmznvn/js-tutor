# Task 47 — Effective team permissions

**Difficulty:** Junior+  
**Main topic:** Maps and Sets  
**Supporting topics:** Destructuring, default values, nullish coalescing, optional data, non-mutating sorting, DOM rendering

## Scenario and requirements

A team member receives permissions from a role, may receive custom additions, and may have explicit denials. Calculate and display the final permission list.

### Done when

- Role definitions use a Map.
- Effective permissions contain no duplicates.
- Custom permissions are added.
- Explicit denials remove matching permissions.
- Unknown roles safely produce no inherited permissions.
- Results are sorted without changing the source arrays.
- Modern toSorted has a compatible fallback.

### Edge cases

- The role does not exist in the map.
- Optional custom or denied arrays are missing.
- The same permission comes from both the role and custom list.

Estimated time: **40–55 minutes**.

## Interview hints: how to reason

Ask which rule wins when a permission is both added and denied. Apply additions first and denials last if denials have the highest priority.

Choose Map because role names are lookup keys and choose Set because permission membership and uniqueness matter. Default destructuring values handle missing arrays, while nullish coalescing handles an unknown role.

### Predict and explain

Does spreading role permissions into a new Set mutate the array stored in the Map? What changes if a permission object is stored instead of a string?

## Example candidate answers

> A Map makes the role-to-permission relationship explicit and provides direct lookup. A Set expresses uniqueness and gives me a clear delete operation for denials.

> JavaScript passes the array reference value into the operation, but spreading reads its elements into a new Set. The original role array is not mutated. If elements were objects, both collections would still refer to the same nested objects.

> I use toSorted when available because it documents non-mutation. I include a spread-plus-sort fallback because modern built-ins may not exist in every execution target.

## Step-by-step solution

1. Look up the role array with Map.get.
2. Fall back to an empty array with nullish coalescing.
3. Destructure optional additions and denials with default arrays.
4. Combine inherited and custom permissions in a Set.
5. Delete every explicitly denied permission.
6. Convert the Set back to an array.
7. Sort without mutating source data and render the result.

### Common mistakes

- Applying denials before additions and accidentally restoring a denied permission.
- Mutating the role array with sort.
- Assuming Set can remove equivalent but separately created objects by value.

### Manual checks

- Confirm Aisha receives the custom create permission once.
- Confirm Mateo loses project:edit.
- Confirm Noor receives report:export.
- Confirm the unknown role produces an empty list without throwing.

## Alternative approach

Use plain objects whose keys are role names and permission flags. This serializes naturally to JSON. A Map remains useful when keys may not be strings or when frequent lookup and iteration are central to the model.

## Full working code

Open [index.html](index.html). The commented implementation is in [script.js](script.js).
