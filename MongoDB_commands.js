
1. Database & Collection Setup

use studentDB
// Insert ONE document.
// _id is added automatically by MongoDB if you don't provide one —
// it's a unique identifier for every document, like a primary key.

2. Insert Operations

db.students.insertOne({
  name: "Ravi Kumar",
  age: 21,
  course: "MERN Stack",
  status: "ongoing"
})

// Insert MULTIPLE documents at once using an array.
db.students.insertMany([
  { name: "Anita Sharma", age: 22, course: "MERN Stack", status: "ongoing" },
  { name: "Karthik Raj",  age: 23, course: "Data Science", status: "completed" },
  { name: "Divya Menon",  age: 20, course: "MERN Stack", status: "completed" },
  { name: "Suresh Babu",  age: 24, course: "UI/UX Design", status: "ongoing" }
])

3. Read Operations

// Fetch ALL documents in the collection.
// An empty {} means "no filter — match everything."
db.students.find({})

// find() returns a lot of raw data at once; pretty() formats it nicely in the shell.
db.students.find({}).pretty()

// Fetch documents matching a FILTER — students enrolled in "MERN Stack".
db.students.find({ course: "MERN Stack" })

// findOne() works the same way but returns only the first match.
db.students.findOne({ course: "MERN Stack" })

4. Update Operations

// Update a SINGLE document - change one student's status to "completed".
// $set tells MongoDB "only touch these fields, leave everything else alone."
db.students.updateOne(
  { name: "Ravi Kumar" },        // filter: which document to find
  { $set: { status: "completed" } } // update: what to change
)

// Update MULTIPLE documents at once - mark every "ongoing" MERN Stack
// student as "completed" (e.g. end of batch).
db.students.updateMany(
  { course: "MERN Stack", status: "ongoing" },
  { $set: { status: "completed" } }
)

5. Delete Operations

// Delete ONE document matching a condition.
db.students.deleteOne({ name: "Suresh Babu" })

// Delete ALL documents in the collection (practice only — this empties
// the collection but keeps the collection itself, ready for new data).
db.students.deleteMany({})

6. Query Operators

// $gt / $lt — greater than / less than
// Students older than 21:
db.students.find({ age: { $gt: 21 } })

// Students younger than 22:
db.students.find({ age: { $lt: 22 } })

// $in — match any value in a list (like SQL's "IN")
// Students enrolled in either MERN Stack or Data Science:
db.students.find({ course: { $in: ["MERN Stack", "Data Science"] } })

// $and — both conditions must be true
// MERN Stack students who have completed:
db.students.find({
  $and: [
    { course: "MERN Stack" },
    { status: "completed" }
  ]
})

// $or — at least one condition must be true
// Students who are either under 21 OR already completed:
db.students.find({
  $or: [
    { age: { $lt: 21 } },
    { status: "completed" }
  ]
})

// $exists — check whether a field is present at all
// Useful when documents don't all share the same fields (remember,
// MongoDB doesn't force every document to look the same).
db.students.find({ scholarship: { $exists: true } })

//---Use Case: Lab Sample Tracking System---

8.Use Case: Lab Sample Tracking System

use labDB

// --- Insert: log samples as they arrive at the lab ---
db.samples.insertMany([
  { sampleId: "S-1001", specimenType: "Blood",  testType: "CBC",        status: "pending",   priority: "routine", collectedAt: new Date("2026-08-20") },
  { sampleId: "S-1002", specimenType: "Saliva",  testType: "PCR",        status: "processing",priority: "urgent",  collectedAt: new Date("2026-08-25") },
  { sampleId: "S-1003", specimenType: "Blood",  testType: "Lipid Panel", status: "completed", priority: "routine", collectedAt: new Date("2026-08-18"), result: "Normal" },
  { sampleId: "S-1004", specimenType: "Tissue", testType: "Biopsy",      status: "processing",priority: "urgent",  collectedAt: new Date("2026-08-27") },
  { sampleId: "S-1005", specimenType: "Blood",  testType: "CBC",        status: "completed", priority: "routine", collectedAt: new Date("2026-08-15"), result: "Abnormal" }
])

// --- Search: find every URGENT sample still being processed ---
// (This is exactly the kind of query a lab dashboard would run every
// few minutes to flag what needs attention.)
db.samples.find({
  $and: [
    { priority: "urgent" },
    { status: "processing" }
  ]
})

// --- Search: find samples that already HAVE a result recorded ---
// $exists is a natural fit here - "result" only appears once testing is done,
// so checking for its existence tells you which samples are finished.
db.samples.find({ result: { $exists: true } })

// --- Search: find CBC or Lipid Panel tests specifically ---
db.samples.find({ testType: { $in: ["CBC", "Lipid Panel"] } })

// --- Update: mark a sample as completed once results are in ---
db.samples.updateOne(
  { sampleId: "S-1002" },
  { $set: { status: "completed", result: "Detected" } }
)

// --- Update: escalate every pending sample older than a cutoff date to urgent ---
// (e.g. anything still waiting after 5 days gets bumped up automatically)
db.samples.updateMany(
  { status: "pending", collectedAt: { $lt: new Date("2026-08-22") } },
  { $set: { priority: "urgent" } }
)

// --- Delete: remove a sample record that was logged in error ---
db.samples.deleteOne({ sampleId: "S-1004" })

