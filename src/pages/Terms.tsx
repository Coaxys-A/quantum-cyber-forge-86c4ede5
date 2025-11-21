import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Shield } from 'lucide-react';
import { Footer } from '@/components/Footer';

export default function Terms() {
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
            <h1 className="text-4xl font-bold mb-6">Terms of Service</h1>
            <p className="text-muted-foreground mb-8">Last updated: {new Date().toLocaleDateString()}</p>

            <h2>Agreement to Terms</h2>
            <p>
              By accessing or using Hyperion-Flux ("the Service"), you agree to be bound by these Terms of
              Service ("Terms"). If you disagree with any part of the terms, you may not access the Service.
            </p>

            <h2>Account Registration</h2>
            <p>
              To use certain features of the Service, you must register for an account. You agree to:
            </p>
            <ul>
              <li>Provide accurate, current, and complete information</li>
              <li>Maintain the security of your account credentials</li>
              <li>Notify us immediately of any unauthorized access</li>
              <li>Accept responsibility for all activities under your account</li>
            </ul>

            <h2>Acceptable Use</h2>
            <p>You agree not to:</p>
            <ul>
              <li>Use the Service for any illegal purpose</li>
              <li>Attempt to gain unauthorized access to any part of the Service</li>
              <li>Interfere with or disrupt the Service</li>
              <li>Transmit viruses, malware, or harmful code</li>
              <li>Violate any applicable laws or regulations</li>
              <li>Infringe on intellectual property rights</li>
            </ul>

            <h2>Subscription and Payment</h2>
            <p>
              Some parts of the Service are billed on a subscription basis. You will be billed in advance
              on a recurring basis (monthly or yearly). Failure to pay will result in service suspension.
            </p>

            <h3>Refund Policy</h3>
            <p>
              We offer a 30-day money-back guarantee for new subscriptions. After 30 days, refunds are
              handled on a case-by-case basis.
            </p>

            <h2>Intellectual Property</h2>
            <p>
              The Service and its original content, features, and functionality are owned by Hyperion-Flux
              and are protected by international copyright, trademark, and other intellectual property laws.
            </p>

            <h2>User Content</h2>
            <p>
              You retain all rights to content you upload to the Service. By uploading content, you grant
              us a license to use, store, and process that content solely to provide the Service.
            </p>

            <h2>Data Security</h2>
            <p>
              We implement industry-standard security measures to protect your data. However, no method of
              transmission over the internet is 100% secure, and we cannot guarantee absolute security.
            </p>

            <h2>Service Availability</h2>
            <p>
              We strive to maintain 99.9% uptime but do not guarantee uninterrupted access. We may perform
              scheduled maintenance and will provide advance notice when possible.
            </p>

            <h2>Termination</h2>
            <p>
              We may terminate or suspend your account immediately, without prior notice, for any breach
              of these Terms. Upon termination, your right to use the Service will cease immediately.
            </p>

            <h2>Limitation of Liability</h2>
            <p>
              In no event shall Hyperion-Flux be liable for any indirect, incidental, special, consequential,
              or punitive damages arising out of or relating to your use of the Service.
            </p>

            <h2>Indemnification</h2>
            <p>
              You agree to indemnify and hold harmless Hyperion-Flux from any claims, damages, losses, or
              expenses arising from your use of the Service or violation of these Terms.
            </p>

            <h2>Governing Law</h2>
            <p>
              These Terms shall be governed by and construed in accordance with the laws of the jurisdiction
              in which Hyperion-Flux operates, without regard to conflict of law provisions.
            </p>

            <h2>Changes to Terms</h2>
            <p>
              We reserve the right to modify these Terms at any time. We will provide notice of significant
              changes. Continued use of the Service after changes constitutes acceptance of the new Terms.
            </p>

            <h2>Contact Information</h2>
            <p>
              If you have questions about these Terms, please contact us at:
            </p>
            <ul>
              <li>Email: legal@hyperionflux.com</li>
              <li>Address: TekNav Global Headquarters</li>
            </ul>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}