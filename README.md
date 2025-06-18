# 🐸 POD Verifier

A fun, frog-themed web application for verifying Provable Object Data (PODs) using cryptographic signatures. This tool performs client-side verification of POD authenticity without sending any data to external servers.

## ✨ Features

- **🔐 Cryptographic Verification**: Validates EdDSA-Poseidon signatures for POD authenticity
- **🔍 Comprehensive Validation**: Checks JSON structure, entry formats, and signature integrity
- **🌐 Client-Side Only**: All verification happens in your browser - no data leaves your device
- **🎨 Frog-Themed UI**: Delightful, animated interface with lily pad aesthetics
- **📚 Educational Content**: Built-in help system explaining PODs and verification process
- **📱 Responsive Design**: Works seamlessly on desktop and mobile devices
- **🔧 Real POD Testing**: Includes sample PODs from actual CSV converter output
- **🔗 URL Sharing**: Share verified PODs via encoded URLs for collaborative verification
- **📊 Enhanced POD Display**: Beautiful, categorized view of POD contents with smart formatting
- **📤 One-Click Sharing**: Simple link copying with visual feedback

## 🚀 Getting Started

### Prerequisites

- Node.js 18+ 
- npm or yarn

### Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd pod-verifier
```

2. Install dependencies:
```bash
npm install
```

3. Start the development server:
```bash
npm run dev
```

4. Open your browser to `http://localhost:5173`

### Building for Production

```bash
npm run build
```

The built files will be in the `dist` directory.

## 🔧 Usage

### Basic Verification

1. **Paste POD JSON**: Copy and paste your POD JSON into the textarea
2. **Click Verify**: Press the "Verify POD 🐸" button to start verification
3. **View Results**: See detailed verification results with metadata and entries
4. **Explore POD Data**: Click "View POD Data" to see enhanced, categorized display
5. **Share POD**: Use the "Share POD" button to generate a shareable link

### Sample PODs

Use the sample buttons to test with different POD types:
- **Valid POD**: A working POD from our CSV converter
- **Alice POD**: Another valid POD with different user data  
- **Invalid POD**: A malformed POD to see error handling

### Understanding Results

- **✅ Valid POD**: Cryptographic signature verified successfully
- **❌ Invalid POD**: Signature verification failed or data corrupted
- **⚠️ Validation Error**: JSON format or structure issues

### URL Sharing

Once a POD is successfully verified:

1. **Automatic URL Update**: The URL automatically includes the verified POD data
2. **Share Button**: Click "Share POD" to copy the shareable URL to your clipboard
3. **Collaborative Verification**: Recipients can verify the same POD independently
4. **Auto-Loading**: Shared PODs automatically load when visiting the shared URL

**Example Shareable URL:**
```
https://podverifier.com/?pod=eyJlbnRyaWVzIjp7ImF0dGVuZGVlRW1haWwiOiJqb2VAc2htby5vcmciLCJhdHRlbmRlZU5hbWUiOiJKb2UgU2htbyJ9fQ
```

### Enhanced POD Display

The enhanced POD viewer organizes data into logical categories:

- **👤 Personal Information**: Names, emails, attendee details
- **🎫 Event Details**: Event names, locations, ticket information  
- **⏰ Timestamps**: All time-related fields with human-readable formatting
- **⚙️ Technical Data**: IDs, secrets, configuration values
- **📄 Other**: Miscellaneous fields

**Smart Formatting Features:**
- **📅 Date Formatting**: Timestamps → "December 10, 2024 at 10:04:30 PM EST"
- **📧 Email Icons**: Visual indicators for email addresses
- **📍 Location Pins**: Geographic location highlighting
- **✅ Boolean Display**: Checkmarks and X marks for true/false values
- **🔐 Secret Masking**: Partial hiding of sensitive data for security

## 📋 POD Format

PODs (Provable Object Data) are JSON objects with this structure:

```json
{
  "entries": {
    "key1": "value1",
    "key2": 42,
    "key3": true
  },
  "signature": "base64-encoded-signature",
  "signerPublicKey": "base64-encoded-public-key"
}
```

### Entry Types

PODs support both simple and typed entries:

**Simple Format:**
```json
{
  "entries": {
    "name": "Alice",
    "age": 25,
    "verified": true
  }
}
```

**Typed Format:**
```json
{
  "entries": {
    "name": {
      "type": "string",
      "value": "Alice"
    },
    "age": {
      "type": "int",
      "value": 25
    }
  }
}
```

## 🏗️ Technical Architecture

### Dependencies

- **@pcd/pod**: Core POD cryptographic operations
- **React 19**: Modern React with concurrent features
- **TypeScript**: Type safety and better developer experience
- **Vite**: Fast build tool and development server
- **Tailwind CSS**: Utility-first styling framework
- **Lucide React**: Beautiful, customizable icons

### Key Components

- **PODVerifier**: Main verification interface with URL sharing integration
- **PODDisplay**: Enhanced, categorized POD data viewer with smart formatting
- **ShareButton**: One-click link copying with visual feedback
- **HelpSection**: Expandable educational content including sharing guidance
- **Tooltip**: Contextual help tooltips
- **Header/Footer**: Navigation and branding

### Verification Process

1. **JSON Parsing**: Safely parse input with size limits
2. **Structure Validation**: Check required fields exist
3. **Entry Validation**: Verify entry names and types
4. **Signature Verification**: Cryptographically verify EdDSA signature
5. **Content ID Validation**: Ensure entries match Merkle tree
6. **URL Integration**: Update browser URL with verified POD for sharing

## 🔒 Security Features

- **Input Sanitization**: Removes null bytes and limits input size (1MB)
- **Client-Side Only**: No data transmission to external servers
- **Memory Management**: Efficient handling of large PODs
- **Error Isolation**: Proper error boundaries and handling
- **URL Encoding Security**: Base64 encoding with proper validation for shared PODs
- **Privacy Protection**: Clear warnings about URL-based sharing implications
- **Secret Masking**: Partial hiding of sensitive fields in the enhanced display

## 🎨 Customization

### Frog Theme

The application uses a custom frog theme with:
- **Primary Colors**: Various shades of green (`#22c55e`, `#16a34a`)
- **Accent Colors**: Lily pad green (`#84cc16`) and pond blue (`#0ea5e9`)
- **Animations**: Subtle hop animations and smooth transitions
- **Typography**: Clean, readable fonts with proper hierarchy

### Styling

Styles are defined in:
- `src/index.css`: Global styles and CSS custom properties
- Component-level: Tailwind classes for responsive design

## 🧪 Testing

The application includes comprehensive test data:

- **Real PODs**: Generated from actual CSV converter output
- **Edge Cases**: Empty entries, invalid signatures, malformed JSON
- **Type Variations**: Both simple and typed entry formats

### Manual Testing

1. Load each sample POD type
2. Verify validation error messages
3. Test copy-to-clipboard functionality
4. Check responsive design on different screen sizes
5. Test URL sharing functionality with valid PODs
6. Verify auto-loading from shared URLs
7. Test clipboard copying functionality
8. Validate enhanced POD display formatting

## 📦 Deployment

### Static Hosting

The built application is a static site that can be deployed to:
- Vercel
- Netlify  
- GitHub Pages
- Any static hosting provider

### Environment Requirements

- Supports modern browsers with ES2020+ features
- Requires JavaScript enabled
- Works offline after initial load

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

### Development Guidelines

- Follow TypeScript best practices
- Maintain accessibility standards
- Keep components focused and reusable
- Write descriptive commit messages

## 📄 License

[Add your license information here]

## 🐸 Why Frogs?

Frogs are amazing creatures that undergo incredible transformations, much like how PODs transform raw data into cryptographically verified objects! Plus, they're just really cute and make everything more fun. 🎉

## 🔗 Related Projects

- **CSV to POD Converter**: Generates the PODs used in our test cases
- **@pcd/pod Library**: The underlying cryptographic library

## 📞 Support

If you encounter issues or have questions:

1. Check the built-in help section
2. Review common troubleshooting tips
3. Ensure your POD follows the correct JSON format
4. Verify that signatures and keys are valid base64 strings

---

Built with ❤️ and lots of 🐸 by the POD verification team!