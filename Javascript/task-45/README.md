# Task 45 — File validation queue in JavaScript

This is the JavaScript version of the same exercise as [React task 46](../../react/task-46/).

## Scenario and requirements

Create a client-side attachment queue. Accept PDF, JPG, and PNG files, with a 2 MB limit per file and a 5 MB combined limit. Reject duplicates and show a separate message for every rejected file. No upload request is required.

### New small technique

`input.files` is a `FileList`, not a normal array. `Array.from(input.files)` converts it into an array that works naturally with `forEach`, spread, and pure helper functions.

### Done when

- Files are validated in selection order.
- Accepted files remain when another file is rejected.
- Duplicate identity uses name, size, and `lastModified`.
- Removing a file updates the total and frees capacity.
- Resetting the input allows the same file to be selected again after removal.

### Edge cases

- A selection mixes valid and invalid files.
- Two individually valid files exceed the total together.
- The same file is selected twice.

Estimated time: **50–70 minutes per implementation**.

## Interview hints: how to reason

Ask whether partial acceptance is allowed and which validation error has priority. Keep validation in a pure function receiving current and incoming arrays. Track a running total so each accepted file affects the next file in the same selection. Return both next files and errors.

## Example candidate answers

> I will accept valid files even if another selected file fails, because each file can be evaluated independently. I process them in order and update the running total only after an acceptance.

> The HTML `accept` attribute is user guidance, not complete validation, so I also verify MIME types in JavaScript. I check duplicates before limits to give the most specific message.

> I will reset the input value after reading `FileList`. Otherwise selecting the same file after removing it may not fire another change event.

## Step-by-step solution

1. Convert `FileList` with `Array.from`.
2. Copy the current accepted array and calculate its total.
3. Process every incoming file in order.
4. Check duplicate, type, individual size, then combined size.
5. Add valid files and update the running total.
6. Return `{ files, errors }` and render both collections.
7. Remove files immutably by their combined ID.

### Common mistakes and checks

- Do not rely only on `accept`.
- Do not calculate the combined size only once before processing the batch.
- Do not identify files only by name.
- Try one 1 MB PDF plus two 2 MB images: all fit exactly; another byte must fail.
- Remove a file and confirm that the freed capacity can be reused.

## Alternative approach

Reject the entire selection when any file fails. This provides an atomic transaction and may fit strict forms, but it is less convenient when users select many attachments. The main solution keeps every valid file.

## Full working code

Open [index.html](index.html). The fully commented implementation is in [script.js](script.js).
