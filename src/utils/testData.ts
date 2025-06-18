// Real POD data from our CSV converter for testing

// Primary test POD
export const realPODExample = {
  "entries": {
    "attendeeEmail": "joe@shmo.org",
    "attendeeName": "Joe Shmo",
    "eventId": "5074edf5-f079-4099-b036-22223c0c69953",
    "eventLocation": "Bangkok, Thailand",
    "eventName": "Devcon 7",
    "eventStartDate": "2024-11-09T08:00:00.000",
    "imageUrl": "/images/devcon/devcon-landscape.webp",
    "isAddOn": false,
    "isConsumed": true,
    "isRevoked": false,
    "productId": "f15237ec-abd9-40ae-8e61-9cf8a7a60c3f3",
    "ticketCategory": 4,
    "ticketId": "2166b436-ac39-5f69-8700-e1dfceae37ebd",
    "ticketName": "EFer",
    "ticketSecret": "naswv9f9wb28357u43h9fh4pqn3p3h4gd",
    "timestampConsumed": 1731226670791,
    "timestampSigned": 1750215914826
  },
  "signature": "KX44O1XFLKIbNVRR4m5D42ooxHlbRybHnKbYZFjmuyAwP2TpGYwG1pNH6iE7fUSLtHHikUrPIIO99zSWjjHmBQ",
  "signerPublicKey": "NnGAciO/OIz+R5aYBlTUb+QwCgD5xossqB8gZtKLOxs"
}

// Test cases for different validation scenarios
export const testCases = {
  validPOD: realPODExample,
  
  invalidJSON: `{
    "entries": {
      "name": "test"
    },
    "signature": "invalid"
    // missing closing brace
  `,
  
  missingSignature: {
    "entries": {
      "name": "test"
    },
    "signerPublicKey": "NnGAciO/OIz+R5aYBlTUb+QwCgD5xossqB8gZtKLOxs"
  },
  
  invalidEntryName: {
    "entries": {
      "123invalid": "test", // starts with number
      "valid_name": "test"
    },
    "signature": "KX44O1XFLKIbNVRR4m5D42ooxHlbRybHnKbYZFjmuyAwP2TpGYwG1pNH6iE7fUSLtHHikUrPIIO99zSWjjHmBQ",
    "signerPublicKey": "NnGAciO/OIz+R5aYBlTUb+QwCgD5xossqB8gZtKLOxs"
  },
  
  emptyEntries: {
    "entries": {},
    "signature": "KX44O1XFLKIbNVRR4m5D42ooxHlbRybHnKbYZFjmuyAwP2TpGYwG1pNH6iE7fUSLtHHikUrPIIO99zSWjjHmBQ",
    "signerPublicKey": "NnGAciO/OIz+R5aYBlTUb+QwCgD5xossqB8gZtKLOxs"
  },
  
  // Additional real PODs from CSV data
  alicePOD: {
    "entries": {
      "attendeeEmail": "alice@example.com",
      "attendeeName": "Alice Smith",
      "eventId": "5074edf5-f079-4099-b036-22223c0c69953",
      "eventLocation": "Bangkok, Thailand",
      "eventName": "Devcon 7",
      "eventStartDate": "2024-11-09T08:00:00.000",
      "imageUrl": "/images/devcon/devcon-landscape.webp",
      "isAddOn": false,
      "isConsumed": true,
      "isRevoked": false,
      "productId": "f15237ec-abd9-40ae-8e61-9cf8a7a60c3f3",
      "ticketCategory": 4,
      "ticketId": "a1b2c3d4-e5f6-7890-abcd-ef1234567890",
      "ticketName": "Developer",
      "ticketSecret": "xkcd123secretkey456789abcdef",
      "timestampConsumed": 1731226670791,
      "timestampSigned": 1750215914905
    },
    "signature": "+Jof+K0pT/lESW/W711tmv6BV6leZ9MzzKzyIRhhT4lzxw+YUEPm9hHObFRi//uVlV69kiJ3hQ3jrbGi0jFiBQ",
    "signerPublicKey": "NnGAciO/OIz+R5aYBlTUb+QwCgD5xossqB8gZtKLOxs"
  },
  
  // POD with typed entries (explicit type/value structure)
  typedEntriesPOD: {
    "entries": {
      "name": {
        "type": "string",
        "value": "Alice Frog"
      },
      "age": {
        "type": "int", 
        "value": 25
      },
      "verified": {
        "type": "boolean",
        "value": true
      },
      "pubkey": {
        "type": "eddsa_pubkey",
        "value": "ZnU07tyAUiWW2mmY3/z4aa3WxrctfSc0ch23752z6xM"
      }
    },
    "signature": "test_signature_for_typed_entries",
    "signerPublicKey": "NnGAciO/OIz+R5aYBlTUb+QwCgD5xossqB8gZtKLOxs"
  }
}

// Helper function to get test case as JSON string
export function getTestCaseJSON(testCase: keyof typeof testCases): string {
  const data = testCases[testCase]
  if (typeof data === 'string') {
    return data
  }
  return JSON.stringify(data, null, 2)
}