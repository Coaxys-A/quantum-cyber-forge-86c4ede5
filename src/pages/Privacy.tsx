import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Shield } from 'lucide-react';
import { Footer } from '@/components/Footer';

export default function Privacy() {
  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b border-border/50 bg-background/95 backdrop-blur">
        <div className="container mx-auto px-4 h-16 flex items-center justify-between">
          <Link to="/" className="flex items-center gap-2">
            <Shield className="h-8 w-8 text-primary" />
            <span className="text-xl font-bold">Hyperion-Flux</span>
          </Link>
          <Link to="/app/login">
            <Button>Sign In</Button>
          </Link>
        </div>
      </header>

      <section className="py-20">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto prose prose-slate dark:prose-invert">
            <h1 className="text-4xl font-bold mb-6">Privacy Policy</h1>
            <p className="text-muted-foreground mb-8">Last updated: {new Date().toLocaleDateString()}</p>

            <h2>Introduction</h2>
            <p>
              At Hyperion-Flux, we take your privacy seriously. This Privacy Policy explains how we collect,
              use, disclose, and safeguard your information when you use our cyber operations platform.
            </p>

            <h2>Information We Collect</h2>
            <h3>Personal Information</h3>
            <p>
              We collect information that you provide directly to us, including:
            </p>
            <ul>
              <li>Name and contact information</li>
              <li>Account credentials</li>
              <li>Organization details</li>
              <li>Payment information</li>
              <li>Communications with our support team</li>
            </ul>

            <h3>Usage Information</h3>
            <p>
              We automatically collect certain information about your device and how you interact with our platform:
            </p>
            <ul>
              <li>Log data and analytics</li>
              <li>Device information</li>
              <li>IP address and location data</li>
              <li>Cookies and similar technologies</li>
            </ul>

            <h2>How We Use Your Information</h2>
            <p>We use the information we collect to:</p>
            <ul>
              <li>Provide, maintain, and improve our services</li>
              <li>Process transactions and send related information</li>
              <li>Send technical notices and support messages</li>
              <li>Respond to your comments and questions</li>
              <li>Monitor and analyze trends and usage</li>
              <li>Detect and prevent fraud and abuse</li>
            </ul>

            <h2>Data Security</h2>
            <p>
              We implement appropriate technical and organizational measures to protect your personal data,
              including encryption, access controls, and regular security assessments. We are committed to
              maintaining SOC 2 and ISO 27001 compliance standards.
            </p>

            <h2>Data Retention</h2>
            <p>
              We retain your personal information for as long as necessary to provide our services and
              comply with legal obligations. You can request deletion of your data at any time by
              contacting us at privacy@hyperionflux.com.
            </p>

            <h2>International Transfers</h2>
            <p>
              Your information may be transferred to and processed in countries other than your country of
              residence. We ensure appropriate safeguards are in place for such transfers.
            </p>

            <h2>Your Rights</h2>
            <p>Depending on your location, you may have the following rights:</p>
            <ul>
              <li>Access your personal data</li>
              <li>Correct inaccurate data</li>
              <li>Request deletion of your data</li>
              <li>Object to or restrict processing</li>
              <li>Data portability</li>
              <li>Withdraw consent</li>
            </ul>

            <h2>Cookies</h2>
            <p>
              We use cookies and similar tracking technologies to track activity on our platform and store
              certain information. You can instruct your browser to refuse all cookies or to indicate when
              a cookie is being sent.
            </p>

            <h2>Children's Privacy</h2>
            <p>
              Our services are not intended for individuals under the age of 18. We do not knowingly collect
              personal information from children.
            </p>

            <h2>Changes to This Policy</h2>
            <p>
              We may update this Privacy Policy from time to time. We will notify you of any changes by
              posting the new policy on this page and updating the "Last updated" date.
            </p>

            <h2>Contact Us</h2>
            <p>
              If you have questions about this Privacy Policy, please contact us at:
            </p>
            <ul>
              <li>Email: privacy@hyperionflux.com</li>
              <li>Address: TekNav Global Headquarters</li>
            </ul>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}