"use client";

import React, { useState } from 'react';
import { Section } from '@/components/ui/Section';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { Send, CheckCircle, AlertCircle, FileText } from 'lucide-react';

interface FormData {
  name: string;
  email: string;
  phone: string;
  subject: string;
  projectType: string;
  budget: string;
  timeline: string;
  message: string;
  company?: string;
  website?: string;
}

export const ContactForm: React.FC = () => {
  const [formData, setFormData] = useState<FormData>({
    name: '',
    email: '',
    phone: '',
    subject: '',
    projectType: '',
    budget: '',
    timeline: '',
    message: '',
    company: '',
    website: ''
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState<'idle' | 'success' | 'error'>('idle');
  const [errorMessage, setErrorMessage] = useState('');

  const projectTypes = [
    'Web Development',
    'Mobile App Development',
    'E-commerce Website',
    'Portfolio Website',
    'Landing Page',
    'Web Application',
    'API Development',
    'Database Design',
    'Technical Consulting',
    'Code Review & Optimization',
    'Other'
  ];

  const budgetRanges = [
    'Under $1,000',
    '$1,000 - $3,000',
    '$3,000 - $5,000',
    '$5,000 - $10,000',
    '$10,000 - $25,000',
    '$25,000 - $50,000',
    '$50,000+',
    'Hourly Rate ($50-100/hr)',
    'Monthly Retainer',
    'Let\'s Discuss'
  ];

  const timelineOptions = [
    'ASAP (Rush Job)',
    '1-2 weeks',
    '2-4 weeks',
    '1-2 months',
    '2-3 months',
    '3-6 months',
    '6+ months',
    'Ongoing/Maintenance',
    'Flexible'
  ];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setErrorMessage('');

    // Basic validation
    if (!formData.name || !formData.email || !formData.message) {
      setErrorMessage('Please fill in all required fields');
      setIsSubmitting(false);
      return;
    }

    try {
      const response = await fetch('/api/contact', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name: formData.name,
          email: formData.email,
          phone: formData.phone,
          subject: formData.subject || `${formData.projectType} Inquiry`,
          message: `
Project Type: ${formData.projectType}
Budget: ${formData.budget}
Timeline: ${formData.timeline}
Company: ${formData.company || 'Not specified'}
Website: ${formData.website || 'Not specified'}
Phone: ${formData.phone || 'Not provided'}

Message:
${formData.message}
          `.trim()
        })
      });

      const result = await response.json();

      if (response.ok && result.success) {
        setSubmitStatus('success');
        // Reset form
        setFormData({
          name: '',
          email: '',
          phone: '',
          subject: '',
          projectType: '',
          budget: '',
          timeline: '',
          message: '',
          company: '',
          website: ''
        });
      } else {
        setSubmitStatus('error');
        setErrorMessage(result.message || 'Failed to send message. Please try again.');
      }
    } catch (error) {
      setSubmitStatus('error');
      setErrorMessage('Network error. Please check your connection and try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  return (
    <Section background="white">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">
            Start Your Project
          </h2>
          <p className="text-gray-600 text-lg">
            Tell me about your project and let's bring it to life together
          </p>
          <div className="flex items-center justify-center gap-2 mt-4">
            <FileText className="w-5 h-5 text-blue-600" />
            <span className="text-sm text-gray-600">
              Free consultation • 24-hour response time • No obligation
            </span>
          </div>
        </div>

        <Card className="relative">
          {submitStatus === 'success' && (
            <div className="absolute inset-0 bg-white bg-opacity-95 flex items-center justify-center rounded-xl z-10">
              <div className="text-center max-w-md">
                <CheckCircle className="w-16 h-16 text-green-600 mx-auto mb-4" />
                <h3 className="text-2xl font-bold text-gray-900 mb-2">Message Sent Successfully!</h3>
                <p className="text-gray-600 mb-4">
                  Thank you for reaching out! I'll review your project details and get back to you within 24 hours.
                </p>
                <Button
                  onClick={() => setSubmitStatus('idle')}
                  variant="outline"
                >
                  Send Another Message
                </Button>
              </div>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Contact Information */}
            <div className="border-b border-gray-200 pb-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Contact Information</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-2">
                    Full Name *
                  </label>
                  <input
                    type="text"
                    id="name"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors"
                    placeholder="Your full name"
                  />
                </div>

                <div>
                  <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                    Email Address *
                  </label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors"
                    placeholder="your.email@example.com"
                  />
                </div>

                <div>
                  <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-2">
                    Phone Number
                  </label>
                  <input
                    type="tel"
                    id="phone"
                    name="phone"
                    value={formData.phone}
                    onChange={handleChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors"
                    placeholder="+62 812-3456-7890"
                  />
                </div>

                <div>
                  <label htmlFor="company" className="block text-sm font-medium text-gray-700 mb-2">
                    Company/Organization
                  </label>
                  <input
                    type="text"
                    id="company"
                    name="company"
                    value={formData.company}
                    onChange={handleChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors"
                    placeholder="Your company name"
                  />
                </div>

                <div className="md:col-span-2">
                  <label htmlFor="website" className="block text-sm font-medium text-gray-700 mb-2">
                    Current Website (if any)
                  </label>
                  <input
                    type="url"
                    id="website"
                    name="website"
                    value={formData.website}
                    onChange={handleChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors"
                    placeholder="https://yourwebsite.com"
                  />
                </div>
              </div>
            </div>

            {/* Project Details */}
            <div className="border-b border-gray-200 pb-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Project Details</h3>
              
              <div className="mb-4">
                <label htmlFor="subject" className="block text-sm font-medium text-gray-700 mb-2">
                  Project Title/Subject *
                </label>
                <input
                  type="text"
                  id="subject"
                  name="subject"
                  value={formData.subject}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors"
                  placeholder="Brief title for your project"
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label htmlFor="projectType" className="block text-sm font-medium text-gray-700 mb-2">
                    Project Type
                  </label>
                  <select
                    id="projectType"
                    name="projectType"
                    value={formData.projectType}
                    onChange={handleChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors"
                  >
                    <option value="">Select project type</option>
                    {projectTypes.map((type) => (
                      <option key={type} value={type}>{type}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label htmlFor="budget" className="block text-sm font-medium text-gray-700 mb-2">
                    Budget Range
                  </label>
                  <select
                    id="budget"
                    name="budget"
                    value={formData.budget}
                    onChange={handleChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors"
                  >
                    <option value="">Select budget range</option>
                    {budgetRanges.map((budget) => (
                      <option key={budget} value={budget}>{budget}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label htmlFor="timeline" className="block text-sm font-medium text-gray-700 mb-2">
                    Timeline
                  </label>
                  <select
                    id="timeline"
                    name="timeline"
                    value={formData.timeline}
                    onChange={handleChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors"
                  >
                    <option value="">Select timeline</option>
                    {timelineOptions.map((timeline) => (
                      <option key={timeline} value={timeline}>{timeline}</option>
                    ))}
                  </select>
                </div>
              </div>
            </div>

            {/* Project Description */}
            <div>
              <label htmlFor="message" className="block text-sm font-medium text-gray-700 mb-2">
                Project Description *
              </label>
              <textarea
                id="message"
                name="message"
                value={formData.message}
                onChange={handleChange}
                required
                rows={6}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none transition-colors"
                placeholder="Please describe your project in detail. Include:
• What you want to build
• Key features and functionality
• Target audience
• Any specific requirements or preferences
• Existing challenges or pain points
• Success criteria"
              />
            </div>

            {/* Error Message */}
            {(submitStatus === 'error' || errorMessage) && (
              <div className="flex items-center gap-2 p-4 bg-red-50 border border-red-200 rounded-lg">
                <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0" />
                <p className="text-red-700">{errorMessage || 'There was an error sending your message. Please try again.'}</p>
              </div>
            )}

            {/* Submit Button */}
            <div className="text-center pt-4">
              <Button
                type="submit"
                size="lg"
                disabled={isSubmitting}
                className="gap-2 min-w-[200px]"
              >
                {isSubmitting ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    Sending...
                  </>
                ) : (
                  <>
                    <Send size={18} />
                    Send Message
                  </>
                )}
              </Button>
              
              <p className="text-sm text-gray-500 mt-3">
                I'll get back to you within 24 hours with a detailed proposal
              </p>
            </div>
          </form>
        </Card>

        {/* Additional Information */}
        <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-6 text-center">
          <div className="p-4 bg-blue-50 rounded-lg">
            <h4 className="font-semibold text-blue-900 mb-2">Free Consultation</h4>
            <p className="text-blue-700 text-sm">Initial project discussion at no cost</p>
          </div>
          <div className="p-4 bg-green-50 rounded-lg">
            <h4 className="font-semibold text-green-900 mb-2">Quick Response</h4>
            <p className="text-green-700 text-sm">Response within 24 hours guaranteed</p>
          </div>
          <div className="p-4 bg-purple-50 rounded-lg">
            <h4 className="font-semibold text-purple-900 mb-2">No Commitment</h4>
            <p className="text-purple-700 text-sm">No obligation to proceed after consultation</p>
          </div>
        </div>
      </div>
    </Section>
  );
};