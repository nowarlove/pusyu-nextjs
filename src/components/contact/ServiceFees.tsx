"use client";

import React from 'react';
import { Section } from '@/components/ui/Section';
import { Card } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { Check, Star, ArrowRight, DollarSign, Clock, Users, Zap } from 'lucide-react';

interface Service {
  id: string;
  name: string;
  description?: string;
  price: number;
  unit: string; // hour, project, day
  features?: string[];
  active: boolean;
}

interface ServiceFeesProps {
  services: Service[];
}

export const ServiceFees: React.FC<ServiceFeesProps> = ({ services }) => {
  const scrollToForm = () => {
    const formSection = document.getElementById('contact-form');
    formSection?.scrollIntoView({ behavior: 'smooth' });
  };

  // Format price display
  const formatPrice = (price: number, unit: string) => {
    switch (unit) {
      case 'hour':
        return `$${price}/hr`;
      case 'day':
        return `$${price}/day`;
      case 'project':
        return `$${price}/project`;
      default:
        return `$${price}/${unit}`;
    }
  };

  // Get duration text
  const getDuration = (unit: string) => {
    switch (unit) {
      case 'hour':
        return 'Hourly rate';
      case 'day':
        return 'Daily rate';
      case 'project':
        return 'Fixed project price';
      default:
        return `Per ${unit}`;
    }
  };

  // Filter active services
  const activeServices = services.filter(service => service.active);

  // If no services, show default
  if (activeServices.length === 0) {
    return (
      <Section background="gray">
        <div className="text-center">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">Service Fees</h2>
          <p className="text-gray-600">Service information is being updated. Please contact me for current rates.</p>
          <Button onClick={scrollToForm} className="mt-6">
            Get Quote
          </Button>
        </div>
      </Section>
    );
  }

  return (
    <Section background="gray">
      <div className="text-center mb-12">
        <h2 className="text-3xl font-bold text-gray-900 mb-4">Service Fees</h2>
        <p className="text-gray-600 max-w-2xl mx-auto">
          Transparent pricing for quality development services. All rates include consultation, development, testing, and basic support.
        </p>
      </div>

      {/* Main Services Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
        {activeServices.map((service, index) => (
          <Card 
            key={service.id} 
            className={`relative group hover:scale-105 transition-all duration-300 ${
              index === 2 || service.name.toLowerCase().includes('full stack') ? 'ring-2 ring-blue-500 lg:scale-105' : ''
            }`}
          >
            {/* Popular Badge */}
            {(index === 2 || service.name.toLowerCase().includes('full stack')) && (
              <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
                <Badge variant="warning" className="flex items-center gap-1 px-3 py-1">
                  <Star size={12} />
                  Most Popular
                </Badge>
              </div>
            )}

            <div className="text-center">
              {/* Service Icon */}
              <div className="inline-flex items-center justify-center w-16 h-16 bg-blue-100 rounded-full mb-4">
                {service.name.toLowerCase().includes('frontend') && <Zap className="w-8 h-8 text-blue-600" />}
                {service.name.toLowerCase().includes('backend') && <DollarSign className="w-8 h-8 text-blue-600" />}
                {service.name.toLowerCase().includes('full stack') && <Users className="w-8 h-8 text-blue-600" />}
                {service.name.toLowerCase().includes('consulting') && <Clock className="w-8 h-8 text-blue-600" />}
                {!['frontend', 'backend', 'full stack', 'consulting'].some(keyword => 
                  service.name.toLowerCase().includes(keyword)
                ) && <DollarSign className="w-8 h-8 text-blue-600" />}
              </div>

              {/* Service Title */}
              <h3 className="text-xl font-bold text-gray-900 mb-2">
                {service.name}
              </h3>
              
              {/* Description */}
              <p className="text-gray-600 text-sm mb-4 min-h-[2.5rem]">
                {service.description || 'Professional development service'}
              </p>

              {/* Price */}
              <div className="mb-4">
                <div className="text-3xl font-bold text-blue-600 mb-1">
                  {formatPrice(service.price, service.unit)}
                </div>
                <div className="text-sm text-gray-500">
                  {getDuration(service.unit)}
                </div>
              </div>

              {/* Features */}
              <div className="space-y-3 mb-6">
                {service.features && service.features.length > 0 ? (
                  service.features.map((feature, featureIndex) => (
                    <div key={featureIndex} className="flex items-center gap-2 text-sm">
                      <Check className="w-4 h-4 text-green-600 flex-shrink-0" />
                      <span className="text-gray-700">{feature}</span>
                    </div>
                  ))
                ) : (
                  // Default features based on service type
                  <>
                    <div className="flex items-center gap-2 text-sm">
                      <Check className="w-4 h-4 text-green-600 flex-shrink-0" />
                      <span className="text-gray-700">Professional Quality</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm">
                      <Check className="w-4 h-4 text-green-600 flex-shrink-0" />
                      <span className="text-gray-700">Timely Delivery</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm">
                      <Check className="w-4 h-4 text-green-600 flex-shrink-0" />
                      <span className="text-gray-700">Post-Launch Support</span>
                    </div>
                  </>
                )}
              </div>

              {/* CTA Button */}
              <Button
                onClick={scrollToForm}
                variant={(index === 2 || service.name.toLowerCase().includes('full stack')) ? 'primary' : 'outline'}
                className="w-full gap-2 group-hover:scale-105 transition-transform"
              >
                Get Started
                <ArrowRight size={16} />
              </Button>
            </div>
          </Card>
        ))}
      </div>

      {/* Additional Service Options */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
        {/* Custom Projects */}
        <Card className="p-6 bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-200">
          <div className="text-center">
            <Users className="w-12 h-12 text-blue-600 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-blue-900 mb-2">
              Custom Projects & Enterprise Solutions
            </h3>
            <p className="text-blue-700 mb-4 text-sm">
              Need something more complex? I offer custom pricing for large-scale projects, 
              long-term partnerships, and enterprise solutions.
            </p>
            <Button onClick={scrollToForm} variant="primary" className="gap-2">
              Discuss Custom Project
              <ArrowRight size={16} />
            </Button>
          </div>
        </Card>

        {/* Maintenance & Support */}
        <Card className="p-6 bg-gradient-to-r from-green-50 to-emerald-50 border border-green-200">
          <div className="text-center">
            <Clock className="w-12 h-12 text-green-600 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-green-900 mb-2">
              Maintenance & Support Plans
            </h3>
            <p className="text-green-700 mb-4 text-sm">
              Keep your website running smoothly with ongoing maintenance, 
              updates, security monitoring, and technical support.
            </p>
            <Button onClick={scrollToForm} variant="outline" className="gap-2 border-green-300 text-green-700 hover:bg-green-700 hover:text-white">
              Learn More
              <ArrowRight size={16} />
            </Button>
          </div>
        </Card>
      </div>

      {/* Pricing Information */}
      <div className="bg-white rounded-xl border border-gray-200 p-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-center">
          <div>
            <DollarSign className="w-8 h-8 text-green-600 mx-auto mb-2" />
            <h4 className="font-semibold text-gray-900 mb-1">Payment Terms</h4>
            <p className="text-gray-600 text-sm">50% upfront, 50% on completion</p>
          </div>
          <div>
            <Clock className="w-8 h-8 text-blue-600 mx-auto mb-2" />
            <h4 className="font-semibold text-gray-900 mb-1">Free Consultation</h4>
            <p className="text-gray-600 text-sm">Project scoping and planning included</p>
          </div>
          <div>
            <Users className="w-8 h-8 text-purple-600 mx-auto mb-2" />
            <h4 className="font-semibold text-gray-900 mb-1">Support Included</h4>
            <p className="text-gray-600 text-sm">30-day post-launch support</p>
          </div>
        </div>
      </div>

      {/* Payment & Currency Info */}
      <div className="mt-6 text-center text-sm text-gray-600 space-y-1">
        <p>💳 All prices are in USD • Payment via bank transfer, PayPal, or cryptocurrency</p>
        <p>🔒 Secure payment processing • 📋 Detailed contracts and invoicing</p>
        <p>🌍 Working with clients worldwide • 🕐 Flexible timezone accommodation</p>
      </div>
    </Section>
  );
};