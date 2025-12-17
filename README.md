# AminSender - Bulk Email Sender Platform

A complete SaaS platform for bulk email sending powered by AWS Simple Email Service (SES). Built with Next.js 14, TypeScript, Tailwind CSS, and Supabase.

## Features

- 📧 **High Deliverability**: Powered by AWS SES for reliable inbox delivery
- 📊 **Real-Time Analytics**: Track opens, clicks, bounces, and engagement
- ✅ **Email Verification**: Verify contact lists with Hunter.io or fallback MX checks
- 🎨 **Rich Email Editor**: Create beautiful HTML emails with React Quill
- 📋 **CSV Import**: Upload and manage contact lists easily
- 🔒 **Secure & Compliant**: SPF/DKIM/DMARC authentication, unsubscribe links, bounce handling
- 👤 **Admin-Only Access**: Single admin role with Supabase Auth
- ⚡ **Fast & Scalable**: Intelligent rate limiting and throttling

## Tech Stack

- **Framework**: Next.js 14+ (App Router)
- **Language**: TypeScript
- **Database**: Supabase (PostgreSQL)
- **Email Service**: AWS SES
- **UI**: Tailwind CSS + Shadcn/UI components
- **Auth**: Supabase Auth
- **Email Verification**: Hunter.io API (optional)
- **File Uploads**: Uploadthing (optional)

## Getting Started

### Prerequisites

- Node.js 18+ installed
- A Supabase account ([supabase.com](https://supabase.com))
- An AWS account with SES enabled ([aws.amazon.com/ses](https://aws.amazon.com/ses/))
- (Optional) Hunter.io API key for email verification

### Installation

1. **Clone the repository**
   ```bash
   git clone <your-repo-url>
   cd ENZOMAILPRO
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up Supabase**

   - Create a new project at [supabase.com](https://supabase.com)
   - Go to SQL Editor and run the `supabase-schema.sql` file
   - Go to Authentication → Providers and enable Email provider
   - **Create an admin user** (See `ADMIN_SETUP.md` for detailed instructions):
     - Go to Authentication → Users → Add User
     - Set email and password
     - This will be your admin login
     - Or disable email confirmation in Authentication → Settings

4. **Set up environment variables**

   Create a `.env.local` file in the root directory:

   ```env
   # Supabase
   NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url
   SUPABASE_SERVICE_ROLE_KEY=your_service_role_key
   NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key

  # AWS SES
  AWS_REGION=us-east-1
  AWS_ACCESS_KEY_ID=your_access_key_id
  AWS_SECRET_ACCESS_KEY=your_secret_access_key

   # Hunter.io (Optional - for email verification)
   HUNTER_API_KEY=your_hunter_api_key

   # Uploadthing (Optional - for image uploads)
   UPLOADTHING_SECRET=your_uploadthing_secret
   NEXT_PUBLIC_UPLOADTHING_URL=https://uploadthing.com
   NEXT_PUBLIC_UPLOADTHING_KEY=your_uploadthing_key
   ```

   You can find these values:
   - **Supabase**: Go to Project Settings → API
  - **AWS SES**: Go to IAM for keys, and SES → Verified identities
   - **Hunter.io**: Sign up at [hunter.io](https://hunter.io) (free tier: 50 verifications/month)
   - **Uploadthing**: Sign up at [uploadthing.com](https://uploadthing.com)

5. **Configure AWS SES**

  - Go to AWS Console → SES → Verified identities
  - Verify your sending domain and add DKIM CNAME records
  - This is crucial for deliverability

6. **Run the development server**
   ```bash
   npm run dev
   ```

7. **Open your browser**
   - Homepage: [http://localhost:3000](http://localhost:3000)
- Admin Login: [http://localhost:3000/admin/login](http://localhost:3000/admin/login)

## Project Structure

```
ENZOMAILPRO/
├── app/                      # Next.js App Router pages
│   ├── page.tsx             # Homepage (marketing)
│   ├── admin/               # Admin pages
│   │   ├── login/          # Login page
│   │   ├── dashboard/      # Dashboard with metrics
│   │   ├── lists/          # Contact list management
│   │   ├── campaigns/      # Campaign builder
│   │   ├── analytics/      # Analytics dashboard
│   │   └── settings/       # Settings & SES config
│   ├── layout.tsx          # Root layout
│   └── globals.css         # Global styles
├── components/              # React components
│   └── AdminLayout.tsx     # Admin layout with sidebar
├── lib/                     # Utilities and helpers
│   ├── supabase/           # Supabase client config
│   ├── ses.ts             # AWS SES integration
│   └── email-verification.ts # Email verification
├── middleware.ts           # Auth middleware
├── supabase-schema.sql     # Database schema
└── README.md               # This file
```

## Usage

### 1. Admin Login

- Go to `/admin/login`
- Use your admin credentials (created in Supabase)
- You'll be redirected to the dashboard

### 2. Upload Contact Lists

- Go to **Lists** page
- Click "Choose File" and upload a CSV file
- Format: `email, name, custom_field`
- The system will parse and store contacts

### 3. Verify Contacts (Optional)

- Click "Verify" on a list
- The system will verify emails using Hunter.io or MX records
- Invalid emails will be marked and filtered out

### 4. Create Campaigns

- Go to **Campaigns** page
- Fill in sender name and email
- Select a list
- Write subject and HTML content
- Preview and send

### 5. Track Analytics

- Go to **Analytics** page
- View opens, clicks, bounces
- Export reports

### 6. Configure Settings

- Go to **Settings** page
- Add your SendGrid API key
- Follow DNS setup instructions for SPF/DKIM/DMARC
- Test your configuration

## AWS SES Compliance

To ensure your emails land in the inbox:

1. **Authentication**: Set up SPF, DKIM, and DMARC records
   - Follow the guide in Settings page
  - Instructions are also at [AWS SES Docs](https://docs.aws.amazon.com/ses/)

2. **Content Guidelines**:
   - No spam words in subject lines
   - Balanced text-to-image ratio
   - Limit to 2-3 links per email
  - Include unsubscribe link in your footer

3. **List Hygiene**:
   - Remove invalid emails regularly
   - Honor unsubscribes immediately
   - Keep complaint rate low (<0.1%)

4. **Rate Limiting**:
   - Start with 1000 emails/day
   - Gradually increase as reputation improves
   - Current setup: 10 emails/second throttling

## Deployment to Vercel

1. Push your code to GitHub

2. Import project in [Vercel](https://vercel.com)

3. Add environment variables in Vercel dashboard

4. Deploy!

The app will automatically build and deploy.

## Environment Variables Summary

| Variable | Description | Required |
|----------|-------------|----------|
| `NEXT_PUBLIC_SUPABASE_URL` | Your Supabase project URL | ✅ |
| `SUPABASE_SERVICE_ROLE_KEY` | Supabase service role key | ✅ |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Supabase anonymous key | ✅ |
| `AWS_REGION` | AWS region for SES (e.g., `us-east-1`) | ✅ |
| `AWS_ACCESS_KEY_ID` | AWS Access Key ID | ✅ |
| `AWS_SECRET_ACCESS_KEY` | AWS Secret Access Key | ✅ |
| `HUNTER_API_KEY` | Hunter.io API key (for verification) | ❌ |
| `UPLOADTHING_SECRET` | Uploadthing secret | ❌ |
| `NEXT_PUBLIC_UPLOADTHING_URL` | Uploadthing URL | ❌ |
| `NEXT_PUBLIC_UPLOADTHING_KEY` | Uploadthing API key | ❌ |

## Database Schema

See `supabase-schema.sql` for complete schema details. Key tables:

- **lists**: CSV uploads
- **subscribers**: Verified contacts
- **campaigns**: Email campaigns
- **sends**: Individual email tracking
- **settings**: Configuration (API keys, etc.)

## Troubleshooting

### Emails going to spam?

- Check SPF/DKIM/DMARC records are set up correctly
- Verify sender reputation and limits in AWS SES
- Avoid spam words in subject lines
- Keep image ratio low

### Authentication errors?

- Verify Supabase credentials in `.env.local`
- Check RLS policies are enabled
- Ensure admin user exists in Supabase Auth

### AWS SES errors?

- Verify AWS credentials and region are correct
- Ensure domain identity is verified and in production (SES sandbox limits apply)
- Confirm IAM permissions include `ses:SendEmail`

## Support

For issues and questions:
- Check [Next.js documentation](https://nextjs.org/docs)
- Check [AWS SES documentation](https://docs.aws.amazon.com/ses/)
- Check [Supabase documentation](https://supabase.com/docs)

## License

MIT License - feel free to use this project for your needs.

---

Built with ❤️ using Next.js, TypeScript, and AWS SES
