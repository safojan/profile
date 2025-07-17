# GuidelineSync - Clinical Guidelines Management App

GuidelineSync is a comprehensive SaaS mobile and web application designed to manage clinical guidelines for UK hospitals, enabling seamless access across multiple NHS trusts. Built with React Native, Node.js, MongoDB, and AWS S3.

## Features

### For Clinicians
- 🔍 **Fast Search**: Search guidelines by trust name, medical specialty, title, or content
- 📱 **Multi-Platform**: Available on iOS, Android, and Web
- 📄 **PDF & Text Support**: View guidelines in PDF format or as text records
- 🏥 **Multi-Trust Access**: Access guidelines from multiple NHS trusts in one app
- 💬 **AI Chat**: Interact with guidelines using RAG-powered AI assistant (coming soon)
- 📱 **Offline Support**: Access downloaded guidelines offline

### For Administrators
- 🔐 **Secure Authentication**: JWT-based admin authentication
- ✏️ **CRUD Operations**: Create, read, update, and delete guidelines
- 📤 **File Upload**: Upload PDF guidelines to AWS S3
- 🏷️ **Tagging System**: Organize guidelines with custom tags
- 📊 **Analytics**: Track guideline usage and updates

## Tech Stack

### Frontend (React Native)
- **React Native 0.79.4** with Expo 53.0.15
- **Navigation**: React Navigation 6
- **State Management**: React Query (TanStack Query)
- **UI Components**: Custom components with Space Grotesk font
- **PDF Viewing**: react-native-pdf
- **Storage**: MMKV for secure local storage
- **Cross-Platform**: Web, iOS, and Android support

### Backend (Node.js)
- **Express.js** for REST API
- **MongoDB** with Mongoose ODM
- **AWS S3** for PDF storage
- **JWT** authentication
- **Multer** for file uploads
- **bcryptjs** for password hashing

## Project Structure

```
GuidelineSync/
├── app/                    # React Native app
│   ├── components/         # Reusable UI components
│   ├── screens/           # App screens
│   ├── services/          # API services
│   ├── theme/             # Design system
│   ├── types/             # TypeScript types
│   └── utils/             # Utility functions
├── server/                # Node.js backend
│   ├── models/            # MongoDB models
│   ├── routes/            # API routes
│   ├── middleware/        # Express middleware
│   ├── services/          # Business logic
│   └── index.js           # Server entry point
└── README.md
```

## Setup Instructions

### Prerequisites
- Node.js 18+ and npm
- MongoDB (local or Atlas)
- AWS account with S3 bucket
- Expo CLI (for mobile development)

### Backend Setup

1. **Navigate to server directory**:
   ```bash
   cd server
   ```

2. **Install dependencies**:
   ```bash
   npm install
   ```

3. **Environment Configuration**:
   ```bash
   cp .env.example .env
   ```
   
   Update `.env` with your configuration:
   ```env
   MONGODB_URI=mongodb://localhost:27017/guidelinesync
   JWT_SECRET=your-super-secret-jwt-key
   AWS_REGION=eu-west-2
   AWS_ACCESS_KEY_ID=your-aws-access-key
   AWS_SECRET_ACCESS_KEY=your-aws-secret-key
   AWS_S3_BUCKET=your-s3-bucket-name
   PORT=3000
   ```

4. **Start the server**:
   ```bash
   # Development
   npm run dev
   
   # Production
   npm start
   ```

### Frontend Setup

1. **Navigate to app directory**:
   ```bash
   cd GuidelineSync
   ```

2. **Install dependencies**:
   ```bash
   npm install
   ```

3. **Environment Configuration**:
   Create `.env` file:
   ```env
   EXPO_PUBLIC_API_URL=http://localhost:3000/api
   EXPO_PUBLIC_AWS_REGION=eu-west-2
   EXPO_PUBLIC_AWS_S3_BUCKET=your-s3-bucket-name
   EXPO_PUBLIC_ENABLE_AI_CHAT=false
   ```

4. **Start the app**:
   ```bash
   # Web
   npm run web
   
   # iOS (requires macOS)
   npm run ios
   
   # Android
   npm run android
   
   # Development server
   npm start
   ```

### Database Setup

1. **Start MongoDB** (if running locally):
   ```bash
   mongod
   ```

2. **Create admin user** (via API or MongoDB shell):
   ```javascript
   // MongoDB shell
   use guidelinesync
   db.users.insertOne({
     email: "admin@example.com",
     password: "$2a$12$hashed_password_here", // Use bcrypt to hash
     name: "Admin User",
     role: "admin",
     isActive: true,
     createdAt: new Date(),
     updatedAt: new Date()
   })
   ```

### AWS S3 Setup

1. **Create S3 bucket** in AWS Console
2. **Set bucket permissions** for public read access to PDFs
3. **Create IAM user** with S3 permissions
4. **Add credentials** to environment variables

## API Endpoints

### Authentication
- `POST /api/auth/login` - User login
- `GET /api/auth/me` - Get current user
- `POST /api/auth/logout` - User logout
- `POST /api/auth/register` - Create new user (admin only)

### Guidelines
- `GET /api/guidelines` - Get guidelines with pagination/filtering
- `GET /api/guidelines/:id` - Get single guideline
- `POST /api/guidelines` - Create guideline (admin only)
- `PUT /api/guidelines/:id` - Update guideline (admin only)
- `DELETE /api/guidelines/:id` - Delete guideline (admin only)
- `GET /api/guidelines/search` - Search guidelines

### AI Chat
- `POST /api/ai/chat` - Send message to AI assistant
- `GET /api/ai/chat/history` - Get chat history
- `POST /api/ai/search-context` - Search for AI context

## Medical Specialties Supported

- Cardiology
- Respiratory
- Neurology
- Oncology
- Pediatrics
- Emergency Medicine
- Surgery
- Psychiatry
- Dermatology
- Orthopedics
- Radiology
- Pathology
- Anesthesiology
- General Medicine
- Other

## Security Features

- 🔐 JWT-based authentication
- 🔒 Password hashing with bcryptjs
- 🛡️ CORS protection
- 🔐 Secure file storage in AWS S3
- 📱 Secure local storage with MMKV
- ✅ Input validation and sanitization

## Compliance

- **GDPR Compliant**: Data protection and user privacy
- **HIPAA Ready**: Secure handling of healthcare data
- **Audit Trails**: Track all admin actions
- **Data Encryption**: At rest and in transit

## Development

### Code Quality
- **TypeScript**: Full type safety
- **ESLint**: Code linting
- **Prettier**: Code formatting
- **Jest**: Unit testing (setup ready)

### Performance
- **React Query**: Efficient data fetching and caching
- **FlashList**: Optimized list rendering
- **MongoDB Indexes**: Fast database queries
- **S3 CDN**: Fast PDF delivery

## Deployment

### Backend Deployment
- Deploy to AWS EC2, Heroku, or similar
- Use MongoDB Atlas for production database
- Configure AWS S3 for file storage
- Set up SSL certificates

### Frontend Deployment
- **Web**: Deploy to Vercel, Netlify, or AWS S3
- **Mobile**: Build with EAS Build and deploy to app stores
- **Environment**: Configure production environment variables

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## License

This project is licensed under the MIT License.

## Support

For support and questions:
- Create an issue in the repository
- Contact the development team
- Check the documentation

---

**GuidelineSync** - Streamlining clinical guideline access across NHS trusts 🏥

