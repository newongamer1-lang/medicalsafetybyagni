// ================================================================
//  EDIT THIS FILE WITH THE RIDER'S DETAILS
//  Phone numbers: use international format, e.g. +9779801234567
//  Leave any optional field as "" to hide it.
// ================================================================
window.RIDER = {
  name: "Aarav Sharma",
  photo: "",                    // optional: "photo.jpg" (put file in this folder)
  bloodGroup: "O+",
  dob: "1998-05-14",            // YYYY-MM-DD  (age is calculated automatically)
  personalPhone: "+9779800000000",
  bikeNumber: "Ba 12 Pa 3456",  // optional

  // Medical info (optional) - very useful for paramedics
  allergies: "Penicillin",
  conditions: "None",
  medications: "",
  notes: "Organ donor",

  // Emergency contacts (add or remove as many as you like)
  emergencyContacts: [
    { name: "Sita Sharma", relation: "Mother", phone: "+9779811111111" },
    { name: "Ram Sharma",  relation: "Brother", phone: "+9779822222222" }
  ],

  // Public emergency numbers (Nepal defaults - change for your country)
  services: {
    ambulance: "102",
    police: "100",
    traffic: "103",
    fire: "101"
  },

  // SMS sent to emergency contacts. {name} and {location} are filled in automatically.
  smsMessage:
    "EMERGENCY: {name} may have been in a bike accident. " +
    "I am a bystander who scanned their emergency NFC tag. " +
    "Location: {location}. Please call back urgently."
};
