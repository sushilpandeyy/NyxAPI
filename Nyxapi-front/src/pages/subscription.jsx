import React, { useState } from 'react';
import { Check, Crown, Zap, Shield, Star } from 'lucide-react';

const Subscription = () => {
 const [billingCycle, setBillingCycle] = useState('monthly');

 const plans = [
   {
     name: 'Free',
     price: 0,
     description: 'Perfect for getting started',
     features: [
       'Up to 5 projects',
       '1,000 API calls/month',
       'Basic endpoints',
       'Community support',
       'Standard response time'
     ],
     icon: Zap,
     color: 'text-dark-400',
     current: true
   },
   {
     name: 'Pro',
     price: billingCycle === 'monthly' ? 19 : 190,
     description: 'For professional developers',
     features: [
       'Unlimited projects',
       '100,000 API calls/month',
       'Advanced endpoints',
       'Priority support',
       'Custom headers & status codes',
       'Team collaboration',
       'Analytics dashboard'
     ],
     icon: Crown,
     color: 'text-primary-400',
     popular: true
   },
   {
     name: 'Enterprise',
     price: billingCycle === 'monthly' ? 99 : 990,
     description: 'For teams and organizations',
     features: [
       'Everything in Pro',
       'Unlimited API calls',
       'Custom domains',
       'SLA guarantee',
       'Dedicated support',
       'Advanced security',
       'SSO integration',
       'Custom integrations'
     ],
     icon: Shield,
     color: 'text-warning-400'
   }
 ];

 return (
   <div className="max-w-7xl mx-auto">
     {/* Header */}
     <div className="text-center mb-12">
       <h1 className="heading-1 mb-4">Choose Your Plan</h1>
       <p className="text-body text-xl max-w-2xl mx-auto">
         Scale your API development with plans designed for every stage of your journey.
       </p>
     </div>

     {/* Billing Toggle */}
     <div className="flex items-center justify-center mb-12">
       <div className="card p-2 flex items-center gap-4">
         <span className={`font-medium ${billingCycle === 'monthly' ? 'text-white' : 'text-dark-400'}`}>
           Monthly
         </span>
         <button
           onClick={() => setBillingCycle(billingCycle === 'monthly' ? 'yearly' : 'monthly')}
           className={`relative w-12 h-6 rounded-full transition-colors ${
             billingCycle === 'yearly' ? 'bg-primary-600' : 'bg-dark-700'
           }`}
         >
           <div className={`absolute w-4 h-4 bg-white rounded-full top-1 transition-transform ${
             billingCycle === 'yearly' ? 'translate-x-7' : 'translate-x-1'
           }`} />
         </button>
         <span className={`font-medium ${billingCycle === 'yearly' ? 'text-white' : 'text-dark-400'}`}>
           Yearly
         </span>
         {billingCycle === 'yearly' && (
           <span className="bg-primary-900/30 text-primary-300 px-2 py-1 rounded text-sm font-medium">
             Save 20%
           </span>
         )}
       </div>
     </div>

     {/* Plans Grid */}
     <div className="grid md:grid-cols-3 gap-8 mb-12">
       {plans.map((plan) => (
         <PlanCard
           key={plan.name}
           plan={plan}
           billingCycle={billingCycle}
         />
       ))}
     </div>

     {/* FAQ Section */}
     <div className="card">
       <h2 className="heading-3 mb-6">Frequently Asked Questions</h2>
       <div className="space-y-6">
         <FAQItem
           question="Can I change my plan anytime?"
           answer="Yes, you can upgrade or downgrade your plan at any time. Changes will be reflected in your next billing cycle."
         />
         <FAQItem
           question="What happens if I exceed my API call limit?"
           answer="We'll send you notifications before you reach your limit. You can upgrade your plan or your API calls will be temporarily throttled until the next billing cycle."
         />
         <FAQItem
           question="Do you offer refunds?"
           answer="We offer a 30-day money-back guarantee for all paid plans. Contact our support team for assistance."
         />
         <FAQItem
           question="Is there a setup fee?"
           answer="No, there are no setup fees or hidden charges. You only pay the monthly or yearly subscription fee."
         />
       </div>
     </div>
   </div>
 );
};

// Plan Card Component
const PlanCard = ({ plan, billingCycle }) => {
 const Icon = plan.icon;
 
 return (
   <div className={`card relative ${plan.popular ? 'border-primary-600 shadow-glow' : ''}`}>
     {plan.popular && (
       <div className="absolute -top-3 left-1/2 -translate-x-1/2">
         <div className="bg-primary-600 text-white px-4 py-1 rounded-full text-sm font-medium flex items-center gap-1">
           <Star size={14} />
           Most Popular
         </div>
       </div>
     )}
     
     <div className="text-center">
       <Icon size={32} className={`mx-auto mb-4 ${plan.color}`} />
       <h3 className="heading-3 mb-2">{plan.name}</h3>
       <p className="text-muted mb-6">{plan.description}</p>
       
       <div className="mb-6">
         <span className="heading-1">
           ${plan.price}
         </span>
         {plan.price > 0 && (
           <span className="text-dark-400">
             /{billingCycle === 'monthly' ? 'month' : 'year'}
           </span>
         )}
       </div>
     </div>

     <ul className="space-y-4 mb-8">
       {plan.features.map((feature, index) => (
         <li key={index} className="flex items-start gap-3">
           <Check size={16} className="text-success-400 mt-1 flex-shrink-0" />
           <span className="text-dark-200">{feature}</span>
         </li>
       ))}
     </ul>

     <button
       disabled={plan.current}
       className={`w-full ${
         plan.current 
           ? 'btn-secondary cursor-not-allowed opacity-50' 
           : plan.popular 
             ? 'btn-primary' 
             : 'btn-secondary'
       }`}
     >
       {plan.current ? 'Current Plan' : `Choose ${plan.name}`}
     </button>
   </div>
 );
};

// FAQ Item Component
const FAQItem = ({ question, answer }) => {
 const [isOpen, setIsOpen] = useState(false);
 
 return (
   <div className="border-b border-dark-700 last:border-b-0 pb-6 last:pb-0">
     <button
       onClick={() => setIsOpen(!isOpen)}
       className="flex items-center justify-between w-full text-left"
     >
       <h4 className="heading-4">{question}</h4>
       <div className={`transform transition-transform ${isOpen ? 'rotate-180' : ''}`}>
         <svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor">
           <path d="M4.707 5.293a1 1 0 00-1.414 1.414l4 4a1 1 0 001.414 0l4-4a1 1 0 00-1.414-1.414L8 8.586 4.707 5.293z"/>
         </svg>
       </div>
     </button>
     {isOpen && (
       <div className="mt-4">
         <p className="text-body">{answer}</p>
       </div>
     )}
   </div>
 );
};

export default Subscription;